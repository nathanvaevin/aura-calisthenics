// The pictures on the theme cards (public/themes/*.jpg), rendered from the live 3D characters.
// Needs the dev server: `npm run dev`, then `npm run posters` (all) or `npm run posters -- aura` (one universe).
// Each poster is the universe's poster form, in its activation (its sign behind it), three-quarter view.
// Only the Aura pictures have been rendered this way so far (2026-11-19); the others are still the earlier ones.
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE || 'http://localhost:5173/'
const OUT = process.env.OUT || 'public/themes'
const ONLY = process.argv.slice(2)
/** Which form each picture shows, and when in the burst it is taken (seconds after Activate). */
const POSTERS = [
  { file: 'aura', uni: 'aura', form: 'electric', at: 0.62, level: 0.6, margin: 1.22, zoom: 1 },
  { file: 'power', uni: 'power', form: 'ignition', at: 1.3 },
  { file: 'power-light', uni: 'power', variant: 'light', form: 'ignition', at: 1.3 },
  { file: 'iron', uni: 'iron', form: 'pressure', at: 1.3 },
].filter((p) => !ONLY.length || ONLY.includes(p.file) || ONLY.includes(p.uni))

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 600, height: 810 } })
for (const p of POSTERS) for (const who of ['male', 'female']) {
  const q = new URLSearchParams({ uni: p.uni, theme: p.form, who, level: String(p.level ?? 0.7), margin: String(p.margin ?? 1.1), az: '24', zoom: String(p.zoom ?? 0.7), at: '2.5' })
  if (p.variant) q.set('var', p.variant)
  await page.goto(`${BASE}scripts/stage.html?${q}`)
  await page.waitForFunction(() => window.__ready, null, { timeout: 30000 })
  // `at` is counted from the burst itself, so the same moment is caught every time.
  await page.evaluate(() => window.__player.release())
  await page.waitForTimeout(p.at * 1000)
  await page.screenshot({ path: `${OUT}/${p.file}-${who}.jpg`, type: 'jpeg', quality: 86 })
  console.log(`${OUT}/${p.file}-${who}.jpg`)
}
await browser.close()
