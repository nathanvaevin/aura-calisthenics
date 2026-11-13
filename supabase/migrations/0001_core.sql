-- Aura · core schema
--
-- Principles encoded here:
--   1. Exercise difficulty (progressions), mastery (evidence + curves), Aura (derived)
--      and the skill tree are separate structures.
--   2. Raw performance (evidence, workout logs) is stored. Scores are derived from it
--      and only cached as snapshots, tagged with the scoring-model version that produced them.
--   3. Evidence carries its provenance. An athlete can never mark their own record verified.
--   4. Coaches see performance data only for athletes enrolled in their own courses.

-- ── Types ────────────────────────────────────────────────────────────────

create type public.app_role as enum ('athlete', 'coach', 'admin');
create type public.evidence_tier as enum ('estimated', 'self', 'coach', 'video');
create type public.metric as enum ('reps', 'hold');
create type public.block_kind as enum ('warmup', 'skill', 'strength', 'mobility', 'cooldown');
create type public.course_status as enum ('draft', 'active', 'archived');
create type public.course_format as enum ('group', 'individual', 'online');
create type public.enrollment_status as enum ('active', 'paused', 'completed');

-- ── Athlete profiles ─────────────────────────────────────────────────────

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'Athlete',
  handle text unique check (handle = lower(handle) and handle ~ '^[a-z0-9_.]{2,30}$'),
  bio text not null default '',
  -- The only location ever stored. Null keeps the athlete out of local discovery.
  city text,
  roles public.app_role[] not null default '{athlete}',
  weekly_target smallint not null default 3 check (weekly_target between 1 and 14),
  equipment text[] not null default '{}',
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── Catalog: disciplines, exercises, progressions, skills ────────────────

create table public.disciplines (
  id text primary key,
  name text not null,
  short text not null,
  blurb text not null,
  archetype text not null,
  position smallint not null
);

create table public.exercises (
  id text primary key,
  discipline_id text not null references public.disciplines (id),
  name text not null,
  short text not null,
  category text not null,
  metric public.metric not null,
  per_side boolean not null default false,
  equipment text[] not null default '{}',
  primary_muscles text[] not null default '{}',
  secondary_muscles text[] not null default '{}',
  stabilizers text[] not null default '{}',
  summary text not null,
  cues text[] not null default '{}',
  mistakes text[] not null default '{}',
  safety text,
  standard text,
  dose_sets smallint not null,
  dose_min smallint not null,
  dose_max smallint not null,
  dose_rest smallint not null,
  -- Null for the official library; set for a coach's own variation.
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  check (dose_min <= dose_max)
);

-- Coach-supplied demonstration videos. One exercise can have one per coach.
create table public.exercise_media (
  id uuid primary key default gen_random_uuid(),
  exercise_id text not null references public.exercises (id) on delete cascade,
  coach_id uuid not null references public.profiles (id) on delete cascade,
  url text not null,
  created_at timestamptz not null default now(),
  unique (exercise_id, coach_id)
);

-- System A: exercise difficulty. Levels are relative to one progression only.
create table public.progressions (
  id text primary key,
  discipline_id text not null references public.disciplines (id),
  name text not null,
  objective text not null,
  created_by uuid references public.profiles (id) on delete set null
);

create table public.progression_steps (
  progression_id text not null references public.progressions (id) on delete cascade,
  level smallint not null check (level between 1 and 10),
  exercise_id text not null references public.exercises (id),
  -- Alternates are other valid variations at the same level.
  is_alternate boolean not null default false,
  primary key (progression_id, level, exercise_id)
);

-- System D: the skill tree. A skill is a threshold on one measurable exercise.
create table public.skills (
  id text primary key,
  exercise_id text not null references public.exercises (id),
  threshold integer not null check (threshold > 0),
  lane smallint not null default 0,
  name text
);

create table public.skill_prerequisites (
  skill_id text not null references public.skills (id) on delete cascade,
  requires_id text not null references public.skills (id) on delete cascade,
  primary key (skill_id, requires_id),
  check (skill_id <> requires_id)
);

-- ── Scoring models: configurable and versioned ───────────────────────────

