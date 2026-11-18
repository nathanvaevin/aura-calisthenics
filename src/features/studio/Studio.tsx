import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router'
import { useIsAdmin } from '@/data/hooks'
import { useStore } from '@/data/store'
import { useContent } from '@/data/cloud/content'
import { PageHeader, Segmented } from '@/ui/primitives'
import { Characters } from './Characters'
import { Muscles } from './Muscles'
import { Exercises, waitingCount } from './Exercises'
import { Videos } from './Videos'

type Tab = 'exercises' | 'characters' | 'muscles' | 'videos'
const TABS: Tab[] = ['exercises', 'characters', 'muscles', 'videos']
/** Addresses saved before the tabs were renamed still open the right one. */
const tabOf = (v: string | null): Tab => (v === 'review' ? 'exercises' : TABS.includes(v as Tab) ? (v as Tab) : 'exercises')

/** Where the visual content is made, compared and approved. Admins only. */
export default function Studio() {
  const admin = useIsAdmin()
  const demo = useStore((s) => s.demo)
  const account = useStore((s) => s.cloudUid)
  const waitingFor = useStore((s) => waitingCount(s.demos))
  const waiting = useStore((s) => s.contentDirty.length)
  const content = useContent()
  const [params, setParams] = useSearchParams()
  const [tab, setTabState] = useState<Tab>(tabOf(params.get('tab')))
  const setTab = (t: Tab) => { setTabState(t); setParams({ tab: t }, { replace: true }) }
  if (!admin) return <Navigate to="/" replace />

  // Where what is decided here ends up: said plainly, because it differs.
  const where = demo ? 'This is the sample world. What you approve or change here stays on this device and reaches nobody.'
    : !account ? 'You are not signed in. What you approve or change here stays on this device.'
    : content.status === 'unavailable' ? 'Aura’s database does not have the tables for this yet (database step 0009). Until it is run, what you publish here stays on this device and does not reach athletes.'
    : content.error ? `The server refused the last change: ${content.error}`
    : content.status === 'offline' ? 'No connection to Aura’s database right now. Changes are kept on this device and sent when it is back.'
    : waiting ? 'Saving to Aura…' : 'Changes are saved to Aura for everyone.'

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Studio" sub="Every exercise and its demonstration, the characters, how muscles show, and your videos. Nothing here reaches athletes until you approve and send it." />
      <p className="mb-5 rounded-2xl border border-line px-4 py-3 text-[12.5px] leading-relaxed text-ink-2">{where}</p>
      <div className="no-scrollbar -mx-5 mb-6 overflow-x-auto px-5 lg:mx-0 lg:px-0">
        <Segmented<Tab> value={tab} onChange={setTab} options={[
          { value: 'exercises', label: <span className="whitespace-nowrap">{waitingFor ? `Exercises · ${waitingFor}` : 'Exercises'}</span> },
          { value: 'characters', label: 'Characters' }, { value: 'muscles', label: 'Muscles' }, { value: 'videos', label: 'Videos' },
        ]} />
      </div>
      {tab === 'exercises' && <Exercises />}
      {tab === 'characters' && <Characters />}
      {tab === 'muscles' && <Muscles />}
      {tab === 'videos' && <Videos />}
    </div>
  )
}
