-- Aura · going live
--
-- What the app needs once real people use one database from many phones:
--   1. An invitation can be read before signing in, and says only what the
--      join screen shows.
--   2. Joining an assessment puts the athlete in its course straight away.
--   3. Evidence an assessment wrote goes when the assessment, or the athlete's
--      part in it, goes.
--   4. A guest who already has an account can move a test day's results into it.
--   5. The assessment tables announce their changes, so a coach's board is live.
--
-- Safe to run on a project that already has 0001–0005. Run it once.

-- ── 1 · Reading an invitation ────────────────────────────────────────────

-- The token is the only way to learn anything about a session from outside
-- it, and this is all it tells: enough to decide whether to join.
create function public.peek_invite(token text)
returns table (session_id uuid, title text, group_name text, coach_name text, kind text, protocol text, stations text[], course_title text)
language sql stable security definer set search_path = public as $$
  select s.id, s.title, s.group_name, p.name, s.kind, s.protocol, s.stations, c.title
  from public.assessment_sessions s
  join public.profiles p on p.id = s.owner_id
  left join public.courses c on c.id = s.course_id
  where s.invite_token = token and not s.solo and s.status = 'open'
    and (s.invite_expires_at is null or s.invite_expires_at > now());
$$;

-- ── 2 · Joining enrols ───────────────────────────────────────────────────

-- As before, plus: the course an assessment belongs to is joined with it, so
-- the group is one pool from the first scan rather than from finalising.
create or replace function public.join_assessment(token text, share text default 'coach') returns uuid
language plpgsql security definer set search_path = public as $$
declare
  s public.assessment_sessions;
  me uuid := auth.uid();
begin
  if me is null then
    raise exception 'sign in to join';
  end if;
  select * into s from public.assessment_sessions where invite_token = token;
  if s.id is null or s.solo or s.status <> 'open' or (s.invite_expires_at is not null and s.invite_expires_at < now()) then
    raise exception 'this invitation is not valid';
  end if;
  insert into public.profiles (id) values (me) on conflict (id) do nothing;
  insert into public.assessment_participants (session_id, athlete_id, display_name, sharing)
  select s.id, me, p.name, case when share = 'group' then 'group' else 'coach' end from public.profiles p where p.id = me
  on conflict (session_id, athlete_id) do update set sharing = excluded.sharing, display_name = excluded.display_name;
  if s.course_id is not null and me <> s.owner_id then
    insert into public.course_enrollments (course_id, athlete_id) values (s.course_id, me)
    on conflict (course_id, athlete_id) do nothing;
  end if;
  return s.id;
end;
$$;

-- ── 3 · Evidence follows its assessment ──────────────────────────────────

alter table public.evidence drop constraint evidence_assessment_fk;
alter table public.evidence add constraint evidence_assessment_fk
  foreign key (assessment_id) references public.assessment_sessions (id) on delete cascade;

create function public.forget_participant_evidence() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if old.athlete_id is not null then
    delete from public.evidence where assessment_id = old.session_id and athlete_id = old.athlete_id;
  end if;
  return old;
end;
$$;

create trigger assessment_participants_forget after delete on public.assessment_participants
for each row execute function public.forget_participant_evidence();

-- ── 4 · Keeping a guest's results in an existing account ─────────────────

-- A guest account becomes a full one by adding a sign-in to it; nothing moves.
-- This is for the other case: the athlete already has an account. The guest
-- asks for a code, signs in to their own account, and hands the code over.
create table public.guest_claims (
  code text primary key default replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''),
  guest_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- No policies: the table is reached through the two functions below only.
alter table public.guest_claims enable row level security;

create function public.start_claim() returns text
language plpgsql security definer set search_path = public as $$
declare
  c text;
begin
  if auth.uid() is null or not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'only a guest profile can be handed over';
  end if;
  delete from public.guest_claims where guest_id = auth.uid() or created_at < now() - interval '1 hour';
  insert into public.guest_claims (guest_id) values (auth.uid()) returning code into c;
  return c;
end;
$$;

create function public.finish_claim(claim text) returns integer
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  g uuid;
  moved integer;
begin
  if me is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'sign in to your own account first';
  end if;
  select guest_id into g from public.guest_claims where code = claim and created_at > now() - interval '1 hour';
  if g is null or g = me then
    raise exception 'this hand-over code is not valid';
  end if;

  -- Where both took part in the same session, the account's own entry stands.
  update public.assessment_participants p set athlete_id = me
  where p.athlete_id = g
    and not exists (select 1 from public.assessment_participants x where x.session_id = p.session_id and x.athlete_id = me);
  get diagnostics moved = row_count;

  update public.evidence e set athlete_id = me
  where e.athlete_id = g
    and (e.assessment_id is null or not exists (
      select 1 from public.assessment_participants x where x.session_id = e.assessment_id and x.athlete_id = g));

  insert into public.course_enrollments (course_id, athlete_id, status, joined_at)
  select course_id, me, status, joined_at from public.course_enrollments where athlete_id = g
  on conflict (course_id, athlete_id) do nothing;
  delete from public.course_enrollments where athlete_id = g;

  update public.workout_logs set athlete_id = me where athlete_id = g;
  insert into public.athlete_goals (athlete_id, skill_id, created_at)
  select me, skill_id, created_at from public.athlete_goals where athlete_id = g
  on conflict (athlete_id, skill_id) do nothing;

  delete from public.guest_claims where guest_id = g;
  return moved;
end;
$$;

-- ── 5 · Live updates ─────────────────────────────────────────────────────

-- Supabase Realtime sends a change only to those the row-level rules let read
-- it. Skipped where the publication does not exist (a plain Postgres).
do $$
declare
  t text;
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    return;
  end if;
  foreach t in array array['assessment_sessions', 'assessment_participants', 'assessment_results', 'evidence', 'course_enrollments', 'feedback'] loop
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end;
$$;

-- ── Grants ───────────────────────────────────────────────────────────────

revoke all on public.guest_claims from anon, authenticated;
grant execute on function public.peek_invite(text) to anon, authenticated;
grant execute on function public.join_assessment(text, text), public.start_claim(), public.finish_claim(text) to authenticated;
revoke execute on function public.start_claim(), public.finish_claim(text) from anon;
revoke execute on function public.forget_participant_evidence() from anon, authenticated;
