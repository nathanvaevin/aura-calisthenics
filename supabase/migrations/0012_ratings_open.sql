-- An athlete's Aura and ratings are open to other athletes unless they close
-- them. 0011 started them at "only me"; the owner decided the other way round.
--
-- Athletes who have not been through the sharing step have chosen nothing
-- yet, so the new starting point is theirs too. A choice already made is
-- kept. A hidden profile still shares nothing (shares_ratings, 0011).
--
-- Safe to run twice: the second run finds the new default and does nothing,
-- so it can never reopen ratings someone closed afterwards.

do $$
begin
  if (select column_default from information_schema.columns
      where table_schema = 'public' and table_name = 'athlete_identity' and column_name = 'ratings_audience') like '''me''%' then
    update public.athlete_identity set ratings_audience = 'everyone' where ratings_audience = 'me' and sharing_at is null;
    alter table public.athlete_identity alter column ratings_audience set default 'everyone';
  end if;
end $$;
