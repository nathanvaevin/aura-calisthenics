import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, Globe, Lock, Users } from 'lucide-react'
import type { Athlete, Audience, DisciplineId, Place } from '@/domain/types'
import { DISCIPLINE_IDS, disciplineById } from '@/domain/catalog'
import { AUDIENCES, compatibility, isLive, relationOf, visitVisible, type Compatibility, type Relation } from '@/domain/places'
import { allRatings } from '@/domain/scoring/mastery'
import { computeAura } from '@/domain/scoring/aura'
import { useStore } from '@/data/store'
import { useClock } from '@/data/hooks'
import { Eyebrow } from '@/ui/primitives'
import { cx } from '@/lib/format'

export const timeOf = (iso: string) => new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

export const minutesLeft = (iso: string, now: number) => Math.max(0, Math.round((new Date(iso).getTime() - now) / 60000))

const AUDIENCE_ICON = { me: Lock, following: Users, everyone: Globe }

export function AudienceTag({ audience, className }: { audience: Audience; className?: string }) {
  const Icon = AUDIENCE_ICON[audience]
  return (
    <span className={cx('inline-flex items-center gap-1 font-mono text-[9.5px] tracking-[0.08em] text-ink-3 uppercase', className)} title={`Visible to: ${AUDIENCES[audience].short}`}>
      <Icon size={10} strokeWidth={2.2} />
      {AUDIENCES[audience].short}
    </span>
  )
}

export function AudiencePicker({ value, onChange }: { value: Audience; onChange: (a: Audience) => void }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {(Object.keys(AUDIENCES) as Audience[]).map((a) => {
        const Icon = AUDIENCE_ICON[a]
        return (
          <button
            key={a} onClick={() => onChange(a)} aria-pressed={value === a}
            className={cx('pressable flex h-[58px] flex-col items-center justify-center gap-1 rounded-2xl border px-1 text-center text-[12px] leading-tight', value === a ? 'border-ink bg-ink text-bg' : 'border-line text-ink-2 hover:bg-surface-2')}
          >
            <Icon size={14} />
            {AUDIENCES[a].label}
          </button>
        )
      })}
    </div>
  )
}

/** How this device's athlete stands to everyone else, and who follows whom. */
export function useViewer() {
  const meId = useStore((s) => s.meId)
  const following = useStore((s) => s.following)
  const follows = useStore((s) => s.follows)
  return useMemo(() => {
    const followedBy = (ownerId: string): readonly string[] => (ownerId === meId ? following : (follows[ownerId] ?? []))
    return { id: meId, followedBy, relationTo: (owner: Athlete): Relation => relationOf(owner.id, meId, followedBy(owner.id)) }
  }, [meId, following, follows])
}

/** Stays running right now that this viewer may see, per place. */
export function useLiveByPlace(now: number) {
  const visits = useStore((s) => s.visits)
  const athletes = useStore((s) => s.athletes)
  const viewer = useViewer()
  // Recomputed each minute: a stay stops counting the moment it runs out.
  const minute = Math.floor(now / 60000)
  return useMemo(() => {
    const out = new Map<string, string[]>()
    for (const v of visits) {
      const owner = athletes[v.athleteId]
      if (!owner || !isLive(v, now) || !visitVisible(v, owner, viewer.relationTo(owner), now)) continue
      out.set(v.placeId, [...(out.get(v.placeId) ?? []), v.athleteId])
    }
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visits, athletes, viewer, minute])
}

/** Aura and ratings for a handful of athletes at once. */
export function useAuras(ids: string[]) {
  const evidence = useStore((s) => s.evidence)
  const key = ids.join(',')
  return useMemo(() => {
    const out: Record<string, { aura: ReturnType<typeof computeAura>; values: Record<DisciplineId, number> }> = {}
    for (const id of ids) {
      const ratings = allRatings(evidence.filter((e) => e.athleteId === id))
      out[id] = { aura: computeAura(ratings), values: Object.fromEntries(DISCIPLINE_IDS.map((d) => [d, ratings[d].rating])) as Record<DisciplineId, number> }
    }
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, evidence])
}

/** One sentence on how two athletes might train together. Descriptive, never a score. */
export function compatibilityLine(mine: { values: Record<DisciplineId, number>; aura: number }, theirs: { values: Record<DisciplineId, number>; aura: number }, first: string) {
  if (!mine.aura || !theirs.aura) return null
  const c: Compatibility = compatibility(mine.values, mine.aura, theirs.values, theirs.aura)
  const parts: string[] = [c.level === 'similar' ? 'Similar level to you' : c.level === 'ahead' ? 'Further along than you' : 'Earlier on than you']
  if (c.shared.length) parts.push(`you both lean on ${c.shared.map((d) => disciplineById[d].short.toLowerCase()).join(' and ')}`)
  if (c.theyLead) parts.push(`${first} is stronger in ${disciplineById[c.theyLead].short.toLowerCase()}`)
  if (c.youLead) parts.push(`you are stronger in ${disciplineById[c.youLead].short.toLowerCase()}`)
  return `${parts.join(' · ')}.`
}

export const placeSub = (p: Place) => [p.address, p.hours === '24/7' ? 'Open 24/7' : p.hours].filter(Boolean).join(' · ')

/** People this athlete can see training somewhere right now. Nothing when there is nobody. */
export function TrainingNow() {
  const navigate = useNavigate()
  const now = useClock(30000)
  const meId = useStore((s) => s.meId)
  const athletes = useStore((s) => s.athletes)
  const places = useStore((s) => s.places)
  const live = useLiveByPlace(now)
  const rows = [...live.entries()].flatMap(([placeId, ids]) => ids.filter((id) => id !== meId && places[placeId]).map((id) => ({ placeId, id })))
  if (!rows.length) return null
  const first = rows[0]
  const names = rows.map((r) => athletes[r.id]?.name.split(' ')[0]).filter(Boolean)
  return (
    <button className="pressable card flex w-full items-center gap-4 p-4 text-left hover:bg-surface-2" onClick={() => navigate(rows.length === 1 ? `/places?place=${encodeURIComponent(first.placeId)}` : '/places')}>
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-2">
        <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-accent" />
      </span>
      <span className="min-w-0 flex-1">
        <Eyebrow>Training now · sample athletes</Eyebrow>
        <span className="mt-1 block truncate text-[15.5px] font-medium">
          {rows.length === 1 ? `${names[0]} is at ${places[first.placeId].name}` : `${names.slice(0, 2).join(' and ')}${rows.length > 2 ? ` and ${rows.length - 2} more` : ''} are out training`}
        </span>
      </span>
      <ArrowRight size={16} className="shrink-0 text-ink-3" />
    </button>
  )
}
