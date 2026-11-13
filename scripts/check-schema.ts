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
await db.exec(read('../supabase/migrations/0001_core.sql'))
ok('0001_core.sql applies cleanly')
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

console.log(`\n${passed} passed, ${failed} failed`)
await db.close()
process.exit(failed ? 1 : 0)