create table public.scoring_models (
  version text primary key,
  config jsonb not null,
  is_active boolean not null default false,
  note text,
  created_at timestamptz not null default now()
);

create unique index scoring_models_one_active on public.scoring_models (is_active) where is_active;

-- Calibration anchors: performance value -> rating points, per exercise and model.
create table public.rating_curves (
  model_version text not null references public.scoring_models (version) on delete cascade,
  exercise_id text not null references public.exercises (id) on delete cascade,
  value integer not null check (value > 0),
  rating integer not null check (rating >= 0),
  primary key (model_version, exercise_id, value)
);

-- ── Workout templates ────────────────────────────────────────────────────

create table public.workouts (
  id text primary key,
  title text not null,
  focus text not null,
  summary text not null,
  minutes smallint not null,
  created_by uuid references public.profiles (id) on delete set null
);

create table public.workout_items (
  workout_id text not null references public.workouts (id) on delete cascade,
  position smallint not null,
  kind public.block_kind not null,
  -- Exactly one: a ladder resolved to the athlete's working level, or a fixed exercise.
  progression_id text references public.progressions (id),
  exercise_id text references public.exercises (id),
  sets smallint,
  target integer,
  primary key (workout_id, position),
  check ((progression_id is null) <> (exercise_id is null))
);

-- ── Courses ──────────────────────────────────────────────────────────────

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  tagline text not null default '',
  description text not null default '',
  focus text not null default 'full',
  format public.course_format not null default 'group',
  status public.course_status not null default 'draft',
  -- Monday of week 1.
  start_date date not null,
  created_at timestamptz not null default now()
);

create table public.course_milestones (
  course_id uuid not null references public.courses (id) on delete cascade,
  skill_id text not null references public.skills (id) on delete cascade,
  primary key (course_id, skill_id)
);

create table public.course_weeks (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  position smallint not null,
  title text not null default '',
  objective text not null default ''
);

create table public.course_sessions (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.course_weeks (id) on delete cascade,
  day smallint not null check (day between 0 and 6),
  title text not null default ''
);

-- Coach assignments. Blocks reference library exercises; nothing is copied.
create table public.course_blocks (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.course_sessions (id) on delete cascade,
  position smallint not null,
  kind public.block_kind not null,
  exercise_id text not null references public.exercises (id),
  progression_id text references public.progressions (id),
  level smallint,
  -- The range students may move within. Equal bounds lock the level.
  min_level smallint,
  max_level smallint,
  sets smallint not null check (sets > 0),
  target integer not null check (target > 0),
  rest smallint not null default 60 check (rest >= 0),
  note text,
  check (level is null or (min_level <= level and level <= max_level))
);

create table public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  athlete_id uuid not null references public.profiles (id) on delete cascade,
  status public.enrollment_status not null default 'active',
  joined_at timestamptz not null default now(),
  unique (course_id, athlete_id)
);

-- ── Raw performance: workout logs and evidence ───────────────────────────

create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  source_type text not null check (source_type in ('course', 'library', 'goal')),
  course_id uuid references public.courses (id) on delete set null,
  session_id uuid references public.course_sessions (id) on delete set null,
  -- Workout template id or goal skill id for non-course sessions.
  source_ref text,
  started_at timestamptz not null,
  finished_at timestamptz,
  rpe smallint check (rpe between 1 and 10),
  note text
);

-- What was assigned next to what was actually selected.
create table public.workout_log_entries (
  id uuid primary key default gen_random_uuid(),
  log_id uuid not null references public.workout_logs (id) on delete cascade,
  position smallint not null,
  kind public.block_kind not null,
  block_id uuid references public.course_blocks (id) on delete set null,
  progression_id text references public.progressions (id),
  assigned_exercise_id text not null references public.exercises (id),
  assigned_level smallint,
  assigned_target integer not null,
  exercise_id text not null references public.exercises (id),
  level smallint,
  target integer not null,
  rest smallint not null default 0
);

-- Actual performance, set by set, with the variation used for that set.
create table public.workout_log_sets (
  entry_id uuid not null references public.workout_log_entries (id) on delete cascade,
  position smallint not null,
  exercise_id text not null references public.exercises (id),
  level smallint,
  value integer not null check (value >= 0),
  primary key (entry_id, position)
);

