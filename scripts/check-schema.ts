/**
 * Applies the core migration and the generated seed to an in-process Postgres
 * (PGlite) and exercises the access policies. Run: npm run db:check
 *
 * This proves the SQL is valid and the row-level rules behave as intended. It
 * does not replace testing against a real Supabase project.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { PGlite } from '@electric-sql/pglite'

const read = (rel: string) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8')

// The parts of Supabase the migrations rely on: the auth schema and the
// storage schema, stubbed closely enough to run the real migrations and their
// policies. On a real project these are provided by Supabase.
const PRELUDE = `
  create role anon nologin;
  create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), raw_user_meta_data jsonb default '{}');
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  -- Real Supabase: the claims of the caller's token. Guests carry is_anonymous.
  create function auth.jwt() returns jsonb language sql stable as $$
    select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
  $$;
  grant usage on schema auth to anon, authenticated;

  create schema storage;
  create table storage.buckets (id text primary key, name text not null, public boolean not null default false);
  create table storage.objects (
    id uuid primary key default gen_random_uuid(),
    bucket_id text references storage.buckets (id),
    name text not null,
    owner uuid
  );
  -- Real Supabase: the folder names of an object path (everything but the file).
  create function storage.foldername(name text) returns text[] language sql immutable as $$
    select (string_to_array(name, '/'))[1:greatest(array_length(string_to_array(name, '/'), 1) - 1, 0)]
  $$;
  alter table storage.objects enable row level security;
  grant usage on schema storage to anon, authenticated;
  grant select, insert, update, delete on storage.objects to anon, authenticated;
`

const db = new PGlite()
let passed = 0
let failed = 0

const ok = (label: string) => { passed++; console.log(`  ✓ ${label}`) }
const bad = (label: string, why: string) => { failed++; console.log(`  ✗ ${label}\n      ${why}`) }

/** Accounts signed in as guests, for the checks that tell them apart. */
const guests = new Set<string>()

