-- Aura · coaching by approval
--
-- Being a coach is granted, not chosen: an athlete asks, an admin approves.
-- (Coaching will be a paid role; until then it is simply by invitation.)
--   1. Nobody gives themselves the coach role. Only an admin, or the SQL editor.
--   2. An athlete asks once, with an optional note; the request is theirs to see.
--   3. An admin sees every request and approves or declines it in one step.
--
-- Run once, after 0006.

-- ── 1 · The role is protected ────────────────────────────────────────────

-- Replaces the version from 0001, which protected only 'admin'. An upsert of
-- an existing profile arrives as an insert first, so "already had it" is read
-- from the stored row in both cases.
create or replace function public.protect_profile_roles() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  had public.app_role[];
  r public.app_role;
begin
  if auth.uid() is null then
    return new; -- the SQL editor, the service role, and sign-up itself
  end if;
  select roles into had from public.profiles where id = new.id;
  had := coalesce(had, '{athlete}');
  foreach r in array new.roles loop
    if r <> 'athlete' and not (r = any (had)) and not public.has_role('admin') then
      raise exception 'the % role is granted by an admin', r;
    end if;
  end loop;
  return new;
end;
$$;

-- ── 2 · Asking ───────────────────────────────────────────────────────────

create table public.coach_requests (
  athlete_id uuid primary key references public.profiles (id) on delete cascade,
  note text check (note is null or length(note) <= 500),
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references public.profiles (id) on delete set null
);

alter table public.coach_requests enable row level security;

-- Your own request, and every request for an admin. Changes go through the functions below.
create policy coach_requests_read on public.coach_requests for select to authenticated
  using (athlete_id = auth.uid() or public.has_role('admin'));

-- Ask, or ask again after a decline. A guest cannot: there would be nobody to coach as.
create function public.request_coach(note text default null) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'sign in with an account to ask for coach access';
  end if;
  if public.has_role('coach') then
    return;
  end if;
  insert into public.coach_requests (athlete_id, note) values (auth.uid(), nullif(btrim(note), ''))
  on conflict (athlete_id) do update set note = excluded.note, status = 'pending', created_at = now(), decided_at = null, decided_by = null
  where coach_requests.status <> 'pending';
end;
$$;

create function public.withdraw_coach_request() returns void
language sql security definer set search_path = public as $$
  delete from public.coach_requests where athlete_id = auth.uid() and status = 'pending';
$$;

-- ── 3 · Deciding ─────────────────────────────────────────────────────────

create function public.decide_coach(athlete uuid, approve boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role('admin') then
    raise exception 'only an admin decides coach access';
  end if;
  update public.coach_requests set status = case when approve then 'approved' else 'declined' end, decided_at = now(), decided_by = auth.uid()
  where athlete_id = athlete;
  if approve then
    update public.profiles set roles = array(select distinct unnest(roles || '{coach}'::public.app_role[])) where id = athlete;
  end if;
end;
$$;

-- Taking coaching away. Their courses and sessions stay; they can no longer make new ones.
create function public.revoke_coach(athlete uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role('admin') then
    raise exception 'only an admin decides coach access';
  end if;
  update public.profiles set roles = array_remove(roles, 'coach') where id = athlete;
end;
$$;

-- ── Grants ───────────────────────────────────────────────────────────────

revoke insert, update, delete on public.coach_requests from anon, authenticated;
grant select on public.coach_requests to authenticated;
grant execute on function public.request_coach(text), public.withdraw_coach_request(), public.decide_coach(uuid, boolean), public.revoke_coach(uuid) to authenticated;
revoke execute on function public.request_coach(text), public.withdraw_coach_request(), public.decide_coach(uuid, boolean), public.revoke_coach(uuid) from anon;

-- ── Making yourself the owner (run by hand, once, after your first sign-in) ──
--
--   update public.profiles set roles = '{athlete,coach,admin}'
--   where id = (select id from auth.users where email = 'YOUR-EMAIL');