-- A demonstrated performance and how we know about it. Ratings, Aura and skill
-- states are all computed from this table.
create table public.evidence (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.profiles (id) on delete cascade,
  exercise_id text not null references public.exercises (id),
  value integer not null check (value > 0),
  tier public.evidence_tier not null default 'self',
  source text not null check (source in ('onboarding', 'workout', 'manual')),
  log_id uuid references public.workout_logs (id) on delete set null,
  note text,
  video_url text,
  verified_by uuid references public.profiles (id) on delete set null,
  verified_at timestamptz,
  performed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  check ((tier in ('coach', 'video')) = (verified_by is not null))
);

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  log_id uuid not null references public.workout_logs (id) on delete cascade,
  coach_id uuid not null references public.profiles (id) on delete cascade,
  athlete_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now()
);

create table public.athlete_goals (
  athlete_id uuid not null references public.profiles (id) on delete cascade,
  skill_id text not null references public.skills (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (athlete_id, skill_id)
);

-- ── Derived snapshots (recomputable; written server-side only) ───────────

create table public.mastery_ratings (
  athlete_id uuid not null references public.profiles (id) on delete cascade,
  discipline_id text not null references public.disciplines (id),
  model_version text not null references public.scoring_models (version),
  rating integer not null,
  verified_rating integer not null default 0,
  status text not null check (status in ('unrated', 'estimated', 'self', 'verified')),
  provisional boolean not null default true,
  computed_at timestamptz not null default now(),
  primary key (athlete_id, discipline_id, model_version)
);

-- Aura over time. Append-only history.
create table public.aura_records (
  id bigint generated always as identity primary key,
  athlete_id uuid not null references public.profiles (id) on delete cascade,
  model_version text not null references public.scoring_models (version),
  aura integer not null,
  mastery integer not null,
  peak_discipline text references public.disciplines (id),
  versatility smallint not null,
  status text not null check (status in ('unrated', 'estimated', 'self', 'verified')),
  recorded_at timestamptz not null default now()
);

create table public.skill_achievements (
  athlete_id uuid not null references public.profiles (id) on delete cascade,
  skill_id text not null references public.skills (id) on delete cascade,
  tier public.evidence_tier not null,
  evidence_id uuid references public.evidence (id) on delete set null,
  achieved_at timestamptz not null,
  primary key (athlete_id, skill_id)
);

-- Recognition that is not a skill: activity and progress badges live apart from mastery.
create table public.achievements (
  id text primary key,
  kind text not null check (kind in ('activity', 'progress', 'mastery')),
  name text not null,
  description text not null,
  criteria jsonb not null default '{}'
);

create table public.athlete_achievements (
  athlete_id uuid not null references public.profiles (id) on delete cascade,
  achievement_id text not null references public.achievements (id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (athlete_id, achievement_id)
);

-- ── Social ───────────────────────────────────────────────────────────────

create table public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  followee_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);

-- ── Indexes ──────────────────────────────────────────────────────────────

create index exercises_discipline on public.exercises (discipline_id);
create index progression_steps_exercise on public.progression_steps (exercise_id);
create index skills_exercise on public.skills (exercise_id);
create index evidence_athlete_exercise on public.evidence (athlete_id, exercise_id);
create index evidence_log on public.evidence (log_id);
create index workout_logs_athlete on public.workout_logs (athlete_id, finished_at desc);
create index workout_logs_course on public.workout_logs (course_id, finished_at desc);
create index workout_log_entries_log on public.workout_log_entries (log_id, position);
create index course_weeks_course on public.course_weeks (course_id, position);
create index course_sessions_week on public.course_sessions (week_id, day);
create index course_blocks_session on public.course_blocks (session_id, position);
create index course_enrollments_athlete on public.course_enrollments (athlete_id);
create index feedback_log on public.feedback (log_id);
create index aura_records_athlete on public.aura_records (athlete_id, recorded_at desc);

-- ── Helper functions (security definer, so policies cannot recurse) ──────

create function public.has_role(r public.app_role) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and r = any (p.roles));
$$;

