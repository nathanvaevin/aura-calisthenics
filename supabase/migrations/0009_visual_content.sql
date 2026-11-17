-- Aura · demonstrations, workout videos and theme settings
--
-- Content that belongs to everyone and is managed by an admin:
--   1. Demonstrations of an exercise: an animation (a recipe the app renders:
--      which character, motion and camera) or a recorded video. Every version
--      is kept; athletes see a version only once it is published, and one
--      slot of one exercise has at most one published version.
--   2. Complete workout videos, filmed outside Aura.
--   3. App-wide settings, such as the default Aura theme.
--
-- Anyone reads what is published, signed in or not. Only an admin writes.
-- Only adds tables. Run once, after 0008.

-- ── 1 · Demonstrations ───────────────────────────────────────────────────

create table public.demo_assets (
  id uuid primary key default gen_random_uuid(),
  exercise_id text not null references public.exercises (id) on delete cascade,
  kind text not null check (kind in ('animation', 'video')),
  -- What it is within the exercise: 'male', 'female', 'instructor', 'instructor:<angle or variation>'.
  slot text not null check (length(slot) between 1 and 80),
  version int not null check (version >= 1),
  status text not null default 'draft'
    check (status in ('draft', 'pending', 'approved', 'published', 'needs_correction', 'archived')),
  title text not null default '',
  description text not null default '',
  -- The animation recipe, or where the video is.
  recipe jsonb not null default '{}',
  -- Correction notes, kept with the version they were written on.
  notes jsonb not null default '[]',
  replaces uuid references public.demo_assets (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_at timestamptz,
  published_at timestamptz,
  unique (exercise_id, kind, slot, version)
);

create unique index demo_assets_one_published on public.demo_assets (exercise_id, kind, slot) where status = 'published';
create index demo_assets_by_exercise on public.demo_assets (exercise_id);

alter table public.demo_assets enable row level security;

create policy demo_assets_public on public.demo_assets for select to anon
  using (status = 'published');
create policy demo_assets_read on public.demo_assets for select to authenticated
  using (status = 'published' or public.has_role('admin'));
create policy demo_assets_write on public.demo_assets for all to authenticated
  using (public.has_role('admin')) with check (public.has_role('admin'));

-- ── 2 · Workout videos ───────────────────────────────────────────────────

create table public.workout_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  description text not null default '',
  focus text not null default 'full'
    check (focus in ('handstand', 'pull', 'push', 'core', 'legs', 'mobility', 'full')),
  level text not null default 'all' check (level in ('beginner', 'intermediate', 'advanced', 'all')),
  minutes int not null default 0 check (minutes >= 0),
  equipment text[] not null default '{}',
  exercise_ids text[] not null default '{}',
  course_id uuid references public.courses (id) on delete set null,
  -- Where the video is: an upload in storage or a link to a host.
  video jsonb,
  -- Moments in the video: introduction, work and rest, each optionally naming an exercise.
  chapters jsonb not null default '[]',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

alter table public.workout_videos enable row level security;

create policy workout_videos_public on public.workout_videos for select to anon
  using (status = 'published');
create policy workout_videos_read on public.workout_videos for select to authenticated
  using (status = 'published' or public.has_role('admin'));
create policy workout_videos_write on public.workout_videos for all to authenticated
  using (public.has_role('admin')) with check (public.has_role('admin'));

-- ── 3 · Settings ─────────────────────────────────────────────────────────

create table public.app_settings (
  key text primary key check (length(key) between 1 and 60),
  value jsonb not null,
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

create policy app_settings_read on public.app_settings for select to anon, authenticated using (true);
create policy app_settings_write on public.app_settings for all to authenticated
  using (public.has_role('admin')) with check (public.has_role('admin'));

-- ── Grants ───────────────────────────────────────────────────────────────

grant select on public.demo_assets, public.workout_videos, public.app_settings to anon;
grant select, insert, update, delete on public.demo_assets, public.workout_videos, public.app_settings to authenticated;
