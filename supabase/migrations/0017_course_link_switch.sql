-- A coach closes a course's invite link, and opens it again.
--
-- Anyone signed in could join an active course by its link (the policy of
-- 0001). A coach may now close that link: while it is closed nobody joins the
-- course by themselves; students already in keep their place, and the coach
-- can still add someone. Opening it again makes the same link work again.
-- Joining through a coach's assessment is not affected. Safe to run twice.

alter table public.courses add column if not exists link_open boolean not null default true;

drop policy if exists enrollments_join on public.course_enrollments;
create policy enrollments_join on public.course_enrollments for insert to authenticated
  with check (
    public.coaches_course(course_id)
    or (athlete_id = auth.uid() and exists (select 1 from public.courses c where c.id = course_id and c.status = 'active' and c.link_open))
  );