create function public.coaches_course(c uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.courses where id = c and coach_id = auth.uid());
$$;

-- True when the caller coaches a course this athlete is actively enrolled in.
create function public.coaches_athlete(a uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.courses c
    join public.course_enrollments e on e.course_id = c.id
    where c.coach_id = auth.uid() and e.athlete_id = a and e.status = 'active'
  );
$$;

create function public.can_see_course(c uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.courses where id = c and (status = 'active' or coach_id = auth.uid()))
      or exists (select 1 from public.course_enrollments where course_id = c and athlete_id = auth.uid());
$$;

create function public.week_course(w uuid) returns uuid
language sql stable security definer set search_path = public as $$
  select course_id from public.course_weeks where id = w;
$$;

create function public.session_course(s uuid) returns uuid
language sql stable security definer set search_path = public as $$
  select w.course_id from public.course_sessions cs join public.course_weeks w on w.id = cs.week_id where cs.id = s;
$$;

create function public.can_see_profile(p uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select p = auth.uid()
      or exists (select 1 from public.profiles where id = p and is_public)
      or public.coaches_athlete(p);
$$;

create function public.owns_log(l uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.workout_logs where id = l and athlete_id = auth.uid());
$$;

-- A coach may read a log only when it belongs to one of their own courses.
create function public.can_read_log(l uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.workout_logs wl
    where wl.id = l and (wl.athlete_id = auth.uid() or (wl.course_id is not null and public.coaches_course(wl.course_id)))
  );
$$;

-- The only way a record becomes verified. Athletes cannot call this on themselves.
create function public.verify_evidence(target uuid, as_tier public.evidence_tier default 'coach') returns void
language plpgsql security definer set search_path = public as $$
declare
  owner uuid;
begin
  if as_tier not in ('coach', 'video') then
    raise exception 'verification tier must be coach or video';
  end if;
  select athlete_id into owner from public.evidence where id = target;
  if owner is null then
    raise exception 'evidence not found';
  end if;
  if owner = auth.uid() or not (public.coaches_athlete(owner) or public.has_role('admin')) then
    raise exception 'only a coach of this athlete can verify their evidence';
  end if;
  update public.evidence set tier = as_tier, verified_by = auth.uid(), verified_at = now() where id = target;
end;
$$;

-- Create a profile when an account is created.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', 'Athlete'))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- Nobody grants themselves the admin role.
create function public.protect_profile_roles() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    return new; -- service role and migrations
  end if;
  if 'admin' = any (new.roles) and not public.has_role('admin') then
    raise exception 'the admin role cannot be self-assigned';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_roles before insert or update of roles on public.profiles
for each row execute function public.protect_profile_roles();

-- ── Row level security ───────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.disciplines enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_media enable row level security;
alter table public.progressions enable row level security;
alter table public.progression_steps enable row level security;
alter table public.skills enable row level security;
alter table public.skill_prerequisites enable row level security;
alter table public.scoring_models enable row level security;
alter table public.rating_curves enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_items enable row level security;
alter table public.courses enable row level security;
alter table public.course_milestones enable row level security;
alter table public.course_weeks enable row level security;
alter table public.course_sessions enable row level security;
alter table public.course_blocks enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.workout_logs enable row level security;
alter table public.workout_log_entries enable row level security;
alter table public.workout_log_sets enable row level security;
alter table public.evidence enable row level security;
alter table public.feedback enable row level security;
alter table public.athlete_goals enable row level security;
alter table public.mastery_ratings enable row level security;
alter table public.aura_records enable row level security;
alter table public.skill_achievements enable row level security;
alter table public.achievements enable row level security;
alter table public.athlete_achievements enable row level security;
alter table public.follows enable row level security;

-- Profiles
create policy profiles_read on public.profiles for select to authenticated using (public.can_see_profile(id));
create policy profiles_insert on public.profiles for insert to authenticated with check (id = auth.uid());
create policy profiles_update on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Catalog: readable by everyone, written by admins. Coaches may add their own variations.
create policy disciplines_read on public.disciplines for select to anon, authenticated using (true);
create policy exercises_read on public.exercises for select to anon, authenticated using (true);
create policy progressions_read on public.progressions for select to anon, authenticated using (true);
create policy progression_steps_read on public.progression_steps for select to anon, authenticated using (true);
create policy skills_read on public.skills for select to anon, authenticated using (true);
create policy skill_prerequisites_read on public.skill_prerequisites for select to anon, authenticated using (true);
create policy scoring_models_read on public.scoring_models for select to anon, authenticated using (true);
create policy rating_curves_read on public.rating_curves for select to anon, authenticated using (true);
create policy workouts_read on public.workouts for select to anon, authenticated using (true);
create policy workout_items_read on public.workout_items for select to anon, authenticated using (true);
create policy achievements_read on public.achievements for select to anon, authenticated using (true);

create policy disciplines_admin on public.disciplines for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));
create policy skills_admin on public.skills for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));
create policy skill_prerequisites_admin on public.skill_prerequisites for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));
create policy scoring_models_admin on public.scoring_models for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));
create policy rating_curves_admin on public.rating_curves for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));
create policy workouts_admin on public.workouts for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));
create policy workout_items_admin on public.workout_items for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));
create policy achievements_admin on public.achievements for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));

