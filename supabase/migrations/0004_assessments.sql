-- Aura · assessments
--
-- A session is one assessment event: a coach's group session or an athlete
-- testing alone. People join a group session with its invitation token, never
-- by browsing. Individual results are visible to the athlete and the session's
-- coach only; the rest of the group sees anonymous totals, plus the shape of
-- anyone who chose to share it.

-- ── Evidence learns about observation and assessments ────────────────────

alter table public.evidence add column observed_by uuid references public.profiles (id) on delete set null;
alter table public.evidence add column assessment_id uuid;
alter table public.evidence drop constraint evidence_source_check;
alter table public.evidence add constraint evidence_source_check check (source in ('onboarding', 'workout', 'manual', 'assessment'));
alter table public.evidence add constraint evidence_observed_check check (tier <> 'observed' or observed_by is not null);

alter table public.mastery_ratings drop constraint mastery_ratings_status_check;
alter table public.mastery_ratings add constraint mastery_ratings_status_check check (status in ('unrated', 'estimated', 'self', 'observed', 'verified'));
alter table public.aura_records drop constraint aura_records_status_check;
alter table public.aura_records add constraint aura_records_status_check check (status in ('unrated', 'estimated', 'self', 'observed', 'verified'));

-- ── Tables ───────────────────────────────────────────────────────────────

create table public.assessment_sessions (
  id uuid primary key default gen_random_uuid(),
  -- The coach of a group session, or the athlete of a solo one.
  owner_id uuid not null references public.profiles (id) on delete cascade,
  solo boolean not null default false,
  protocol text not null,
  kind text not null default 'baseline' check (kind in ('baseline', 'retest')),
  title text not null default 'Baseline',
  group_name text not null default '',
  course_id uuid references public.courses (id) on delete set null,
  baseline_id uuid references public.assessment_sessions (id) on delete set null,
  stations text[] not null check (cardinality(stations) > 0),
  status text not null default 'open' check (status in ('open', 'finalised')),
  station_minutes smallint not null default 6,
  rotation_started_at timestamptz,
  -- What the QR code carries. Unguessable, revocable, and optionally short-lived.
  invite_token text not null unique default replace(gen_random_uuid()::text, '-', ''),
  invite_expires_at timestamptz,
  created_at timestamptz not null default now(),
  finalised_at timestamptz
);

alter table public.evidence add constraint evidence_assessment_fk foreign key (assessment_id) references public.assessment_sessions (id) on delete set null;

create table public.assessment_participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.assessment_sessions (id) on delete cascade,
  -- Null for someone the coach added by name who has no account yet.
  athlete_id uuid references public.profiles (id) on delete cascade,
  display_name text not null,
  sharing text not null default 'coach' check (sharing in ('coach', 'group')),
  partner_name text,
  skipped text[] not null default '{}',
  flags text[] not null default '{}',
  joined_at timestamptz not null default now(),
  submitted_at timestamptz,
  unique (session_id, athlete_id)
);

create table public.assessment_results (
  participant_id uuid not null references public.assessment_participants (id) on delete cascade,
  test_id text not null,
  value integer not null check (value >= 0),
  skipped boolean not null default false,
  tier public.evidence_tier not null default 'self' check (tier in ('self', 'observed', 'coach')),
  -- What this result shows, as [[exercise_id, value], ...]. The protocol lives in the app.
  demonstrates jsonb not null default '[]',
  recorded_by uuid references public.profiles (id) on delete set null,
  recorded_at timestamptz not null default now(),
  primary key (participant_id, test_id)
);

-- The six ratings an assessment produced. This is what the group may see of a
-- member: a shape, not their individual results.
create table public.assessment_profiles (
  participant_id uuid primary key references public.assessment_participants (id) on delete cascade,
  ratings jsonb not null,
  aura integer not null default 0,
  computed_at timestamptz not null default now()
);

create index assessment_sessions_owner on public.assessment_sessions (owner_id, created_at desc);
create index assessment_participants_session on public.assessment_participants (session_id);
create index assessment_participants_athlete on public.assessment_participants (athlete_id);

