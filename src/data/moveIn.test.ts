import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { MOVED_KEY, MOVING_KEYS, OLD_ORIGIN, takeMove } from './moveIn'

const page = readFileSync('forward/index.html', 'utf8')
const script = page.match(/<script>([\s\S]*?)<\/script>/)![1]
const OLD = `${OLD_ORIGIN}/`

const box = (items: Record<string, string> = {}) => {
  const m = new Map(Object.entries(items))
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), all: () => Object.fromEntries(m) }
}

/** Opens the page left at the old address with a browser's storage, and answers where it sends the person. */
function openOld(stored: Record<string, string> | 'blocked', url = `${OLD}aura-calisthenics/`): URL {
  const at = new URL(url)
  let to = ''
  const location = { pathname: at.pathname, search: at.search, hash: at.hash, replace: (u: string) => { to = u } }
  const localStorage = stored === 'blocked' ? { getItem: () => { throw new Error('blocked') } } : box(stored)
  new Function('window', 'TextEncoder', 'btoa', script)({ location, localStorage }, TextEncoder, btoa)
  return new URL(to)
}

const auth = JSON.stringify({ access_token: 'a', refresh_token: 'r', user: { id: 'u1' } })
const state = (over: object = {}) => JSON.stringify({ version: 4, state: { meId: 'u1', cloudUid: 'u1', demo: false, athletes: { u1: { name: 'Zoë 力' } }, demos: [{ id: 'd' }], workoutVideos: [], contentDirty: [], settings: { size: 'large' }, ...over } })
const guest = { 'aura:auth': auth, 'aura:v1': state(), 'aura:cloud-user': '{"id":"u1","guest":true}' }

