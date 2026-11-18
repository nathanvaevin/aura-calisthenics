-- A fifth theme (Goku Light), and room for the ones after it.
--
-- 0011 listed the four theme ids in a check on athlete_identity.theme, so
-- every new theme needed a database step. A theme is presentation and the
-- app knows which ids exist (an id it does not know is shown as the original
-- theme), so the database now only checks that the value looks like an id.
--
-- Nothing stored is changed. Safe to run twice.

alter table public.athlete_identity drop constraint if exists athlete_identity_theme_check;
alter table public.athlete_identity add constraint athlete_identity_theme_check check (theme ~ '^[a-z][a-z-]{1,23}$');