-- ── Helpers ──────────────────────────────────────────────────────────────

create function public.owns_assessment(s uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.assessment_sessions where id = s and owner_id = auth.uid());
$$;

create function public.in_assessment(s uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.assessment_participants where session_id = s and athlete_id = auth.uid());
$$;

create function public.participant_session(p uuid) returns uuid
language sql stable security definer set search_path = public as $$
  select session_id from public.assessment_participants where id = p;
$$;

create function public.is_my_participant(p uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.assessment_participants where id = p and athlete_id = auth.uid());
$$;

create function public.assessment_open(s uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.assessment_sessions where id = s and status = 'open');
$$;

-- Joining is the only thing an invitation token allows, and the only way in.
create function public.join_assessment(token text, share text default 'coach') returns uuid
language plpgsql security definer set search_path = public as $$
declare
  s public.assessment_sessions;
begin
  select * into s from public.assessment_sessions where invite_token = token;
  if s.id is null or s.solo or s.status <> 'open' or (s.invite_expires_at is not null and s.invite_expires_at < now()) then
    raise exception 'this invitation is not valid';
  end if;
  insert into public.assessment_participants (session_id, athlete_id, display_name, sharing)
  select s.id, auth.uid(), p.name, case when share = 'group' then 'group' else 'coach' end from public.profiles p where p.id = auth.uid()
  on conflict (session_id, athlete_id) do update set sharing = excluded.sharing;
  return s.id;
end;
$$;

-- A coach says how well they know a result. Never on their own results.
create function public.set_result_tier(p uuid, test text, new_tier public.evidence_tier) returns void
language plpgsql security definer set search_path = public as $$
begin
  if new_tier::text not in ('self', 'observed', 'coach') then
    raise exception 'tier must be self, observed or coach';
  end if;
  if not public.owns_assessment(public.participant_session(p)) or public.is_my_participant(p) then
    raise exception 'only the coach of this assessment can observe or verify a result';
  end if;
  update public.assessment_results set tier = new_tier where participant_id = p and test_id = test and not skipped;
end;
$$;

-- What the group may see of itself: one anonymous row of ratings per finished
-- member, and nothing at all until there are enough people to hide in.
create function public.assessment_group(s uuid) returns table (ratings jsonb, aura integer)
language sql stable security definer set search_path = public as $$
  select pr.ratings, pr.aura
  from public.assessment_profiles pr
  join public.assessment_participants p on p.id = pr.participant_id
  where p.session_id = s
    and (public.owns_assessment(s) or public.in_assessment(s))
    and (public.owns_assessment(s) or (select count(*) from public.assessment_profiles x join public.assessment_participants y on y.id = x.participant_id where y.session_id = s) >= 3);
$$;

