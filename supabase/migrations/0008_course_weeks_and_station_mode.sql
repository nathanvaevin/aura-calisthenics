-- Aura · structured courses and station-based assessments
--
--   1. A course week can be an assessment week (the baseline at the start, the
--      re-test at the end) and can name the capability it focuses on.
--   2. An exercise in a course can be marked as part of the week's primary
--      focus, as opposed to support work.
--   3. An assessment runs guided (each station walks through its benchmarks
--      in order) or by stations (athletes choose the variations that fit
--      them), and the class can be split into rotation groups.
--
-- Only adds columns, each with a default. Run once, after 0007.

alter table public.course_weeks add column kind text not null default 'training'
  check (kind in ('training', 'baseline', 'retest'));
alter table public.course_weeks add column focus text
  check (focus is null or focus in ('handstand', 'pull', 'push', 'core', 'legs', 'mobility', 'full'));

alter table public.course_blocks add column is_primary boolean not null default false;

alter table public.assessment_sessions add column mode text not null default 'guided'
  check (mode in ('guided', 'stations'));
alter table public.assessment_sessions add column groups smallint not null default 1
  check (groups between 1 and 12);

-- Unset: placed by joining order. Set by the coach to move someone to another group.
alter table public.assessment_participants add column group_no smallint
  check (group_no is null or group_no between 0 and 11);
