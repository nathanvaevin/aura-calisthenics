// The pictures on the theme cards (public/themes/*.jpg), rendered from the live 3D characters.
// Needs the dev server: `npm run dev`, then `npm run posters` (all) or `npm run posters -- aura` (one universe).
// Each picture is what someone has when they choose the theme: the universe's poster form as it is worn (not its activation),
// in the theme's default place and first finish. For the Aura themes that is the Cosmic Aura on the silver character in Aura outside.
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE || 'http://localhost:5173/'
const OUT = process.env.OUT || 'public/themes'
const ONLY = process.argv.slice(2)
const POSTERS = [
  { file: 'aura', uni: 'aura', form: 'cosmic', scene: 'outside' },
  { file: 'power', uni: 'power', form: 'ignition', scene: 'ring' },
  { file: 'power-light', uni: 'power', variant: 'light', form: 'ignition', scene: 'ring-ink' },
  { file: 'iron', uni: 'iron', form: 'pressure', scene: 'pit' },
].filter((p) => !ONLY.length || ONLY.includes(p.file) || ONLY.includes(p.uni))

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 600, height: 810 } })
for (const p of POSTERS) for (const who of ['male', 'female']) {
  const q = new URLSearchParams({ uni: p.uni, theme: p.form, who, scene: p.scene, level: '0.5', margin: '1.02', az: '0', zoom: '0.92', at: '2.5' })
  if (p.variant) q.set('var', p.variant)
  await page.goto(`${BASE}scripts/stage.html?${q}`)
  await page.waitForFunction(() => window.__ready, null, { timeout: 30000 })
  await page.screenshot({ path: `${OUT}/${p.file}-${who}.jpg`, type: 'jpeg', quality: 86 })
  console.log(`${OUT}/${p.file}-${who}.jpg`)
}
await browser.close()