-- Closing a session turns its results into evidence, each at the tier it was
-- given, and puts every participant with an account into the linked course.
create function public.finalise_assessment(s uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  session public.assessment_sessions;
begin
  select * into session from public.assessment_sessions where id = s;
  if session.id is null or session.owner_id <> auth.uid() then
    raise exception 'only the owner can finalise an assessment';
  end if;
  update public.assessment_sessions set status = 'finalised', finalised_at = now() where id = s;

  delete from public.evidence where assessment_id = s;
  insert into public.evidence (athlete_id, exercise_id, value, tier, source, assessment_id, observed_by, verified_by, verified_at, performed_at)
  select p.athlete_id, d ->> 0, (d ->> 1)::int,
         case when p.athlete_id = session.owner_id then 'self' else r.tier end,
         'assessment', s,
         case when r.tier = 'observed' and p.athlete_id <> session.owner_id then session.owner_id end,
         case when r.tier = 'coach' and p.athlete_id <> session.owner_id then session.owner_id end,
         case when r.tier = 'coach' and p.athlete_id <> session.owner_id then now() end,
         r.recorded_at
  from public.assessment_participants p
  join public.assessment_results r on r.participant_id = p.id
  cross join lateral jsonb_array_elements(r.demonstrates) d
  where p.session_id = s and p.athlete_id is not null and not r.skipped and (d ->> 1)::int > 0;

  if session.course_id is not null and public.coaches_course(session.course_id) then
    insert into public.course_enrollments (course_id, athlete_id)
    select session.course_id, p.athlete_id from public.assessment_participants p
    where p.session_id = s and p.athlete_id is not null and p.athlete_id <> session.owner_id
    on conflict (course_id, athlete_id) do nothing;
  end if;
end;
$$;

-- ── Row level security ───────────────────────────────────────────────────

alter table public.assessment_sessions enable row level security;
alter table public.assessment_participants enable row level security;
alter table public.assessment_results enable row level security;
alter table public.assessment_profiles enable row level security;

create policy assessment_sessions_read on public.assessment_sessions for select to authenticated
  using (owner_id = auth.uid() or public.in_assessment(id));
create policy assessment_sessions_insert on public.assessment_sessions for insert to authenticated
  with check (owner_id = auth.uid() and (solo or public.has_role('coach')) and (course_id is null or public.coaches_course(course_id)));
create policy assessment_sessions_update on public.assessment_sessions for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy assessment_sessions_delete on public.assessment_sessions for delete to authenticated using (owner_id = auth.uid());

-- Members see who else is in the group only when that person chose to be seen.
create policy assessment_participants_read on public.assessment_participants for select to authenticated
  using (athlete_id = auth.uid() or public.owns_assessment(session_id) or (sharing = 'group' and public.in_assessment(session_id)));
create policy assessment_participants_insert on public.assessment_participants for insert to authenticated
  with check (public.owns_assessment(session_id));
create policy assessment_participants_update on public.assessment_participants for update to authenticated
  using (athlete_id = auth.uid() or public.owns_assessment(session_id))
  with check (athlete_id = auth.uid() or public.owns_assessment(session_id));
create policy assessment_participants_delete on public.assessment_participants for delete to authenticated
  using (athlete_id = auth.uid() or public.owns_assessment(session_id));

-- Results: the athlete and the coach. Nobody else in the group, ever.
create policy assessment_results_read on public.assessment_results for select to authenticated
  using (public.is_my_participant(participant_id) or public.owns_assessment(public.participant_session(participant_id)));
-- An athlete records their own results as self-reported, while the session is open.
create policy assessment_results_self on public.assessment_results for all to authenticated
  using (public.is_my_participant(participant_id) and public.assessment_open(public.participant_session(participant_id)))
  with check (public.is_my_participant(participant_id) and tier = 'self' and public.assessment_open(public.participant_session(participant_id)));
-- A coach records for the people they are watching; that starts as observed.
create policy assessment_results_coach on public.assessment_results for all to authenticated
  using (public.owns_assessment(public.participant_session(participant_id)) and not public.is_my_participant(participant_id))
  with check (public.owns_assessment(public.participant_session(participant_id)) and not public.is_my_participant(participant_id) and recorded_by = auth.uid());

create policy assessment_profiles_read on public.assessment_profiles for select to authenticated
  using (
    public.is_my_participant(participant_id)
    or public.owns_assessment(public.participant_session(participant_id))
    or exists (select 1 from public.assessment_participants p where p.id = participant_id and p.sharing = 'group' and public.in_assessment(p.session_id))
  );
create policy assessment_profiles_write on public.assessment_profiles for all to authenticated
  using (public.is_my_participant(participant_id) or public.owns_assessment(public.participant_session(participant_id)))
  with check (public.is_my_participant(participant_id) or public.owns_assessment(public.participant_session(participant_id)));

grant select, insert, update, delete on public.assessment_sessions, public.assessment_participants, public.assessment_results, public.assessment_profiles to authenticated;
grant execute on function public.owns_assessment(uuid), public.in_assessment(uuid), public.participant_session(uuid), public.is_my_participant(uuid),
  public.assessment_open(uuid), public.join_assessment(text, text), public.set_result_tier(uuid, text, public.evidence_tier),
  public.assessment_group(uuid), public.finalise_assessment(uuid) to authenticated;