create policy exercises_write on public.exercises for all to authenticated
  using (public.has_role('admin') or (created_by = auth.uid() and public.has_role('coach')))
  with check (public.has_role('admin') or (created_by = auth.uid() and public.has_role('coach')));
create policy progressions_write on public.progressions for all to authenticated
  using (public.has_role('admin') or (created_by = auth.uid() and public.has_role('coach')))
  with check (public.has_role('admin') or (created_by = auth.uid() and public.has_role('coach')));
create policy progression_steps_write on public.progression_steps for all to authenticated
  using (public.has_role('admin') or exists (select 1 from public.progressions p where p.id = progression_id and p.created_by = auth.uid()))
  with check (public.has_role('admin') or exists (select 1 from public.progressions p where p.id = progression_id and p.created_by = auth.uid()));

create policy exercise_media_read on public.exercise_media for select to authenticated using (true);
create policy exercise_media_write on public.exercise_media for all to authenticated
  using (coach_id = auth.uid() and public.has_role('coach'))
  with check (coach_id = auth.uid() and public.has_role('coach'));

-- Courses
create policy courses_read on public.courses for select to authenticated using (public.can_see_course(id));
create policy courses_write on public.courses for all to authenticated
  using (coach_id = auth.uid() and public.has_role('coach'))
  with check (coach_id = auth.uid() and public.has_role('coach'));

create policy course_milestones_read on public.course_milestones for select to authenticated using (public.can_see_course(course_id));
create policy course_milestones_write on public.course_milestones for all to authenticated
  using (public.coaches_course(course_id)) with check (public.coaches_course(course_id));

create policy course_weeks_read on public.course_weeks for select to authenticated using (public.can_see_course(course_id));
create policy course_weeks_write on public.course_weeks for all to authenticated
  using (public.coaches_course(course_id)) with check (public.coaches_course(course_id));

create policy course_sessions_read on public.course_sessions for select to authenticated using (public.can_see_course(public.week_course(week_id)));
create policy course_sessions_write on public.course_sessions for all to authenticated
  using (public.coaches_course(public.week_course(week_id))) with check (public.coaches_course(public.week_course(week_id)));

create policy course_blocks_read on public.course_blocks for select to authenticated using (public.can_see_course(public.session_course(session_id)));
create policy course_blocks_write on public.course_blocks for all to authenticated
  using (public.coaches_course(public.session_course(session_id))) with check (public.coaches_course(public.session_course(session_id)));

-- Enrolment: athletes join active courses themselves; coaches manage their own rosters.
create policy enrollments_read on public.course_enrollments for select to authenticated
  using (athlete_id = auth.uid() or public.coaches_course(course_id));
create policy enrollments_join on public.course_enrollments for insert to authenticated
  with check (
    public.coaches_course(course_id)
    or (athlete_id = auth.uid() and exists (select 1 from public.courses c where c.id = course_id and c.status = 'active'))
  );
create policy enrollments_update on public.course_enrollments for update to authenticated
  using (athlete_id = auth.uid() or public.coaches_course(course_id))
  with check (athlete_id = auth.uid() or public.coaches_course(course_id));
