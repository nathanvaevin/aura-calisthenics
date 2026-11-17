# Backend setup — Supabase

This turns Aura from a one-device demo into an app real people can sign into. It is **outstanding action #1** in [../REGISTER.md](../REGISTER.md).

Most of it is prepared for you. Your part is three things only a person with the account can do: **create the project**, **turn on Google sign-in**, and **paste two keys into a file**. Everything else — the whole database and its access rules — is one paste, already verified to apply cleanly (`npm run db:check`, 149 checks).

**Already did steps 1–5 before 16 November 2026?** Go straight to **step 6**: one more paste and three switches.

Plan on about 20–30 minutes, most of it waiting for Google's consent screen. Do it once.

---

## 1 · Create the project

1. Go to **https://supabase.com**, sign in (GitHub login is easiest), and click **New project**.
2. Choose:
   - **Name:** Aura (anything).
   - **Database password:** generate a strong one and **save it in your password manager**. You rarely need it, but it cannot be recovered — only reset.
   - **Region:** the one closest to where your athletes are (e.g. *West EU (London)* or *Central EU (Frankfurt)* for Europe). This is where the data lives and affects speed.
   - Plan: the **Free** plan is enough to start.
3. Click **Create**. It takes a minute or two to provision. Wait for the dashboard to go green.

---

## 2 · Create the database (one paste)

On a **fresh** project:

1. In the left sidebar open **SQL Editor** → **New query**.
2. Open the file **`supabase/apply.sql`** in this repo, copy **all** of it, paste it into the editor.
3. Click **Run** (or ⌘/Ctrl + Enter).

You should see *Success. No rows returned*. That one file created every table, every access rule, and the exercise/skill catalog plus demo data.

> `apply.sql` is generated from the migration files and the seed (`npm run db:bundle`). Run it **once** on an empty project — re-running it on a project that already has the schema will error on the first `create type`, which is expected. To start over, delete the project and make a new one, or run the migrations individually with the CLI (see the end).

**Check it worked:** sidebar → **Table Editor**. You should see tables including `profiles`, `exercises`, `places`, `assessment_sessions`. The `exercises` table should have 116 rows.

---

## 3 · Turn on Google sign-in

Google sign-in needs a credential from Google, pasted into Supabase. You will copy one value **from** Supabase first, then two values **back** into it.

### 3a. Get your project's callback URL

In Supabase: **Authentication → Sign In / Providers → Google**. Expand it. Copy the **Callback URL (for OAuth)** shown there — it looks like:

```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

Leave this tab open.

### 3b. Create a Google OAuth client

1. Go to **https://console.cloud.google.com**, and create a project (or pick one).
2. **APIs & Services → OAuth consent screen**: choose **External**, and set the **App name** to **Aura Calisthenics** — this is the name users actually see ("Sign in to continue to Aura Calisthenics"), so make it the real brand. Add your email, and save. You can leave it in *Testing* mode while you set up; add your own Google account under **Test users** so you can sign in. (Publishing it is only needed once you open sign-up to everyone.)

   > **What users see vs. the callback URL.** The callback URL in step 3b point 3 (`https://<ref>.supabase.co/auth/v1/callback`) is a technical endpoint — keep it exactly as Google auto-fills it. It does **not** become the app name. Google's sign-in screen shows the **App name** above. The `*.supabase.co` string only appears as a split-second redirect and in small print ("Google will share your info with …"). To replace that with your own domain before a public launch, add Supabase's **Custom Domain** add-on (paid) so auth runs on `auth.yourdomain.com` — optional, and not needed to get sign-in working.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - **Application type:** **Web application** — this is correct even if the app is headed for iOS and Android. Supabase's Google sign-in always goes through Supabase's web callback, so from Google's side Supabase is the web client, on every platform. You keep this client when you ship native.
   - **Authorised redirect URIs → Add URI:** paste the **callback URL** from step 3a exactly.
   - Create. Copy the **Client ID** and **Client secret**.

   > **Going to the App Store / Play Store later.** Aura is a web app, so the natural route to both stores is **Capacitor**, which wraps this same codebase into native apps. It still uses this Web client; you only add your app's deep-link URL (e.g. `aura://`) to the Redirect URLs in step 3d. Separate **iOS**/**Android** OAuth clients are needed only if you later want the native "Sign in with Google" sheet instead of a browser — optional, and added alongside this one. Deciding the native path is a later action; it does not change anything here.

### 3c. Paste the credentials into Supabase

Back in the Supabase Google provider panel:

