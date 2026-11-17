-- Aura · identity, places and presence
--
-- Principles encoded here:
--   1. Where an athlete is, is never stored. A visit records a place and a time window.
--      Coordinates may be passed once to check_in() to confirm "on site" and are discarded.
--   2. Every visit ends. There is no open-ended presence (4 hours at most), and a new
--      check-in ends the one before it.
--   3. Four relationships to a place stay separate: a running visit, visit history,
--      a declared favourite, a declared home spot. Each has its own audience.
--   4. "following" means the people the OWNER follows, a list the owner controls.
--   5. None of this is an input to any rating.

create type public.audience as enum ('me', 'following', 'everyone');
create type public.place_kind as enum ('calisthenics', 'outdoor', 'gym', 'studio', 'other');

-- ── Places ───────────────────────────────────────────────────────────────

create table public.places (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 1 and 80),
  kind public.place_kind not null,
  lat double precision not null check (lat between -90 and 90),
  lon double precision not null check (lon between -180 and 180),
  address text,
  equipment text[] not null default '{}',
  amenities text[] not null default '{}',
  access text check (access in ('free', 'members')),
  hours text,
  note text check (note is null or length(note) <= 500),
  -- osm: imported from OpenStreetMap (service role only) · athlete: added by a person
  source text not null check (source in ('osm', 'athlete')),
  -- OpenStreetMap element, as "node/123". One place per element.
  osm_ref text unique,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((source = 'osm') = (osm_ref is not null))
);

create index places_position on public.places (lat, lon);

-- "I was here and the details are right." Only possible during a visit.
create table public.place_confirmations (
  place_id uuid not null references public.places (id) on delete cascade,
  athlete_id uuid not null references public.profiles (id) on delete cascade,
  confirmed_at timestamptz not null default now(),
  primary key (place_id, athlete_id)
);

-- ── Identity beyond ability ──────────────────────────────────────────────

-- Kept apart from profiles so that each part can have its own audience:
-- a profile row is readable as a whole by anyone who may see the profile.
create table public.athlete_identity (
  athlete_id uuid primary key references public.profiles (id) on delete cascade,
  origin text check (origin is null or length(origin) <= 80),
  city text check (city is null or length(city) <= 80),
  environments text[] not null default '{}' check (environments <@ array['outdoor', 'gym', 'studio', 'home']),
  home_place_id uuid references public.places (id) on delete set null,
  open_to_train boolean not null default false,
  origin_audience public.audience not null default 'everyone',
  base_audience public.audience not null default 'everyone',
  -- Declared places: home spot, favourites, preferred environments.
  places_audience public.audience not null default 'following',
  -- Derived from behaviour: visit history and "regular" status. Closed unless opened.
  visits_audience public.audience not null default 'me',
  updated_at timestamptz not null default now()
);

-- The city moves here so it can have an audience of its own.
insert into public.athlete_identity (athlete_id, city) select id, city from public.profiles where city is not null;
alter table public.profiles drop column city;

