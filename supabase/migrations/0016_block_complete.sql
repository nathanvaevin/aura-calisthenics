-- A part of a session that is simply completed.
--
-- Since 0015 a coach counts an exercise in a course in repetitions or seconds.
-- A third way: `done`, no count and no time, the student finishes it and taps
-- Done (a warm-up of the body and wrists, say). Only the list of allowed units
-- changes. Safe to run twice.

alter table public.course_blocks drop constraint if exists course_blocks_metric_check;
alter table public.course_blocks add constraint course_blocks_metric_check check (metric is null or metric in ('reps', 'hold', 'done'));

alter table public.workout_log_entries drop constraint if exists workout_log_entries_metric_check;
alter table public.workout_log_entries add constraint workout_log_entries_metric_check check (metric is null or metric in ('reps', 'hold', 'done'));
