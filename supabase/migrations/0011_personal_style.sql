-- Personalization: an athlete's theme, character and Aura form, more about
-- themselves, and three more things they can choose to share.
--
-- Everything is added to the athlete's own identity row, so nothing that
-- exists is moved or rewritten. All of it is presentation: no rating reads it.

alter table public.athlete_identity
  -- More about the athlete
  add column country text check (country is null or length(country) <= 60),
  add column interests text[] not null default '{}',
  -- Who sees the character they chose, their ratings, and their favourite disciplines
  add column style_audience public.audience not null default 'everyone',
  -- Results stay private unless the athlete opens them: this is the rule that was in force before.
  add column ratings_audience public.audience not null default 'me',
  add column interests_audience public.audience not null default 'everyone',
  -- Personal style
  add column theme text not null default 'dark' check (theme in ('dark', 'light', 'power', 'iron')),
  -- Which of the two characters is theirs
  add column persona text check (persona in ('male', 'female')),
  add column form_aura text check (length(form_aura) <= 40),
  add column form_power text check (length(form_power) <= 40),
  add column form_iron text check (length(form_iron) <= 40),
  add column finish_aura text check (length(finish_aura) <= 40),
  add column finish_power text check (length(finish_power) <= 40),
  add column finish_iron text check (length(finish_iron) <= 40),
  add column intensity smallint not null default 60 check (intensity between 0 and 100),
  add column show_muscles boolean not null default true,
  -- When each step of personalization was completed
  add column themed_at timestamptz,
  add column persona_at timestamptz,
  add column about_at timestamptz,
  add column sharing_at timestamptz;

-- ── Sharing ratings ──────────────────────────────────────────────────────

-- Has `owner` opened their results to the caller? A hidden profile shares nothing.
create function public.shares_ratings(owner uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.can_see_profile(owner) and public.audience_allows(
    coalesce((select ratings_audience from public.athlete_identity where athlete_id = owner), 'me'), owner);
$$;

-- Results were readable by the athlete and their coach. Now also by whoever the athlete chose.
drop policy evidence_read on public.evidence;
create policy evidence_read on public.evidence for select to authenticated
  using (athlete_id = auth.uid() or public.coaches_athlete(athlete_id) or public.shares_ratings(athlete_id));

-- ── What others may see of the new parts ─────────────────────────────────

-- An athlete's chosen look, as far as the caller is allowed to see it. Hidden: no row.
create function public.style_of(p uuid)
returns table (theme text, persona text, form_aura text, form_power text, form_iron text, finish_aura text, finish_power text, finish_iron text)
language sql stable security definer set search_path = public as $$
  select i.theme, i.persona, i.form_aura, i.form_power, i.form_iron, i.finish_aura, i.finish_power, i.finish_iron
  from public.athlete_identity i
  where i.athlete_id = p and public.can_see_profile(p) and public.audience_allows(i.style_audience, p);
$$;

-- Country and favourite disciplines, each under its own audience. Hidden parts come back empty.
create function public.about_of(p uuid)
returns table (country text, interests text[])
language sql stable security definer set search_path = public as $$
  select
    case when public.audience_allows(i.base_audience, p) then i.country end,
    case when public.audience_allows(i.interests_audience, p) then i.interests else '{}' end
  from public.athlete_identity i
  where i.athlete_id = p and public.can_see_profile(p);
$$;

revoke execute on function public.shares_ratings(uuid), public.style_of(uuid), public.about_of(uuid) from public, anon;
grant execute on function public.shares_ratings(uuid), public.style_of(uuid), public.about_of(uuid) to authenticated;
