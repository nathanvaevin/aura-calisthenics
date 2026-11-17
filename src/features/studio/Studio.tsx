import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router'
import { useIsAdmin } from '@/data/hooks'
import { useStore } from '@/data/store'
import { useContent } from '@/data/cloud/content'
import { reviewQueue } from '@/domain/media'
import { PageHeader, Segmented } from '@/ui/primitives'
import { AuraLab } from './AuraLab'
import { Characters } from './Characters'
import { Muscles } from './Muscles'
import { Review } from './Review'
import { Videos } from './Videos'

type Tab = 'characters' | 'muscles' | 'aura' | 'review' | 'videos'
const TABS: Tab[] = ['characters', 'muscles', 'aura', 'review', 'videos']

/** Where the visual content is made, compared and approved. Admins only. */
export default function Studio() {
  const admin = useIsAdmin()
  const demo = useStore((s) => s.demo)
  const account = useStore((s) => s.cloudUid)
  const pending = useStore((s) => reviewQueue(s.demos).pending)
  const waiting = useStore((s) => s.contentDirty.length)
  const content = useContent()
  const [params, setParams] = useSearchParams()
  const [tab, setTabState] = useState<Tab>(TABS.includes(params.get('tab') as Tab) ? (params.get('tab') as Tab) : 'characters')
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
      <PageHeader eyebrow="Admin" title="Studio" sub="The two characters, how their muscles and Aura show, the animations waiting for your review, and your videos." />
      <p className="mb-5 rounded-2xl border border-line px-4 py-3 text-[12.5px] leading-relaxed text-ink-2">{where}</p>
      <div className="no-scrollbar -mx-5 mb-6 overflow-x-auto px-5 lg:mx-0 lg:px-0">
        <Segmented<Tab> value={tab} onChange={setTab} options={[
          { value: 'characters', label: 'Characters' }, { value: 'muscles', label: 'Muscles' }, { value: 'aura', label: 'Aura' },
          { value: 'review', label: <span className="whitespace-nowrap">{pending ? `Review · ${pending}` : 'Review'}</span> }, { value: 'videos', label: 'Videos' },
        ]} />
      </div>
      {tab === 'characters' && <Characters />}
      {tab === 'muscles' && <Muscles />}
      {tab === 'aura' && <AuraLab />}
      {tab === 'review' && <Review />}
      {tab === 'videos' && <Videos />}
    </div>
  )
}