1. Toggle **Enable Sign in with Google** on.
2. Paste the **Client ID** and **Client secret**.
3. Save.

### 3d. Tell Supabase which app URLs may return after login

The app is already hosted on GitHub Pages at **https://nathanvaevin.github.io/aura-calisthenics/**, so use that.

**Authentication → URL Configuration:**

- **Site URL:** `https://nathanvaevin.github.io/aura-calisthenics/`
- **Redirect URLs → Add URL:** add both, each on its own line:
  - `https://nathanvaevin.github.io/aura-calisthenics/` (the live app)
  - `http://localhost:5173` (local development and testing)

The app sends people back to its own address after login, so that address must be listed here or Google will refuse the redirect.

### 3e. Turn on anonymous sign-ins (test-day accounts)

**Authentication → Sign In / Providers → Anonymous → enable.**

This lets students join an assessment by scanning your QR with **no account** — instant, zero friction. Their result lives in a real cloud account for the session; to keep it they sign up afterwards (same account, nothing lost), otherwise they screenshot their scores. The coach signs in with Google; students join anonymously.

Captcha (recommended by Supabase) only guards against bots inflating sign-ups. Not needed for a controlled test day; add it before promoting the app publicly.

---

## 4 · Point the app at the project

1. Two values from the dashboard:
   - **Project URL** — **Settings → Data API** (or it is `https://<project-ref>.supabase.co`).
   - The **Publishable key** — **Settings → API Keys**, the one starting `sb_publishable_…` (labelled "safe to share publicly"). On older projects this is instead the key labelled **anon / public** (`eyJhbGci…`). Either goes in the same variable. **Not** the `sb_secret_…` / `service_role` key — that must never touch the browser.
2. In this repo, copy `.env.example` to `.env.local` (or edit the one already there) and fill them in:

   ```
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_...   (the publishable key)
   ```

`.env.local` is gitignored and never committed.

**These two values are safe to share and safe to ship** — the anon key is meant to run in the browser; the database is protected by the access rules, not by hiding the key. **Never** share or commit the **database password**, the **service_role** key, or the Google **client secret**.

---

## 5 · Verify

```bash
npm run dev
```

- Open **Profile → Settings → Account**. It should now say *Not signed in* with a **Sign in with Google** button (in demo mode it says "Local mode" and shows no button).
- Click it, sign in with the Google account you added as a test user.
- You come back to the app signed in; the account row shows your email.
- In Supabase **Table Editor → `profiles`**, a row with your new user id has appeared (created automatically on first sign-in).

If you get that row, action #1 is done.

> **Verify locally, not on the public site yet.** The public site only knows about the project after `npm run deploy` (step 7).

---

## 6 · Going live: one more paste and three switches

Steps 1–5 gave you a project you can sign in to. These four finish it for a room full of people. About ten minutes.

### 6a. Paste the going-live update (only if you created the database before 16 November 2026)