create table public.place_favourites (
  athlete_id uuid not null references public.profiles (id) on delete cascade,
  place_id uuid not null references public.places (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (athlete_id, place_id)
);

-- ── Presence ─────────────────────────────────────────────────────────────

create table public.visits (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.profiles (id) on delete cascade,
  place_id uuid not null references public.places (id) on delete cascade,
  started_at timestamptz not null default now(),
  ends_at timestamptz not null,
  audience public.audience not null default 'me',
  -- The server compared a position supplied at check-in with the place, once.
  on_site boolean not null default false,
  check (ends_at >= started_at and ends_at <= started_at + interval '4 hours')
);

create index visits_place_time on public.visits (place_id, ends_at desc);
create index visits_athlete_time on public.visits (athlete_id, started_at desc);

alter table public.workout_logs add column place_id uuid references public.places (id) on delete set null;

-- ── Helpers ──────────────────────────────────────────────────────────────

-- Does `owner` follow the caller? That is what opens a "following" audience.
create function public.follows_me(owner uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.follows where follower_id = owner and followee_id = auth.uid());
$$;

create function public.audience_allows(a public.audience, owner uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select owner = auth.uid() or a = 'everyone' or (a = 'following' and public.follows_me(owner));
$$;

create function public.metres_between(lat1 double precision, lon1 double precision, lat2 double precision, lon2 double precision)
returns double precision language sql immutable as $$
  select 2 * 6371000 * asin(least(1, sqrt(
    power(sin(radians(lat2 - lat1) / 2), 2) + cos(radians(lat1)) * cos(radians(lat2)) * power(sin(radians(lon2 - lon1) / 2), 2)
  )));
$$;

-- A running visit is shown to its audience. A finished one also needs the
-- owner to have opened their visit history to that audience.
create function public.can_see_visit(owner uuid, a public.audience, starts timestamptz, ends timestamptz) returns boolean
language sql stable security definer set search_path = public as $$
  select owner = auth.uid()
      or (public.audience_allows(a, owner)
          and ((starts <= now() and now() < ends)
               or public.audience_allows(coalesce((select visits_audience from public.athlete_identity where athlete_id = owner), 'me'), owner)));
$$;

-- An athlete's identity as the caller is allowed to see it. Hidden parts come back null.
create function public.identity_of(p uuid)
returns table (origin text, city text, environments text[], home_place_id uuid, favourite_place_ids uuid[], open_to_train boolean)
language sql stable security definer set search_path = public as $$
  select
    case when public.audience_allows(i.origin_audience, p) then i.origin end,
    case when public.audience_allows(i.base_audience, p) then i.city end,
    case when public.audience_allows(i.places_audience, p) then i.environments else '{}' end,
    case when public.audience_allows(i.places_audience, p) then i.home_place_id end,
    case when public.audience_allows(i.places_audience, p)
      then coalesce((select array_agg(f.place_id order by f.created_at) from public.place_favourites f where f.athlete_id = p), '{}')
      else '{}' end,
    i.open_to_train
  from public.athlete_identity i
  where i.athlete_id = p and public.can_see_profile(p);
$$;

-- The only way to start a visit. `at_lat`/`at_lon` are optional, used for one
-- comparison and never written anywhere.
create function public.check_in(
  p_place uuid, p_minutes integer default 90, p_audience public.audience default 'me',
  at_lat double precision default null, at_lon double precision default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  pl public.places;
  v uuid;
  t timestamptz := now();
begin
  if me is null then raise exception 'sign in to check in'; end if;
  select * into pl from public.places where id = p_place;
  if pl.id is null then raise exception 'unknown place'; end if;
  -- Nobody is in two places: whatever is still running ends now.
  update public.visits set ends_at = t where athlete_id = me and ends_at > t;
  insert into public.visits (athlete_id, place_id, started_at, ends_at, audience, on_site)
  values (
    me, p_place, t, t + make_interval(mins => least(240, greatest(15, coalesce(p_minutes, 90)))), p_audience,
    at_lat is not null and at_lon is not null and public.metres_between(at_lat, at_lon, pl.lat, pl.lon) <= 200
  )
  returning id into v;
  return v;
end;
$$;

create function public.touch_place() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger places_touch before update on public.places for each row execute function public.touch_place();

-- A visit's owner may shorten or extend it and change who sees it. Nothing else.
create function public.protect_visit() returns trigger language plpgsql as $$
begin
  if new.athlete_id <> old.athlete_id or new.place_id <> old.place_id or new.started_at <> old.started_at or new.on_site <> old.on_site then
    raise exception 'only the end time and the audience of a visit can change';
  end if;
  return new;
end;
$$;
create trigger visits_protect before update on public.visits for each row execute function public.protect_visit();

-- ── Row level security ───────────────────────────────────────────────────

alter table public.places enable row level security;
alter table public.place_confirmations enable row level security;
alter table public.athlete_identity enable row level security;
alter table public.place_favourites enable row level security;
alter table public.visits enable row level security;

-- Places are public knowledge. People add their own; imports use the service role.
create policy places_read on public.places for select to anon, authenticated using (true);
create policy places_insert on public.places for insert to authenticated
  with check (source = 'athlete' and created_by = auth.uid());
create policy places_update on public.places for update to authenticated
  using ((source = 'athlete' and created_by = auth.uid()) or public.has_role('admin'))
  with check ((source = 'athlete' and created_by = auth.uid()) or public.has_role('admin'));
create policy places_delete on public.places for delete to authenticated
  using ((source = 'athlete' and created_by = auth.uid()) or public.has_role('admin'));

-- How many people vouch for a place is public; a confirmation needs a visit running there.
create policy confirmations_read on public.place_confirmations for select to authenticated using (true);
create policy confirmations_insert on public.place_confirmations for insert to authenticated
  with check (athlete_id = auth.uid() and exists (
    select 1 from public.visits v where v.athlete_id = auth.uid() and v.place_id = place_confirmations.place_id and v.started_at <= now() and now() < v.ends_at
  ));
create policy confirmations_delete on public.place_confirmations for delete to authenticated using (athlete_id = auth.uid());

-- The identity row itself is the owner's alone. Everyone else goes through identity_of().
create policy identity_own on public.athlete_identity for all to authenticated
  using (athlete_id = auth.uid()) with check (athlete_id = auth.uid());

create policy favourites_read on public.place_favourites for select to authenticated
  using (athlete_id = auth.uid() or public.audience_allows(
    coalesce((select places_audience from public.athlete_identity i where i.athlete_id = place_favourites.athlete_id), 'following'), athlete_id));
create policy favourites_write on public.place_favourites for all to authenticated
  using (athlete_id = auth.uid()) with check (athlete_id = auth.uid());

-- Visits start through check_in() only: there is no insert policy.
create policy visits_read on public.visits for select to authenticated
  using (public.can_see_visit(athlete_id, audience, started_at, ends_at));
create policy visits_update on public.visits for update to authenticated
  using (athlete_id = auth.uid()) with check (athlete_id = auth.uid());
create policy visits_delete on public.visits for delete to authenticated using (athlete_id = auth.uid());

grant select on public.places to anon;
grant select, insert, update, delete on public.places, public.place_confirmations, public.athlete_identity, public.place_favourites to authenticated;
grant select, update, delete on public.visits to authenticated;
revoke insert on public.visits from authenticated;
grant execute on function public.follows_me(uuid), public.audience_allows(public.audience, uuid),
  public.metres_between(double precision, double precision, double precision, double precision),
  public.can_see_visit(uuid, public.audience, timestamptz, timestamptz), public.identity_of(uuid),
  public.check_in(uuid, integer, public.audience, double precision, double precision) to authenticated;
