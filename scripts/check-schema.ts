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

// The parts of Supabase the migration relies on.
const PRELUDE = `
  create role anon nologin;
  create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), raw_user_meta_data jsonb default '{}');
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  grant usage on schema auth to anon, authenticated;
`

const db = new PGlite()
let passed = 0
let failed = 0

const ok = (label: string) => { passed++; console.log(`  ✓ ${label}`) }
const bad = (label: string, why: string) => { failed++; console.log(`  ✗ ${label}\n      ${why}`) }

async function as<T>(user: string | null, role: 'authenticated' | 'anon', fn: () => Promise<T>): Promise<T> {
  await db.exec(`select set_config('request.jwt.claim.sub', '${user ?? ''}', false); set role ${role};`)
  try {
    return await fn()
  } finally {
    await db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false);`)
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

console.log('Applying schema')
await db.exec(PRELUDE)
for (const file of ['0001_core.sql', '0003_evidence_observed.sql', '0004_assessments.sql', '0005_places.sql']) {
  await db.exec(read(`../supabase/migrations/${file}`))
  ok(`${file} applies cleanly`)
}
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

console.log(`\n${passed} passed, ${failed} failed`)
await db.close()
process.exit(failed ? 1 : 0)
