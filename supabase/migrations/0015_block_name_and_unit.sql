-- A coach names a part of a session and chooses its unit.
--
-- An exercise in a course was always written in the exercise's own unit
-- (repetitions, or seconds for a hold) and shown by the exercise's name. A
-- coach may now write it their own way: "Wrist preparation + warm up", one
-- round of 60 seconds. `title` is that name; `metric` is the unit, set only
-- when it differs from the exercise's own. A workout logged from such a block
-- keeps both, so the coach reads it as it was written.
--
-- Work in another unit than the exercise's own is never a record: the app
-- does not offer it as a result, so no rating changes because of this.
--
-- Two new columns on two tables, nothing else. Safe to run twice.

alter table public.course_blocks
  add column if not exists title text check (title is null or char_length(title) <= 80),
  add column if not exists metric text check (metric is null or metric in ('reps', 'hold'));

alter table public.workout_log_entries
  add column if not exists title text check (title is null or char_length(title) <= 80),
  add column if not exists metric text check (metric is null or metric in ('reps', 'hold'));
