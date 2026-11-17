-- Aura · starting over
--
-- An athlete can erase their own training record and go back to the welcome
-- questions, without losing the account. Some of what has to go is not theirs
-- to delete row by row (a result a coach verified, the evidence an assessment
-- produced), so it is one function, run as the athlete and for the athlete only.
--
-- Erased: results (every tier), workouts, goals, assessments taken alone, and
-- the athlete's answers in other people's assessments.
-- Kept: the account, its name and its roles, courses the athlete coaches and
-- the assessments they run for others, enrolments, who they follow.
--
-- Adds one function. Run once, after 0009.

create function public.start_over() returns void
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
begin
  if me is null then
    raise exception 'sign in to start over';
  end if;
  -- Answers in other people's assessments: the results, and the evidence drawn from them, go with the row.
  delete from public.assessment_participants where athlete_id = me;
  -- Assessments taken alone.
  delete from public.assessment_sessions where owner_id = me and solo;
  delete from public.evidence where athlete_id = me;
  delete from public.workout_logs where athlete_id = me;
  delete from public.athlete_goals where athlete_id = me;
  -- No handle is how the app knows the welcome questions have not been answered.
  update public.profiles set handle = null, bio = '' where id = me;
end;
$$;

revoke all on function public.start_over() from public, anon;
grant execute on function public.start_over() to authenticated;