async function as<T>(user: string | null, role: 'authenticated' | 'anon', fn: () => Promise<T>): Promise<T> {
  const claims = user ? JSON.stringify({ sub: user, is_anonymous: guests.has(user) }) : ''
  await db.exec(`select set_config('request.jwt.claim.sub', '${user ?? ''}', false); select set_config('request.jwt.claims', '${claims}', false); set role ${role};`)
  try {
    return await fn()
  } finally {
    await db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false); select set_config('request.jwt.claims', '', false);`)
  }
}

const count = async (sql: string) => (await db.query<{ n: number }>(`select count(*)::int as n from (${sql}) t`)).rows[0].n

async function expectCount(label: string, user: string | null, sql: string, want: number, role: 'authenticated' | 'anon' = 'authenticated') {
  try {
    const n = await as(user, role, () => count(sql))
    n === want ? ok(label) : bad(label, `expected ${want} rows, got ${n}`)
  } catch (e) {
    bad(label, (e as Error).message)
  }
}

async function expectOk(label: string, user: string | null, sql: string) {
  try {
    await as(user, 'authenticated', () => db.exec(sql))
    ok(label)
  } catch (e) {
    bad(label, (e as Error).message)
  }
}

async function expectDenied(label: string, user: string | null, sql: string, role: 'authenticated' | 'anon' = 'authenticated') {
  try {
    await as(user, role, () => db.exec(sql))
    bad(label, 'statement succeeded but should have been refused')
  } catch {
    ok(label)
  }
}

const EARLY = '00000000-0000-0000-0000-0000000000e1'
const CHOSE = '00000000-0000-0000-0000-0000000000e2'
console.log('Applying schema')
await db.exec(PRELUDE)
for (const file of ['0001_core.sql', '0002_storage.sql', '0003_evidence_observed.sql', '0004_assessments.sql', '0005_places.sql', '0006_live.sql', '0007_coach_access.sql', '0008_course_weeks_and_station_mode.sql', '0009_visual_content.sql', '0010_start_over.sql', '0011_personal_style.sql', '0012_ratings_open.sql']) {
  // Two athletes from before ratings were opened: one who never chose, one who chose to keep them.
  if (file === '0012_ratings_open.sql') await db.exec(`insert into auth.users (id) values ('${EARLY}'), ('${CHOSE}'); insert into public.athlete_identity (athlete_id) values ('${EARLY}'); insert into public.athlete_identity (athlete_id, sharing_at) values ('${CHOSE}', now());`)
  await db.exec(read(`../supabase/migrations/${file}`))
  ok(`${file} applies cleanly`)
}
;(await count(`select 1 from public.athlete_identity where athlete_id = '${EARLY}' and ratings_audience = 'everyone'`)) === 1 ? ok('0012 opens the ratings of an athlete who had not chosen') : bad('0012', 'an athlete who never chose is still closed')
;(await count(`select 1 from public.athlete_identity where athlete_id = '${CHOSE}' and ratings_audience = 'me'`)) === 1 ? ok('…and keeps a choice already made') : bad('0012', 'a choice that was made was overwritten')
await db.exec(`update public.athlete_identity set ratings_audience = 'me' where athlete_id = '${EARLY}';`)
await db.exec(read('../supabase/migrations/0012_ratings_open.sql'))
;(await count(`select 1 from public.athlete_identity where athlete_id = '${EARLY}' and ratings_audience = 'me'`)) === 1 ? ok('…run a second time it reopens nothing') : bad('0012', 'a second run reopened ratings that were closed')
await db.exec(`delete from auth.users where id in ('${EARLY}', '${CHOSE}');`)
await db.exec(read('../supabase/seed.sql'))
ok('seed.sql applies cleanly')
await db.exec(read('../supabase/seed.sql'))
ok('seed.sql is idempotent')

console.log('\nCatalog')
for (const [table, min] of [['disciplines', 6], ['exercises', 100], ['progressions', 15], ['progression_steps', 80], ['skills', 100], ['skill_prerequisites', 100], ['rating_curves', 300], ['workouts', 5]] as const) {
  const n = await count(`select 1 from public.${table}`)
  n >= min ? ok(`${table}: ${n} rows`) : bad(`${table}`, `only ${n} rows, expected at least ${min}`)
}
const cyc = await count(`
  with recursive walk(skill_id, requires_id, depth) as (
    select skill_id, requires_id, 1 from public.skill_prerequisites
    union all
    select w.skill_id, p.requires_id, w.depth + 1 from walk w join public.skill_prerequisites p on p.skill_id = w.requires_id where w.depth < 40
  ) select 1 from walk where skill_id = requires_id`)
cyc === 0 ? ok('skill prerequisites contain no cycles') : bad('skill prerequisites', `${cyc} cyclic paths`)

console.log('\nAccess rules')
const [A, B, C] = ['00000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-00000000000b', '00000000-0000-0000-0000-00000000000c']
await db.exec(`insert into auth.users (id, raw_user_meta_data) values ('${A}', '{"full_name":"Athlete A"}'), ('${B}', '{}'), ('${C}', '{"name":"Coach C"}');`)
;(await count(`select 1 from public.profiles`)) === 3 ? ok('a profile is created for every new account') : bad('profile trigger', 'profiles missing')
await db.exec(`update public.profiles set roles = '{athlete,coach}' where id = '${C}';`)

const course = '10000000-0000-0000-0000-000000000001'
const draft = '10000000-0000-0000-0000-000000000002'
const week = '20000000-0000-0000-0000-000000000001'
const session = '30000000-0000-0000-0000-000000000001'
const block = '40000000-0000-0000-0000-000000000001'
const log = '50000000-0000-0000-0000-000000000001'
const entry = '60000000-0000-0000-0000-000000000001'
const ev = '70000000-0000-0000-0000-000000000001'

await expectDenied('an athlete without the coach role cannot create a course', A, `insert into public.courses (coach_id, title, start_date) values ('${A}', 'Nope', '2026-01-05');`)
await expectOk('a coach creates a course with a week, session and block', C, `
  insert into public.courses (id, coach_id, title, status, start_date) values ('${course}', '${C}', 'Handstand', 'active', '2026-01-05'), ('${draft}', '${C}', 'Draft', 'draft', '2026-02-02');
  insert into public.course_weeks (id, course_id, position, title) values ('${week}', '${course}', 0, 'Week 1');
  insert into public.course_sessions (id, week_id, day, title) values ('${session}', '${week}', 0, 'Monday');
  insert into public.course_blocks (id, session_id, position, kind, exercise_id, progression_id, level, min_level, max_level, sets, target) values ('${block}', '${session}', 0, 'strength', 'pushup', 'pushup', 5, 3, 7, 3, 10);`)
await expectCount('other athletes see the active course but not the draft', B, `select 1 from public.courses`, 1)
await expectCount('the coach sees both of their courses', C, `select 1 from public.courses`, 2)
await expectDenied('an athlete cannot edit a coach’s programming', A, `insert into public.course_weeks (course_id, position) values ('${course}', 1);`)
await expectDenied('an athlete cannot join a draft course', A, `insert into public.course_enrollments (course_id, athlete_id) values ('${draft}', '${A}');`)
await expectOk('an athlete joins an active course', A, `insert into public.course_enrollments (course_id, athlete_id) values ('${course}', '${A}');`)
await expectDenied('an athlete cannot enrol someone else', A, `insert into public.course_enrollments (course_id, athlete_id) values ('${course}', '${B}');`)

await expectOk('an athlete logs a workout with the variation they chose', A, `
  insert into public.workout_logs (id, athlete_id, title, source_type, course_id, session_id, started_at, finished_at, rpe) values ('${log}', '${A}', 'Monday', 'course', '${course}', '${session}', now(), now(), 7);
  insert into public.workout_log_entries (id, log_id, position, kind, block_id, progression_id, assigned_exercise_id, assigned_level, assigned_target, exercise_id, level, target) values ('${entry}', '${log}', 0, 'strength', '${block}', 'pushup', 'pushup', 5, 10, 'knee-pushup', 4, 10);
  insert into public.workout_log_sets (entry_id, position, exercise_id, level, value) values ('${entry}', 0, 'knee-pushup', 4, 12);
  insert into public.evidence (id, athlete_id, exercise_id, value, tier, source, log_id) values ('${ev}', '${A}', 'knee-pushup', 12, 'self', 'workout', '${log}');`)
await expectDenied('an athlete cannot log a workout for someone else', B, `insert into public.workout_logs (athlete_id, title, source_type, started_at) values ('${A}', 'x', 'library', now());`)
await expectDenied('an athlete cannot insert evidence that is already verified', A, `insert into public.evidence (athlete_id, exercise_id, value, tier, source, verified_by, verified_at) values ('${A}', 'pushup', 50, 'coach', 'manual', '${A}', now());`)
await expectCount('another athlete cannot read their evidence', B, `select 1 from public.evidence`, 0)
await expectCount('another athlete cannot read their workout log', B, `select 1 from public.workout_logs`, 0)
await expectCount('their coach can read the evidence', C, `select 1 from public.evidence`, 1)
await expectCount('their coach can read the log, entries and sets', C, `select 1 from public.workout_logs l join public.workout_log_entries e on e.log_id = l.id join public.workout_log_sets s on s.entry_id = e.id`, 1)
await expectCount('the coach sees the variation actually performed', C, `select 1 from public.workout_log_entries where assigned_exercise_id = 'pushup' and exercise_id = 'knee-pushup' and level = 4`, 1)

await expectDenied('an athlete cannot verify their own evidence', A, `select public.verify_evidence('${ev}');`)
await expectDenied('an unrelated athlete cannot verify it either', B, `select public.verify_evidence('${ev}');`)
await as(A, 'authenticated', () => db.exec(`update public.evidence set tier = 'coach', verified_by = '${C}', verified_at = now() where id = '${ev}';`)).catch(() => undefined)
;(await count(`select 1 from public.evidence where id = '${ev}' and tier = 'self'`)) === 1 ? ok('a direct update cannot change an evidence tier') : bad('evidence update', 'tier was changed by the athlete')
await expectOk('the coach verifies it', C, `select public.verify_evidence('${ev}');`)
;(await count(`select 1 from public.evidence where id = '${ev}' and tier = 'coach' and verified_by = '${C}'`)) === 1 ? ok('verification records who verified') : bad('verification', 'tier or verifier not recorded')
await as(A, 'authenticated', () => db.exec(`delete from public.evidence where id = '${ev}';`)).catch(() => undefined)
;(await count(`select 1 from public.evidence where id = '${ev}'`)) === 1 ? ok('verified evidence cannot be deleted by the athlete') : bad('evidence delete', 'verified evidence was deleted')

await expectOk('the coach leaves feedback on the session', C, `insert into public.feedback (log_id, coach_id, athlete_id, body) values ('${log}', '${C}', '${A}', 'Good depth.');`)
await expectDenied('someone who is not the coach cannot leave feedback', B, `insert into public.feedback (log_id, coach_id, athlete_id, body) values ('${log}', '${B}', '${A}', 'hi');`)
await expectCount('the athlete reads the feedback', A, `select 1 from public.feedback`, 1)
await expectDenied('nobody can grant themselves the admin role', A, `update public.profiles set roles = '{athlete,admin}' where id = '${A}';`)
await expectDenied('scores cannot be written from the client', A, `insert into public.aura_records (athlete_id, model_version, aura, mastery, versatility, status) values ('${A}', 'provisional-0.1', 99999, 999, 100, 'verified');`)
await expectCount('signed-out visitors can read the exercise library', null, `select 1 from public.exercises limit 1`, 1, 'anon')
await expectDenied('signed-out visitors cannot read evidence', null, `select 1 from public.evidence;`, 'anon')

console.log('\nAssessments')
const D = '00000000-0000-0000-0000-00000000000d'
const E = '00000000-0000-0000-0000-00000000000e'
await db.exec(`insert into auth.users (id, raw_user_meta_data) values ('${D}', '{"name":"Dee"}'), ('${E}', '{"name":"Eve"}');`)
const sess = '80000000-0000-0000-0000-000000000001'
await expectDenied('an athlete cannot open a group assessment', A, `insert into public.assessment_sessions (owner_id, protocol, stations) values ('${A}', 'baseline-1', '{pull}');`)
await expectOk('an athlete can open a solo assessment', A, `insert into public.assessment_sessions (owner_id, solo, protocol, stations) values ('${A}', true, 'baseline-1', '{pull}');`)
await expectOk('a coach opens a group assessment for their course', C, `insert into public.assessment_sessions (id, owner_id, protocol, group_name, course_id, stations, invite_token) values ('${sess}', '${C}', 'baseline-1', 'Handstand', '${course}', '{pull,push}', 'tok-123');`)
await expectCount('the session is invisible to someone who has not joined', B, `select 1 from public.assessment_sessions where id = '${sess}'`, 0)
await expectDenied('a wrong invitation token lets nobody in', B, `select public.join_assessment('nope');`)
await expectDenied('nobody can add themselves without the token', B, `insert into public.assessment_participants (session_id, athlete_id, display_name) values ('${sess}', '${B}', 'B');`)
for (const [who, share] of [[A, 'coach'], [B, 'group'], [D, 'coach']] as const) await as(who, 'authenticated', () => db.exec(`select public.join_assessment('tok-123', '${share}');`))
;(await count(`select 1 from public.assessment_participants where session_id = '${sess}'`)) === 3 ? ok('three athletes join with the token') : bad('join', 'participants missing')
await expectCount('after joining, the session is visible', B, `select 1 from public.assessment_sessions where id = '${sess}'`, 1)
const pid = async (who: string) => (await db.query<{ id: string }>(`select id from public.assessment_participants where session_id = '${sess}' and athlete_id = '${who}'`)).rows[0].id
const [pa, pb, pd] = [await pid(A), await pid(B), await pid(D)]
await expectOk('an athlete records their own result as self-reported', A, `insert into public.assessment_results (participant_id, test_id, value, demonstrates) values ('${pa}', 'pull-up', 6, '[["pull-up", 6]]'), ('${pa}', 'dead-hang', 40, '[["dead-hang", 40]]');`)
await expectDenied('an athlete cannot record their own result as verified', A, `insert into public.assessment_results (participant_id, test_id, value, tier) values ('${pa}', 'pushup', 50, 'coach');`)
await expectDenied('an athlete cannot record a result for someone else', B, `insert into public.assessment_results (participant_id, test_id, value) values ('${pa}', 'pushup', 50);`)
await expectCount('another member of the group cannot read their results', B, `select 1 from public.assessment_results`, 0)
await expectCount('the coach reads every result', C, `select 1 from public.assessment_results`, 2)
await expectCount('members see only who chose to share, plus themselves', A, `select 1 from public.assessment_participants where session_id = '${sess}'`, 2)
await expectCount('the coach sees everyone who joined', C, `select 1 from public.assessment_participants where session_id = '${sess}'`, 3)
await expectDenied('an athlete cannot observe or verify their own result', A, `select public.set_result_tier('${pa}', 'pull-up', 'coach');`)
await as(A, 'authenticated', () => db.exec(`update public.assessment_results set tier = 'coach' where participant_id = '${pa}';`)).catch(() => undefined)
;(await count(`select 1 from public.assessment_results where participant_id = '${pa}' and tier <> 'self'`)) === 0 ? ok('a direct update cannot raise a result’s tier') : bad('result tier', 'athlete raised their own tier')
await expectOk('the coach marks one result observed and one verified', C, `select public.set_result_tier('${pa}', 'pull-up', 'observed'); select public.set_result_tier('${pa}', 'dead-hang', 'coach');`)
await expectOk('the coach records for someone they are watching', C, `insert into public.assessment_results (participant_id, test_id, value, tier, demonstrates, recorded_by) values ('${pd}', 'pull-up', 2, 'observed', '[["pull-up", 2]]', '${C}');`)
await expectOk('athletes publish the shape their assessment produced', A, `insert into public.assessment_profiles (participant_id, ratings, aura) values ('${pa}', '{"pull": 300}', 1500);`)
await as(B, 'authenticated', () => db.exec(`insert into public.assessment_profiles (participant_id, ratings, aura) values ('${pb}', '{"pull": 200}', 900);`))
await expectCount('the group sees no totals while it is too small to hide in', B, `select 1 from public.assessment_group('${sess}')`, 0)
await expectCount('the coach sees the group at any size', C, `select 1 from public.assessment_group('${sess}')`, 2)
await as(D, 'authenticated', () => db.exec(`insert into public.assessment_profiles (participant_id, ratings, aura) values ('${pd}', '{"pull": 150}', 700);`))
await expectCount('with three people the group sees anonymous totals', B, `select 1 from public.assessment_group('${sess}')`, 3)
await expectCount('an outsider sees no totals', E, `select 1 from public.assessment_group('${sess}')`, 0)
await expectCount('a member sees a shape only where it was shared', A, `select 1 from public.assessment_profiles`, 2)
await expectDenied('a participant cannot finalise the session', A, `select public.finalise_assessment('${sess}');`)
await expectOk('the coach finalises', C, `select public.finalise_assessment('${sess}');`)
;(await count(`select 1 from public.evidence where assessment_id = '${sess}' and athlete_id = '${A}' and exercise_id = 'pull-up' and tier = 'observed' and observed_by = '${C}'`)) === 1 ? ok('an observed result becomes observed evidence, with the observer') : bad('finalise', 'observed evidence missing')
;(await count(`select 1 from public.evidence where assessment_id = '${sess}' and athlete_id = '${A}' and exercise_id = 'dead-hang' and tier = 'coach' and verified_by = '${C}'`)) === 1 ? ok('a verified result becomes verified evidence') : bad('finalise', 'verified evidence missing')
;(await count(`select 1 from public.course_enrollments where course_id = '${course}' and athlete_id in ('${B}', '${D}')`)) === 2 ? ok('finalising enrols the group in the linked course') : bad('finalise', 'participants not enrolled')
await expectDenied('results are closed to athletes once finalised', A, `update public.assessment_results set value = 99 where participant_id = '${pa}' and test_id = 'pull-up'; select 1 / (select count(*) from public.assessment_results where participant_id = '${pa}' and value = 99);`)
await expectDenied('an expired or closed invitation lets nobody in', E, `select public.join_assessment('tok-123');`)

// ── Identity, places and presence ────────────────────────────────────────
console.log('\nIdentity, places and presence')
const one = async <T,>(sql: string) => (await db.query<T>(sql)).rows[0]
const cols = (await db.query<{ column_name: string }>(`select column_name from information_schema.columns where table_schema = 'public' and table_name = 'visits'`)).rows.map((r) => r.column_name)
cols.some((c) => /lat|lon|geo|position|coord/.test(c)) ? bad('visits', `a visit stores a position: ${cols.join(', ')}`) : ok('a visit has no column that could hold a position')
;(await count(`select 1 from information_schema.columns where table_schema = 'public' and table_name = 'profiles' and column_name = 'city'`)) === 0 ? ok('the city no longer sits on the profile row everyone can read') : bad('city', 'still on profiles')

await expectOk('an athlete adds a place', A, `insert into public.places (name, kind, lat, lon, equipment, source, created_by) values ('River bars', 'calisthenics', 38.7362, -9.1761, '{bar,dip_bars}', 'athlete', '${A}');`)
await expectDenied('nobody adds a place in someone else’s name', B, `insert into public.places (name, kind, lat, lon, source, created_by) values ('Fake', 'other', 1, 1, 'athlete', '${A}');`)
await expectDenied('an athlete cannot pass a place off as OpenStreetMap’s', B, `insert into public.places (name, kind, lat, lon, source, osm_ref, created_by) values ('Fake', 'other', 1, 1, 'osm', 'node/1', '${B}');`)
const place = (await one<{ id: string }>(`select id from public.places where name = 'River bars'`)).id
await db.exec(`insert into public.places (name, kind, lat, lon, source, osm_ref) values ('Mapped park', 'outdoor', 38.75, -9.14, 'osm', 'node/42');`)
const mapped = (await one<{ id: string }>(`select id from public.places where osm_ref = 'node/42'`)).id
await expectCount('places are readable without an account', null, `select 1 from public.places`, 2, 'anon')
await as(B, 'authenticated', () => db.exec(`update public.places set name = 'Hijacked' where id = '${place}';`)).catch(() => undefined)
;(await count(`select 1 from public.places where name = 'Hijacked'`)) === 0 ? ok('only its author can change an athlete-added place') : bad('places', 'another athlete renamed a place')

await expectDenied('a visit cannot be inserted directly', A, `insert into public.visits (athlete_id, place_id, ends_at) values ('${A}', '${place}', now() + interval '1 hour');`)
await expectDenied('confirming a place needs a visit running there', A, `insert into public.place_confirmations (place_id, athlete_id) values ('${place}', '${A}');`)
// A follows B, not D. So "people I follow" opens A's things to B only.
await as(A, 'authenticated', () => db.exec(`insert into public.follows (follower_id, followee_id) values ('${A}', '${B}');`))
await expectOk('check in for the people I follow, 40 m from the place', A, `select public.check_in('${place}', 60, 'following', 38.73655, -9.17599);`)
const visit = await one<{ id: string; on_site: boolean; mins: number }>(`select id, on_site, round(extract(epoch from ends_at - started_at) / 60)::int as mins from public.visits where athlete_id = '${A}'`)
visit.on_site && visit.mins === 60 ? ok('the server confirms “on site” and keeps only that fact') : bad('check_in', JSON.stringify(visit))
await expectCount('someone I follow sees me there', B, `select 1 from public.visits where athlete_id = '${A}'`, 1)
await expectCount('someone I do not follow does not', D, `select 1 from public.visits where athlete_id = '${A}'`, 0)
await as(E, 'authenticated', () => db.exec(`insert into public.follows (follower_id, followee_id) values ('${E}', '${A}');`))
await expectCount('following me does not open anything: only who I follow counts', E, `select 1 from public.visits where athlete_id = '${A}'`, 0)
await expectOk('while there, I can confirm the place', A, `insert into public.place_confirmations (place_id, athlete_id) values ('${place}', '${A}');`)
await as(B, 'authenticated', () => db.exec(`update public.visits set audience = 'everyone' where id = '${visit.id}';`)).catch(() => undefined)
;(await count(`select 1 from public.visits where id = '${visit.id}' and audience = 'following'`)) === 1 ? ok('nobody else can change my visit') : bad('visits', 'another athlete changed a visit')
await expectDenied('a visit cannot be moved to another place afterwards', A, `update public.visits set place_id = '${mapped}' where id = '${visit.id}';`)
await expectDenied('a visit cannot run longer than four hours', A, `update public.visits set ends_at = started_at + interval '5 hours' where id = '${visit.id}';`)

await expectOk('a second check-in, far from the place, open to everyone', A, `select public.check_in('${mapped}', 9999, 'everyone', 38.7, -9.3);`)
;(await count(`select 1 from public.visits where athlete_id = '${A}' and ends_at > now()`)) === 1 ? ok('checking in somewhere else ends the first visit') : bad('check_in', 'two visits running at once')
const second = await one<{ on_site: boolean; mins: number }>(`select on_site, round(extract(epoch from ends_at - started_at) / 60)::int as mins from public.visits where athlete_id = '${A}' and place_id = '${mapped}'`)
!second.on_site && second.mins === 240 ? ok('too far away is not “on site”, and the length is capped at four hours') : bad('check_in', JSON.stringify(second))
await expectCount('a stranger sees a visit that is running and open to everyone', D, `select 1 from public.visits where athlete_id = '${A}'`, 1)
await db.exec(`update public.visits set started_at = now() - interval '3 hours', ends_at = now() - interval '2 hours' where athlete_id = '${A}' and place_id = '${mapped}';`).catch(async () => {
  // started_at is protected by the trigger; move the window as the table owner.
  await db.exec(`alter table public.visits disable trigger visits_protect; update public.visits set started_at = now() - interval '3 hours', ends_at = now() - interval '2 hours' where athlete_id = '${A}' and place_id = '${mapped}'; alter table public.visits enable trigger visits_protect;`)
})
await expectCount('once it has ended, the same stranger sees nothing: history is closed by default', D, `select 1 from public.visits where athlete_id = '${A}'`, 0)
await expectCount('I still see my own history', A, `select 1 from public.visits where athlete_id = '${A}'`, 2)

await expectOk('I describe where I am from and choose who sees what', A, `insert into public.athlete_identity (athlete_id, origin, city, environments, home_place_id, origin_audience, base_audience, places_audience, visits_audience) values ('${A}', 'Porto', 'Lisbon', '{outdoor}', '${place}', 'me', 'everyone', 'following', 'everyone'); insert into public.place_favourites (athlete_id, place_id) values ('${A}', '${mapped}');`)
await expectCount('opening my history to everyone shows past visits that were themselves open', D, `select 1 from public.visits where athlete_id = '${A}'`, 1)
await expectCount('nobody else can read my identity row directly', D, `select 1 from public.athlete_identity where athlete_id = '${A}'`, 0)
const seen = async (who: string) => as(who, 'authenticated', () => one<{ origin: string | null; city: string | null; home_place_id: string | null; n: number }>(`select origin, city, home_place_id, cardinality(favourite_place_ids) as n from public.identity_of('${A}')`))
const stranger = await seen(D)
stranger.city === 'Lisbon' && stranger.origin === null && stranger.home_place_id === null && stranger.n === 0 ? ok('a stranger gets my city and nothing else') : bad('identity_of', JSON.stringify(stranger))
const friend = await seen(B)
friend.city === 'Lisbon' && friend.origin === null && friend.home_place_id === place && friend.n === 1 ? ok('someone I follow also gets my home spot and favourites, still not my origin') : bad('identity_of', JSON.stringify(friend))
const self = await seen(A)
self.origin === 'Porto' ? ok('I see all of it') : bad('identity_of', JSON.stringify(self))
await expectCount('my favourites follow the same audience', D, `select 1 from public.place_favourites where athlete_id = '${A}'`, 0)
await expectCount('…and are visible to someone I follow', B, `select 1 from public.place_favourites where athlete_id = '${A}'`, 1)
await expectOk('I can forget my own visits', A, `delete from public.visits where athlete_id = '${A}';`)
;(await count(`select 1 from public.visits where athlete_id = '${A}'`)) === 0 ? ok('forgotten visits are gone') : bad('visits', 'delete did not remove them')

// ── Media storage (0002) ─────────────────────────────────────────────────
console.log('\nMedia storage')
;(await count(`select 1 from storage.buckets where id = 'demonstrations' and public`)) === 1
  ? ok('the demonstrations bucket exists and is public')
  : bad('storage', 'demonstrations bucket missing')
await expectCount('anyone can read a demonstration', null, `select 1 from storage.objects`, 0, 'anon')
await expectOk('a coach uploads into their own folder', C, `insert into storage.objects (bucket_id, name, owner) values ('demonstrations', '${C}/clip.mp4', '${C}');`)
await expectDenied('a non-coach cannot upload a demonstration', A, `insert into storage.objects (bucket_id, name) values ('demonstrations', '${A}/clip.mp4');`)
await expectDenied('a coach cannot upload into someone else’s folder', C, `insert into storage.objects (bucket_id, name) values ('demonstrations', '${A}/clip.mp4');`)
await as(A, 'authenticated', () => db.exec(`delete from storage.objects where name = '${C}/clip.mp4';`)).catch(() => undefined)
;(await count(`select 1 from storage.objects where name = '${C}/clip.mp4'`)) === 1
  ? ok('nobody can delete someone else’s demonstration')
  : bad('storage', 'an athlete deleted a coach’s demonstration')

// ── Going live (0006) ────────────────────────────────────────────────────
console.log('\nGoing live')
const sess2 = '80000000-0000-0000-0000-000000000002'
const G = '00000000-0000-0000-0000-00000000000f'
const H = '00000000-0000-0000-0000-000000000010'
guests.add(G)
await db.exec(`insert into auth.users (id, raw_user_meta_data) values ('${G}', '{}'), ('${H}', '{"name":"Hal"}');`)
await as(C, 'authenticated', () => db.exec(`insert into public.assessment_sessions (id, owner_id, protocol, title, group_name, course_id, stations, invite_token) values ('${sess2}', '${C}', 'baseline-1', 'Re-test', 'Tuesday group', '${course}', '{pull,push}', 'tok-456');`))
const peek = async (token: string, role: 'authenticated' | 'anon' = 'anon') => as(role === 'anon' ? null : H, role, () => db.query<{ session_id: string; coach_name: string; course_title: string; group_name: string }>(`select * from public.peek_invite('${token}')`))
const open = (await peek('tok-456')).rows
open.length === 1 && open[0].session_id === sess2 && open[0].coach_name === 'Coach C' && open[0].course_title === 'Handstand' && open[0].group_name === 'Tuesday group'
  ? ok('an invitation can be read before signing in: who, what, which course') : bad('peek_invite', JSON.stringify(open))
;(await peek('nope')).rows.length === 0 ? ok('a wrong code reveals nothing') : bad('peek_invite', 'a wrong token returned a session')
;(await peek('tok-123')).rows.length === 0 ? ok('a finalised session’s code reveals nothing') : bad('peek_invite', 'a closed session was readable')
await expectDenied('nobody joins without an account', null, `select public.join_assessment('tok-456');`, 'anon')
await db.exec(`update public.profiles set name = 'Guest Gia' where id = '${G}';`)
await expectOk('a guest joins with the code', G, `select public.join_assessment('tok-456', 'coach');`)
;(await count(`select 1 from public.assessment_participants where session_id = '${sess2}' and athlete_id = '${G}' and display_name = 'Guest Gia'`)) === 1 ? ok('…under the name on their profile') : bad('join', 'guest participant missing or misnamed')
;(await count(`select 1 from public.course_enrollments where course_id = '${course}' and athlete_id = '${G}'`)) === 1 ? ok('joining puts them in the course at once, before anything is finalised') : bad('join', 'guest not enrolled on joining')
await expectCount('…so the course is theirs to open', G, `select 1 from public.courses where id = '${course}'`, 1)
await expectOk('the coach joining their own session is not enrolled as a student', C, `select public.join_assessment('tok-456');`)
;(await count(`select 1 from public.course_enrollments where course_id = '${course}' and athlete_id = '${C}'`)) === 0 ? ok('…and is not') : bad('join', 'coach enrolled in own course')
const pg = (await db.query<{ id: string }>(`select id from public.assessment_participants where session_id = '${sess2}' and athlete_id = '${G}'`)).rows[0].id
await expectOk('the guest records a result', G, `insert into public.assessment_results (participant_id, test_id, value, demonstrates) values ('${pg}', 'pushup', 12, '[["pushup", 12]]');`)
await expectOk('the coach raises it to observed by writing the row', C, `insert into public.assessment_results (participant_id, test_id, value, tier, demonstrates, recorded_by) values ('${pg}', 'pushup', 12, 'observed', '[["pushup", 12]]', '${C}') on conflict (participant_id, test_id) do update set tier = excluded.tier, recorded_by = excluded.recorded_by;`)
await expectOk('the guest also logs a best of their own', G, `insert into public.evidence (athlete_id, exercise_id, value, source) values ('${G}', 'squat', 20, 'manual');`)
await expectOk('the coach finalises the second session', C, `select public.finalise_assessment('${sess2}');`)
;(await count(`select 1 from public.evidence where athlete_id = '${G}' and assessment_id = '${sess2}' and tier = 'observed'`)) === 1 ? ok('the guest’s result is evidence on the guest profile') : bad('finalise', 'guest evidence missing')

await expectDenied('an account that is not a guest cannot ask for a hand-over code', H, `select public.start_claim();`)
const code = (await as(G, 'authenticated', () => db.query<{ c: string }>(`select public.start_claim() as c`))).rows[0].c
code.length >= 32 ? ok('a guest gets a hand-over code') : bad('start_claim', 'no code')
await expectDenied('the code table cannot be read directly', H, `select 1 from public.guest_claims;`)
await expectDenied('a guest cannot hand over to itself or another guest', G, `select public.finish_claim('${code}');`)
await expectDenied('a wrong code moves nothing', H, `select public.finish_claim('nope');`)
await expectOk('the athlete’s own account takes the code', H, `select public.finish_claim('${code}');`)
;(await count(`select 1 from public.assessment_participants where session_id = '${sess2}' and athlete_id = '${H}'`)) === 1 ? ok('the guest’s place in the session is now the account’s') : bad('finish_claim', 'participant not moved')
;(await count(`select 1 from public.evidence where athlete_id = '${H}'`)) === 2 && (await count(`select 1 from public.evidence where athlete_id = '${G}'`)) === 0 ? ok('…with the evidence, assessed and self-logged') : bad('finish_claim', 'evidence not moved')
;(await count(`select 1 from public.course_enrollments where course_id = '${course}' and athlete_id = '${H}'`)) === 1 && (await count(`select 1 from public.course_enrollments where athlete_id = '${G}'`)) === 0 ? ok('…and the place in the course') : bad('finish_claim', 'enrolment not moved')
await expectCount('the coach can now read that athlete’s evidence', C, `select 1 from public.evidence where athlete_id = '${H}'`, 2)
await expectDenied('a code works once', H, `select public.finish_claim('${code}');`)

await expectOk('the coach removes a participant after finalising', C, `delete from public.assessment_participants where session_id = '${sess2}' and athlete_id = '${H}';`)
;(await count(`select 1 from public.evidence where athlete_id = '${H}' and assessment_id = '${sess2}'`)) === 0 && (await count(`select 1 from public.evidence where athlete_id = '${H}'`)) === 1 ? ok('their evidence from that assessment goes with them; the rest stays') : bad('participant delete', 'assessment evidence left behind')
const before = await count(`select 1 from public.evidence where assessment_id = '${sess}'`)
await expectOk('the coach deletes a finalised assessment', C, `delete from public.assessment_sessions where id = '${sess}';`)
before > 0 && (await count(`select 1 from public.evidence where assessment_id = '${sess}'`)) === 0 && (await count(`select 1 from public.evidence where assessment_id is null and source = 'assessment'`)) === 0 ? ok('the evidence it wrote is removed with it') : bad('session delete', 'evidence outlived its assessment')

// ── Coaching by approval (0007) ──────────────────────────────────────────
console.log('\nCoaching by approval')
const K = '00000000-0000-0000-0000-000000000011'
const ADM = '00000000-0000-0000-0000-000000000012'
await db.exec(`insert into auth.users (id, raw_user_meta_data) values ('${K}', '{"name":"Kai"}'), ('${ADM}', '{"name":"Owner"}');`)
await db.exec(`update public.profiles set roles = '{athlete,coach,admin}' where id = '${ADM}';`)
ok('the owner is made admin and coach from the SQL editor')
await expectDenied('an athlete cannot make themselves a coach', K, `update public.profiles set roles = '{athlete,coach}' where id = '${K}';`)
await expectDenied('…not even by sending their whole profile again', K, `insert into public.profiles (id, name, roles) values ('${K}', 'Kai', '{athlete,coach}') on conflict (id) do update set roles = excluded.roles;`)
await expectOk('an existing coach can still save their whole profile', C, `insert into public.profiles (id, name, roles) values ('${C}', 'Coach C', '{athlete,coach}') on conflict (id) do update set name = excluded.name, roles = excluded.roles;`)
await expectDenied('a coach cannot make themselves admin', C, `update public.profiles set roles = '{athlete,coach,admin}' where id = '${C}';`)
await expectDenied('…so cannot open a course either', K, `insert into public.courses (coach_id, title, start_date) values ('${K}', 'Mine', '2026-12-07');`)
await expectDenied('a guest cannot ask for coach access', G, `select public.request_coach('hi');`)
await expectOk('an athlete asks for coach access', K, `select public.request_coach('I teach handstands on Tuesdays');`)
await expectCount('they see their own request', K, `select 1 from public.coach_requests where status = 'pending'`, 1)
await expectCount('another athlete does not', A, `select 1 from public.coach_requests`, 0)
await expectDenied('nobody edits a request directly', K, `update public.coach_requests set status = 'approved' where athlete_id = '${K}';`)
await expectDenied('a coach cannot approve anyone', C, `select public.decide_coach('${K}', true);`)
await expectCount('the admin sees every request', ADM, `select 1 from public.coach_requests`, 1)
await expectOk('the admin declines', ADM, `select public.decide_coach('${K}', false);`)
;(await count(`select 1 from public.profiles where id = '${K}' and 'coach' = any (roles)`)) === 0 ? ok('a declined athlete stays an athlete') : bad('decide_coach', 'declined but became coach')
await expectOk('they may ask again', K, `select public.request_coach('Second try');`)
await expectCount('…and the request is pending again', K, `select 1 from public.coach_requests where status = 'pending' and note = 'Second try'`, 1)
await expectOk('the admin approves', ADM, `select public.decide_coach('${K}', true);`)
;(await count(`select 1 from public.profiles where id = '${K}' and 'coach' = any (roles)`)) === 1 ? ok('an approved athlete is a coach') : bad('decide_coach', 'approved but no coach role')
await expectOk('…and can now open a course', K, `insert into public.courses (coach_id, title, start_date) values ('${K}', 'Mine', '2026-12-07');`)
await expectOk('…and save their profile with the role in it', K, `update public.profiles set bio = 'Coach now', roles = '{athlete,coach}' where id = '${K}';`)
await expectDenied('only an admin revokes', C, `select public.revoke_coach('${K}');`)
await expectOk('the admin revokes coaching', ADM, `select public.revoke_coach('${K}');`)
;(await count(`select 1 from public.profiles where id = '${K}' and 'coach' = any (roles)`)) === 0 && (await count(`select 1 from public.courses where coach_id = '${K}'`)) === 1 ? ok('the role goes; their course stays') : bad('revoke_coach', 'role or course wrong')

// ── Structured courses and station mode (0008) ───────────────────────────
console.log('\nStructured courses and station mode')
const course8 = '10000000-0000-0000-0000-000000000008'
const wk8 = '20000000-0000-0000-0000-000000000008'
await db.exec(`update public.profiles set roles = '{athlete,coach}' where id = '${C}';`)
await expectOk('a coach saves an assessment week and a focused training week', C, `
  insert into public.courses (id, coach_id, title, status, start_date) values ('${course8}', '${C}', 'USC', 'active', '2026-11-23');
  insert into public.course_weeks (id, course_id, position, title, kind) values (gen_random_uuid(), '${course8}', 0, 'Initial assessment', 'baseline');
  insert into public.course_weeks (id, course_id, position, title, focus) values ('${wk8}', '${course8}', 1, 'Pulling', 'pull');`)
await expectDenied('a week cannot be of an unknown kind', C, `insert into public.course_weeks (course_id, position, title, kind) values ('${course8}', 2, 'x', 'holiday');`)
await expectDenied('…or focus on something that is not a discipline', C, `insert into public.course_weeks (course_id, position, title, focus) values ('${course8}', 2, 'x', 'cardio');`)
;(await count(`select 1 from public.course_weeks where course_id = '${course}' and kind = 'training' and focus is null`)) >= 1 ? ok('weeks saved before this update read as training weeks with no focus') : bad('course_weeks', 'defaults missing')
const cs8 = '30000000-0000-0000-0000-000000000008'
await expectOk('an exercise is marked as part of the week’s focus', C, `insert into public.course_sessions (id, week_id, day, title) values ('${cs8}', '${wk8}', 0, 'A'); insert into public.course_blocks (session_id, position, kind, exercise_id, sets, target, is_primary) values ('${cs8}', 0, 'strength', 'scap-pull', 3, 8, true);`)
await expectOk('a coach opens a station-based assessment in three groups', C, `insert into public.assessment_sessions (owner_id, protocol, stations, mode, groups, invite_token) values ('${C}', 'baseline-2', '{pull,push,core}', 'stations', 3, 'tok-808');`)
await expectDenied('…but not in an unknown mode', C, `insert into public.assessment_sessions (owner_id, protocol, stations, mode) values ('${C}', 'baseline-2', '{pull}', 'freestyle');`)
await as(K, 'authenticated', () => db.exec(`select public.join_assessment('tok-808');`))
await expectOk('the coach moves a participant to another group', C, `update public.assessment_participants set group_no = 2 where athlete_id = '${K}' and session_id = (select id from public.assessment_sessions where invite_token = 'tok-808');`)
;(await count(`select 1 from public.assessment_participants where athlete_id = '${K}' and group_no = 2`)) === 1 ? ok('…and the move is kept') : bad('group_no', 'not saved')

// ── Demonstrations, workout videos and settings (0009) ───────────────────
console.log('\nDemonstrations, workout videos and settings')
const d1 = '40000000-0000-0000-0000-000000000001'
const d2 = '40000000-0000-0000-0000-000000000002'
const w1 = '50000000-0000-0000-0000-000000000001'
const recipe = `'{"character":"male","motion":"pushup","camera":"side","theme":null}'`
const addDemo = (id: string, version: number, extra = '') => `insert into public.demo_assets (id, exercise_id, kind, slot, version, status, recipe${extra ? ', replaces' : ''}) values ('${id}', 'pushup', 'animation', 'male', ${version}, 'pending', ${recipe}${extra});`
const published = () => count(`select 1 from public.demo_assets where id = '${d1}' and status = 'published'`)
await expectOk('an admin adds a generated animation, pending review', ADM, addDemo(d1, 1))
await expectCount('an athlete does not see it before it is published', A, `select 1 from public.demo_assets`, 0)
await expectCount('…nor a coach', C, `select 1 from public.demo_assets`, 0)
await expectCount('…nor someone signed out', null, `select 1 from public.demo_assets`, 0, 'anon')
await expectCount('the admin sees every version', ADM, `select 1 from public.demo_assets`, 1)
await expectDenied('an athlete cannot add a demonstration', A, addDemo(d2, 2))
await expectDenied('a coach cannot either', C, addDemo(d2, 2))
await expectDenied('nor can someone signed out', null, addDemo(d2, 2), 'anon')
await expectDenied('a status outside the review workflow is refused', ADM, `update public.demo_assets set status = 'live' where id = '${d1}';`)
await expectOk('the admin approves and publishes it', ADM, `update public.demo_assets set status = 'approved', reviewed_at = now() where id = '${d1}'; update public.demo_assets set status = 'published', published_at = now() where id = '${d1}';`)
await expectCount('now an athlete sees it', A, `select 1 from public.demo_assets where status = 'published'`, 1)
await expectCount('…and someone signed out', null, `select 1 from public.demo_assets where status = 'published'`, 1, 'anon')
// A write the rules do not allow changes no rows rather than raising an error.
await as(A, 'authenticated', () => db.exec(`update public.demo_assets set status = 'archived' where id = '${d1}'; delete from public.demo_assets where id = '${d1}';`))
;(await published()) === 1 ? ok('an athlete cannot change or remove it') : bad('demo_assets', 'an athlete changed a published demonstration')
await as(C, 'authenticated', () => db.exec(`update public.demo_assets set status = 'archived' where id = '${d1}'; delete from public.demo_assets where id = '${d1}';`))
;(await published()) === 1 ? ok('a coach cannot change or remove it') : bad('demo_assets', 'a coach changed a published demonstration')
await expectOk('the admin adds a corrected version', ADM, addDemo(d2, 2, `, '${d1}'`))
await expectDenied('a version number is used once per slot', ADM, addDemo('40000000-0000-0000-0000-000000000003', 2))
await expectDenied('a second published version in the same slot is refused', ADM, `update public.demo_assets set status = 'published' where id = '${d2}';`)
await expectOk('…until the first one steps aside', ADM, `update public.demo_assets set status = 'archived' where id = '${d1}'; update public.demo_assets set status = 'published' where id = '${d2}';`)
await expectCount('athletes then see only the new version', A, `select 1 from public.demo_assets where exercise_id = 'pushup'`, 1)
await expectOk('the other character and a filmed video have slots of their own', ADM, `
  insert into public.demo_assets (exercise_id, kind, slot, version, status, recipe) values ('pushup', 'animation', 'female', 1, 'published', '{"character":"female","motion":"pushup","camera":"side","theme":null}');
  insert into public.demo_assets (exercise_id, kind, slot, version, status, recipe) values ('pushup', 'video', 'instructor', 1, 'published', '{"source":"link","url":"https://example.com/pushup.mp4"}');`)
await expectCount('…all shown together', A, `select 1 from public.demo_assets where exercise_id = 'pushup'`, 3)
await expectOk('the admin removes an archived version', ADM, `delete from public.demo_assets where id = '${d1}';`)
;(await count(`select 1 from public.demo_assets where id = '${d2}' and replaces is null`)) === 1 ? ok('the version that replaced it stays') : bad('demo_assets', 'removing a version took its successor with it')

await expectOk('an admin drafts a workout video', ADM, `insert into public.workout_videos (id, title, focus, level, minutes, equipment, exercise_ids, video, chapters) values ('${w1}', 'Beginner push', 'push', 'beginner', 20, '{floor}', '{pushup,knee-pushup}', '{"source":"link","url":"https://example.com/w.mp4"}', '[{"at":0,"label":"Warm-up","kind":"intro"}]');`)
await expectCount('a draft is not shown to athletes', A, `select 1 from public.workout_videos`, 0)
await expectDenied('a coach cannot add a workout video', C, `insert into public.workout_videos (title, status) values ('Mine', 'published');`)
await expectDenied('a workout is about a discipline or the whole body', ADM, `update public.workout_videos set focus = 'cardio' where id = '${w1}';`)
await expectOk('the admin publishes it', ADM, `update public.workout_videos set status = 'published', published_at = now() where id = '${w1}';`)
await expectCount('then athletes see it', A, `select 1 from public.workout_videos`, 1)
await expectCount('…and so does someone signed out', null, `select 1 from public.workout_videos`, 1, 'anon')
await as(A, 'authenticated', () => db.exec(`update public.workout_videos set title = 'Hacked' where id = '${w1}'; delete from public.workout_videos where id = '${w1}';`))
;(await count(`select 1 from public.workout_videos where id = '${w1}' and title = 'Beginner push'`)) === 1 ? ok('an athlete cannot change or remove it') : bad('workout_videos', 'an athlete changed a workout video')

const setTheme = (theme: string) => `insert into public.app_settings (key, value) values ('aura', '{"defaultTheme":"${theme}","themes":{}}') on conflict (key) do update set value = excluded.value, updated_at = now();`
await expectOk('the admin chooses the default Aura theme', ADM, setTheme('solar'))
await expectOk('…and changes it', ADM, setTheme('cosmic'))
await expectCount('everyone reads the settings', A, `select 1 from public.app_settings where value ->> 'defaultTheme' = 'cosmic'`, 1)
await expectCount('…signed out too', null, `select 1 from public.app_settings`, 1, 'anon')
await expectDenied('an athlete cannot change them', A, setTheme('primal'))
await expectDenied('nor a coach', C, setTheme('primal'))
await as(C, 'authenticated', () => db.exec(`update public.app_settings set value = '{"defaultTheme":"primal"}'; delete from public.app_settings;`))
;(await count(`select 1 from public.app_settings where value ->> 'defaultTheme' = 'cosmic'`)) === 1 ? ok('…by any route') : bad('app_settings', 'a coach changed the settings')

// ── Starting over (0010) ─────────────────────────────────────────────────
console.log('\nStarting over')
const S1 = '00000000-0000-0000-0000-0000000000f1'
const S2 = '00000000-0000-0000-0000-0000000000f2'
await db.exec(`insert into auth.users (id) values ('${S1}'), ('${S2}');`)
await db.exec(`update public.profiles set handle = 'starter', roles = '{athlete,coach}' where id = '${S1}'; update public.profiles set handle = 'bystander' where id = '${S2}';`)
const mine = (who: string) => `
  insert into public.evidence (athlete_id, exercise_id, value, tier, source) values ('${who}', 'pushup', 12, 'self', 'manual');
  insert into public.athlete_goals (athlete_id, skill_id) select '${who}', id from public.skills limit 1;
  insert into public.workout_logs (id, athlete_id, title, source_type, started_at) values (gen_random_uuid(), '${who}', 'Practice', 'library', now());`
await expectOk('an athlete has results, a goal and a workout', S1, mine(S1))
await expectOk('…and so does someone else', S2, mine(S2))
// A result the athlete could not delete themselves: verified by a coach.
await db.exec(`insert into public.evidence (athlete_id, exercise_id, value, tier, source, verified_by, verified_at) values ('${S1}', 'pull-up', 5, 'coach', 'manual', '${C}', now());`)
await expectDenied('someone signed out cannot start anything over', null, `select public.start_over();`, 'anon')
await expectOk('the athlete starts over', S1, `select public.start_over();`)
const left = async (who: string) => (await count(`select 1 from public.evidence where athlete_id = '${who}'`)) + (await count(`select 1 from public.athlete_goals where athlete_id = '${who}'`)) + (await count(`select 1 from public.workout_logs where athlete_id = '${who}'`))
;(await left(S1)) === 0 ? ok('their results (verified ones too), goals and workouts are gone') : bad('start_over', `${await left(S1)} rows of theirs remain`)
;(await left(S2)) === 3 ? ok('nobody else is touched') : bad('start_over', `the other athlete has ${await left(S2)} rows, expected 3`)
const after = await one<{ handle: string | null; roles: string }>(`select handle, roles::text from public.profiles where id = '${S1}'`)
after.handle === null && after.roles === '{athlete,coach}' ? ok('the account stays, with its roles, and is asked the welcome questions again') : bad('start_over', JSON.stringify(after))

// ── Personal style and what is shared (0011) ─────────────────────────────
console.log('\nPersonal style')
const P1 = '00000000-0000-0000-0000-0000000000a1'
const P2 = '00000000-0000-0000-0000-0000000000a2'
const P3 = '00000000-0000-0000-0000-0000000000a3'
await db.exec(`insert into auth.users (id) values ('${P1}'), ('${P2}'), ('${P3}');`)
await expectOk('an athlete chooses a theme, a character and a form', P1, `insert into public.athlete_identity (athlete_id, theme, persona, form_power, intensity, interests, country, themed_at) values ('${P1}', 'power', 'female', 'awakened', 80, '{handstand,pull}', 'Portugal', now());`)
await expectDenied('a theme that does not exist is refused', P1, `update public.athlete_identity set theme = 'neon' where athlete_id = '${P1}';`)
await expectDenied('…and an intensity out of range', P1, `update public.athlete_identity set intensity = 140 where athlete_id = '${P1}';`)
await as(P2, 'authenticated', () => db.exec(`update public.athlete_identity set theme = 'iron' where athlete_id = '${P1}';`))
;(await count(`select 1 from public.athlete_identity where athlete_id = '${P1}' and theme = 'power'`)) === 1 ? ok('nobody else can change it') : bad('athlete_identity', 'another athlete changed a theme')
await expectCount('their look is visible to others by default', P2, `select 1 from public.style_of('${P1}') where theme = 'power' and persona = 'female' and form_power = 'awakened'`, 1)
await expectOk('…until they keep it to themselves', P1, `update public.athlete_identity set style_audience = 'me', interests_audience = 'me' where athlete_id = '${P1}';`)
await expectCount('then nobody else sees the look', P2, `select 1 from public.style_of('${P1}')`, 0)
await expectCount('…nor the favourite disciplines, while the country follows the city', P2, `select 1 from public.about_of('${P1}') where interests = '{}' and country = 'Portugal'`, 1)
await expectCount('they still see their own', P1, `select 1 from public.style_of('${P1}')`, 1)

await expectOk('the athlete has results', P1, `insert into public.evidence (athlete_id, exercise_id, value, tier, source) values ('${P1}', 'pushup', 20, 'self', 'manual');`)
await expectCount('results are open to other athletes unless closed', P2, `select 1 from public.evidence where athlete_id = '${P1}'`, 1)
await expectOk('one switch closes them', P1, `update public.athlete_identity set ratings_audience = 'me' where athlete_id = '${P1}';`)
await expectCount('then nobody else reads them', P2, `select 1 from public.evidence where athlete_id = '${P1}'`, 0)
await expectOk('they open their ratings to the people they follow', P1, `update public.athlete_identity set ratings_audience = 'following' where athlete_id = '${P1}'; insert into public.follows (follower_id, followee_id) values ('${P1}', '${P2}');`)
await expectCount('someone they follow can now read them', P2, `select 1 from public.evidence where athlete_id = '${P1}'`, 1)
await expectCount('a stranger still cannot', P3, `select 1 from public.evidence where athlete_id = '${P1}'`, 0)
await expectOk('they open them to everyone', P1, `update public.athlete_identity set ratings_audience = 'everyone' where athlete_id = '${P1}';`)
await expectCount('then a stranger can', P3, `select 1 from public.evidence where athlete_id = '${P1}'`, 1)
await expectDenied('reading is all it opens: nobody else can add to them', P3, `insert into public.evidence (athlete_id, exercise_id, value, tier, source) values ('${P1}', 'pushup', 99, 'self', 'manual');`)
await expectOk('they hide their profile from discovery', P1, `update public.profiles set is_public = false where id = '${P1}';`)
await expectCount('a hidden profile shares no results, whatever the setting', P3, `select 1 from public.evidence where athlete_id = '${P1}'`, 0)
await expectCount('…and no look', P3, `select 1 from public.style_of('${P1}')`, 0)
await expectDenied('someone signed out reads none of this', null, `select * from public.style_of('${P1}');`, 'anon')

console.log(`\n${passed} passed, ${failed} failed`)
await db.close()
process.exit(failed ? 1 : 0)