create policy enrollments_leave on public.course_enrollments for delete to authenticated
  using (athlete_id = auth.uid() or public.coaches_course(course_id));

-- Workout logs: the athlete, plus the coach of the course the log belongs to.
create policy logs_read on public.workout_logs for select to authenticated
  using (athlete_id = auth.uid() or (course_id is not null and public.coaches_course(course_id)));
create policy logs_insert on public.workout_logs for insert to authenticated with check (athlete_id = auth.uid());
create policy logs_update on public.workout_logs for update to authenticated using (athlete_id = auth.uid()) with check (athlete_id = auth.uid());
create policy logs_delete on public.workout_logs for delete to authenticated using (athlete_id = auth.uid());

create policy log_entries_read on public.workout_log_entries for select to authenticated using (public.can_read_log(log_id));
create policy log_entries_write on public.workout_log_entries for all to authenticated
  using (public.owns_log(log_id)) with check (public.owns_log(log_id));

create policy log_sets_read on public.workout_log_sets for select to authenticated
  using (exists (select 1 from public.workout_log_entries e where e.id = entry_id and public.can_read_log(e.log_id)));
create policy log_sets_write on public.workout_log_sets for all to authenticated
  using (exists (select 1 from public.workout_log_entries e where e.id = entry_id and public.owns_log(e.log_id)))
  with check (exists (select 1 from public.workout_log_entries e where e.id = entry_id and public.owns_log(e.log_id)));

-- Evidence: athletes add estimated or self-reported records only, and cannot edit them.
-- Verification happens through verify_evidence().
create policy evidence_read on public.evidence for select to authenticated
  using (athlete_id = auth.uid() or public.coaches_athlete(athlete_id));
create policy evidence_insert on public.evidence for insert to authenticated
  with check (athlete_id = auth.uid() and tier in ('estimated', 'self') and verified_by is null and verified_at is null);
create policy evidence_delete on public.evidence for delete to authenticated
  using (athlete_id = auth.uid() and tier in ('estimated', 'self'));

-- Feedback: written by the coach of the log's course, read by both sides.
create policy feedback_read on public.feedback for select to authenticated using (athlete_id = auth.uid() or coach_id = auth.uid());
create policy feedback_insert on public.feedback for insert to authenticated
  with check (
    coach_id = auth.uid()
    and exists (select 1 from public.workout_logs wl where wl.id = log_id and wl.athlete_id = feedback.athlete_id and wl.course_id is not null and public.coaches_course(wl.course_id))
  );
create policy feedback_delete on public.feedback for delete to authenticated using (coach_id = auth.uid());

create policy goals_read on public.athlete_goals for select to authenticated using (public.can_see_profile(athlete_id));
create policy goals_write on public.athlete_goals for all to authenticated using (athlete_id = auth.uid()) with check (athlete_id = auth.uid());

-- Snapshots: visible wherever the profile is. No client write policies: the scoring
-- job runs with the service role, so a score can never be set by hand.
create policy mastery_ratings_read on public.mastery_ratings for select to authenticated using (public.can_see_profile(athlete_id));
create policy aura_records_read on public.aura_records for select to authenticated using (public.can_see_profile(athlete_id));
create policy skill_achievements_read on public.skill_achievements for select to authenticated using (public.can_see_profile(athlete_id));
create policy athlete_achievements_read on public.athlete_achievements for select to authenticated using (public.can_see_profile(athlete_id));

create policy follows_read on public.follows for select to authenticated using (true);
create policy follows_write on public.follows for all to authenticated using (follower_id = auth.uid()) with check (follower_id = auth.uid());

-- ── Grants (RLS above decides the rows) ──────────────────────────────────

grant usage on schema public to anon, authenticated;
grant select on public.disciplines, public.exercises, public.progressions, public.progression_steps, public.skills,
  public.skill_prerequisites, public.scoring_models, public.rating_curves, public.workouts, public.workout_items,
  public.achievements to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant execute on all functions in schema public to authenticated;
revoke execute on function public.handle_new_user() from authenticated, anon;
revoke execute on function public.protect_profile_roles() from authenticated, anon;
