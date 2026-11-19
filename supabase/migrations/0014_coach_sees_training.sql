-- A coach sees all the training of the athletes in their courses.
--
-- Until now a coach could read a student's results (evidence, ratings,
-- assessments) but only the workouts logged inside the coach's own course.
-- Quick sessions, sessions toward a goal, and the starter sessions of a
-- course's first week were invisible to them, so a coach could not see
-- whether a student trains or grows.
--
-- From here on, while an athlete is enrolled in one of a coach's courses, the
-- coach reads every workout they log, with what was assigned and what they
-- actually did. This is not something the athlete can switch off: it is the
-- point of having a coach, and it is what Aura's privacy policy already says
-- ("your training and results while you are enrolled in one of their courses").
-- It ends when the athlete leaves the course; logs from within the course stay
-- readable to its coach, as before.
--
-- Only reading changes. Nobody but the athlete can add, change or delete a log.
-- Safe to run twice.

create or replace function public.can_read_log(l uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.workout_logs wl
    where wl.id = l and (
      wl.athlete_id = auth.uid()
      or public.coaches_athlete(wl.athlete_id)
      or (wl.course_id is not null and public.coaches_course(wl.course_id))
    )
  );
$$;

drop policy if exists logs_read on public.workout_logs;
create policy logs_read on public.workout_logs for select to authenticated
  using (athlete_id = auth.uid() or public.coaches_athlete(athlete_id) or (course_id is not null and public.coaches_course(course_id)));

-- And the coach can say something about any of those sessions, not only the course's own.
drop policy if exists feedback_insert on public.feedback;
create policy feedback_insert on public.feedback for insert to authenticated
  with check (
    coach_id = auth.uid()
    and exists (
      select 1 from public.workout_logs wl
      where wl.id = log_id and wl.athlete_id = feedback.athlete_id
        and (public.coaches_athlete(wl.athlete_id) or (wl.course_id is not null and public.coaches_course(wl.course_id)))
    )
  );