SQL Editor → New query → paste **all of `supabase/migrations/0006_live.sql`** → Run. Once. *Success. No rows returned* is the right answer. (A project created from today's `apply.sql` already has it; running it twice errors harmlessly on the first line.)

It adds: reading an invitation before signing in (the scan-to-join screen needs it), joining an assessment also joins its course, an assessment's evidence is removed with it, a guest can move their results into an account they already have, and the coach's board gets pushed updates.

### 6b. Let a guest keep their profile

**Authentication → Sign In / Providers →** find **Allow manual linking** → on → Save.

This is what lets a student who joined as a guest tap *Keep it with Google* afterwards and keep the very same profile.

### 6c. Publish the Google consent screen

**Google Cloud console → APIs & Services → OAuth consent screen → Audience → Publish app → Confirm.**

While it says *Testing*, Google only lets in the accounts you listed as test users: your students would be refused. Publishing is immediate; Aura asks only for name and email, which needs no review by Google.

### 6d. Make room for a class on one Wi-Fi

**Authentication → Rate Limits.** Supabase counts sign-ins per network address, and a class on the gym Wi-Fi is one address.

- **Anonymous users** (default 30 per hour): set to **200**.
- **Sign-ups and sign-ins** (default 30 per 5 minutes): set to **100**.

Students on mobile data are not affected either way.

---

## 7 · Publish the app

```bash
npm run deploy
```

Runs the tests, builds the app for `https://nathanvaevin.github.io/aura-calisthenics/` with the two values from `.env.local` built in, and replaces the `gh-pages` branch that GitHub Pages serves. About a minute later the public address serves the new build. It stops if `.env.local` has no project, or holds a secret key.

Then open the public address and sign in with Google: you land on the welcome questions (or, if this browser already held a profile from before accounts, straight in your profile with that data moved into your account).

---

## 8 · Coaching by approval, and your account as owner

Paste **all of `supabase/migrations/0007_coach_access.sql`** into the SQL editor and run it once. From then on nobody can make themselves a coach: they ask (at sign-up, or in Profile → Settings → Coaching) and an admin approves.

Then make your own account the owner. **Sign in to the live app with your Google account first** (so the account exists), then run this in the SQL editor with your email filled in:

```sql
update public.profiles set roles = '{athlete,coach,admin}'
where id = (select id from auth.users where email = 'YOUR-EMAIL');
```

*Success. 1 row affected.* Reopen the app: Coach Studio appears, and Profile shows **Coach requests**, where you approve or decline people.

---

## 9 · Demonstrations, workout videos and theme settings

Paste **all of `supabase/migrations/0009_visual_content.sql`** into the SQL editor and run it once (only if you created the database before this update; a project made from today's `apply.sql` already has it). *Success. No rows returned.* It only adds three tables:

- `demo_assets` — every version of every animated or filmed demonstration of an exercise, with its review status and correction notes.
- `workout_videos` — complete follow-along workouts.
- `app_settings` — app-wide choices, such as the default Aura theme.

Anyone, signed in or not, reads what is **published**. Only an account with the `admin` role (step 8) sees the rest and can write. One exercise has at most one published version per character or video slot; the database refuses a second.

Until it is pasted the app works as before: nothing is published, and what an admin prepares stays on their device, waiting to be sent.

---

## Running a test day

1. **Before:** in Coach Studio create (or open) the course, then **Assess → new assessment** for that course. Open its **Invite** tab on a laptop or tablet.
2. **In the room:** *Show full screen*. Students point their phone camera at the code. Each chooses **Join with Google** or types a name and **Join as a guest**. They appear on your **Board** as they join, and are in the course from that moment.
3. **During:** students record on their own phones; results reach the board within seconds. Tap any cell to mark a station *observed* or *verified*, or to record for someone without a phone.
4. **After:** **Finalise**. Results become evidence on each student's profile at the tier you gave them, and the code stops letting people in.
5. **Guests:** their results screen offers *Keep this profile* (Google). If they would rather not, a screenshot is theirs to keep; the guest profile itself can only be opened from that browser.

If a phone loses its connection mid-test it keeps recording and sends when it is back; the overview shows whether everything is saved.

---

## What this did and did not set up

- **Set up and used by the app:** profiles, goals, evidence, sessions, courses and enrolments, feedback, follows and assessments, with every row-level access rule; Google and guest sign-in.
- **Set up, not used yet:** places and presence (they stay on each device for now), and the `demonstrations` storage bucket (nothing uploads to it).

## Troubleshooting

- **"redirect_uri_mismatch" from Google** — the callback URL in the Google client (step 3b) does not exactly match your project's callback URL (step 3a). They must be identical, including `https://` and no trailing slash.
- **Signs in, but bounces back to a blank page or the wrong place** — the app's address is not in Supabase's **Redirect URLs** (step 3d).
- **No "Sign in with Google" button** — `.env.local` is missing or the dev server was not restarted after creating it. Stop and re-run `npm run dev`.
- **A student gets "Access blocked" from Google** — the consent screen is still in Testing (step 6c).
- **"This invitation isn’t open" on a fresh code** — the going-live update has not been run (step 6a), or the assessment was finalised.
- **"Keeping a guest profile with Google is not switched on"** — step 6b.
- **Guests are refused after the first thirty or so** — step 6d.
- **Old guest accounts piling up** — Authentication → Users lists them as anonymous; delete any you like, or run `delete from auth.users where is_anonymous and created_at < now() - interval '30 days';` in the SQL editor.
- **`apply.sql` errored partway** — it was run on a project that already had some of the schema. Start from a fresh project, or use the CLI below.

## Alternative: the Supabase CLI

For a repeatable workflow (and for applying future migrations one at a time) instead of the one paste:

```bash
npx supabase link --project-ref <your-project-ref>   # asks for the DB password
npx supabase db push                                 # applies supabase/migrations in order
```

`db push` applies the migrations but **not** the seed. To load the catalog + demo data afterwards, paste `supabase/seed.sql` into the SQL editor and run it. The CLI tracks which migrations a project already has, which the paste method leaves to you.