describe('moving from the old address to aurathletics.nl', () => {
  it('the page at the old address and the app agree on what comes along', () => {
    const keys = JSON.parse(script.match(/var KEYS = (\[.*?\])/)![1].replace(/'/g, '"')) as string[]
    expect(keys).toEqual(MOVING_KEYS)
    expect(page).toContain('<meta name="referrer" content="strict-origin" />')
  })

  it('a guest keeps their sign-in, their profile and what was only on the device', () => {
    const to = openOld(guest)
    expect(to.origin + to.pathname).toBe('https://aurathletics.nl/')
    const here = box()
    expect(takeMove(to.hash, OLD, here)).toEqual({ hash: '', took: true })
    expect(here.getItem('aura:auth')).toBe(auth)
    expect(here.getItem('aura:cloud-user')).toBe(guest['aura:cloud-user'])
    const s = JSON.parse(here.getItem('aura:v1')!)
    expect(s.version).toBe(4)
    expect(s.state).toMatchObject({ meId: 'u1', athletes: { u1: { name: 'Zoë 力' } }, settings: { size: 'large' } })
    // Fetched again anyway, so it does not travel.
    expect(s.state.demos).toEqual([])
  })

  it('an administrator keeps content changes the server has not got yet', () => {
    const here = box()
    takeMove(openOld({ ...guest, 'aura:v1': state({ contentDirty: ['demo:d'] }) }).hash, OLD, here)
    expect(JSON.parse(here.getItem('aura:v1')!).state.demos).toEqual([{ id: 'd' }])
  })

  it('a profile without an account comes along; the sample world and an untouched device do not', () => {
    const here = box()
    expect(takeMove(openOld({ 'aura:v1': state({ cloudUid: null }) }).hash, OLD, here)?.took).toBe(true)
    expect(JSON.parse(here.getItem('aura:v1')!).state.meId).toBe('u1')
    expect(openOld({ 'aura:v1': state({ demo: true, cloudUid: null }) }).hash).toBe('')
    expect(openOld({ 'aura:v1': state({ meId: null, cloudUid: null }) }).hash).toBe('')
    expect(openOld({}).hash).toBe('')
    expect(openOld('blocked').href).toBe('https://aurathletics.nl/')
  })

  it('old links keep working: the page, the query and an invitation go on as they were', () => {
    expect(openOld({}, `${OLD}aura-calisthenics/assess/123?c=a,b`).href).toBe('https://aurathletics.nl/assess/123?c=a,b')
    expect(openOld({}, `${OLD}aura-calisthenics`).href).toBe('https://aurathletics.nl/')
    expect(openOld({}, `${OLD}aura-calisthenics/#j=tok_en-1`).href).toBe('https://aurathletics.nl/#j=tok_en-1')
    const to = openOld(guest, `${OLD}aura-calisthenics/#j=tok_en-1`)
    expect(takeMove(to.hash, OLD, box())).toEqual({ hash: '#j=tok_en-1', took: true })
  })

  it('is taken in once, and never over anything that is already there', () => {
    const { hash } = openOld(guest)
    const here = box()
    takeMove(hash, OLD, here)
    const after = here.all()
    expect(takeMove(openOld({ ...guest, 'aura:auth': auth.replace('"r"', '"other"') }).hash, OLD, here)?.took).toBe(false)
    expect(here.all()).toEqual(after)
    expect(takeMove(hash, OLD, box({ 'aura:auth': auth }))?.took).toBe(false)
    expect(takeMove(hash, OLD, box({ 'aura:v1': state({ meId: 'someone' }) }))?.took).toBe(false)
    // Signed out here afterwards: an old link does not sign them in again.
    expect(takeMove(hash, OLD, box({ [MOVED_KEY]: 'x' }))?.took).toBe(false)
    // Having only looked at the welcome, or at the sample world, is not having anything.
    expect(takeMove(hash, OLD, box({ 'aura:v1': state({ meId: null }) }))?.took).toBe(true)
    expect(takeMove(hash, OLD, box({ 'aura:v1': state({ demo: true }) }))?.took).toBe(true)
  })

  it('nobody can be signed in to somebody else’s profile with a link', () => {
    const { hash } = openOld(guest)
    for (const from of ['', 'https://evil.example/', 'https://nathanvaevin.github.io.evil.example/', 'http://nathanvaevin.github.io/', 'not a url']) {
      const here = box()
      expect(takeMove(hash, from, here), from).toEqual({ hash: '', took: false })
      expect(here.all()).toEqual({})
    }
    // Nor by sending it round the old address, which only hands on what is stored there.
    expect(openOld({}, `${OLD}aura-calisthenics/${hash}`).hash).toBe('')
    const mine = box()
    takeMove(openOld({ ...guest, 'aura:auth': auth.replace('"r"', '"mine"') }, `${OLD}aura-calisthenics/${hash}`).hash, OLD, mine)
    expect(mine.getItem('aura:auth')).toContain('"mine"')
  })

  it('only its own keys, and nothing that cannot be read', () => {
    const pack = (v: unknown) => '#move=' + Buffer.from(JSON.stringify(v)).toString('base64url')
    const here = box()
    takeMove(pack({ v: 1, items: { 'aura:auth': auth, 'evil': 'x', 'aura:moved': 'y' } }), OLD, here)
    expect(here.getItem('evil')).toBeNull()
    for (const bad of ['#move=', '#move=%%%', '#move=AAAA', pack(null), pack({ v: 2, items: guest }), pack({ v: 1 }), pack({ v: 1, items: { 'aura:v1': '{oops' } }), pack({ v: 1, items: { 'aura:auth': '"text"', 'aura:v1': state() } }), pack({ v: 1, items: { 'aura:auth': '{}' } })]) {
      const b = box()
      expect(takeMove(bad, OLD, b)?.took, bad.slice(0, 40)).toBe(false)
      expect(b.all()).toEqual({})
    }
    expect(takeMove(pack({ v: 1, hash: '#move=x', items: {} }), OLD, box())?.hash).toBe('')
    expect(takeMove('#j=token', OLD, box())).toBeNull()
    expect(takeMove('', OLD, box())).toBeNull()
  })

  it('too much for an address: the safety copy stays behind first, then everything but the sign-in', () => {
    const big = 'x'.repeat(1_300_000)
    const a = box()
    expect(takeMove(openOld({ ...guest, 'aura:before-sign-in': big }).hash, OLD, a)?.took).toBe(true)
    expect(a.getItem('aura:v1')).not.toBeNull()
    expect(a.getItem('aura:before-sign-in')).toBeNull()
    const b = box()
    expect(takeMove(openOld({ ...guest, 'aura:v1': state({ notes: big }) }).hash, OLD, b)?.took).toBe(true)
    expect(Object.keys(b.all()).sort()).toEqual(['aura:auth', 'aura:moved'])
    expect(openOld({ 'aura:v1': state({ cloudUid: null, notes: big }) }).hash).toBe('')
  })
})
