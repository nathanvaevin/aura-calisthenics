import { useState } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'
import type { Course } from '@/domain/types'
import { useOnServer } from '@/data/cloud'
import { useStore } from '@/data/store'
import { SyncLine } from '@/features/account/Account'
import { copyText, courseUrl, isLocalOnly } from '@/features/assess/links'
import { QrCode } from '@/ui/QrCode'

/**
 * A course's link: copy it, send it, and whoever opens it ends up in the
 * course, with an account they have or one they make there. A draft has to be
 * made active first, because the server lets nobody join a draft.
 */
export function CourseInvite({ course, code }: { course: Course; /** Show the code to scan as well. */ code?: boolean }) {
  const coach = useStore((s) => (s.meId ? s.athletes[s.meId] : null))
  const cloud = useStore((s) => !!s.cloudUid)
  const mutateCourse = useStore((s) => s.mutateCourse)
  const onServer = useOnServer('courses', course.id)
  const [copied, setCopied] = useState(false)
  if (!coach) return null
  const url = courseUrl({ courseId: course.id, title: course.title, coachName: coach.name })
  const ready = !cloud || onServer
  const copy = async () => { setCopied(await copyText(url)); window.setTimeout(() => setCopied(false), 2000) }
  const canShare = typeof navigator.share === 'function'

  if (course.status !== 'active')
    return (
      <div className="card p-4" data-course-invite>
        <p className="text-[13.5px] leading-relaxed text-ink-2">{course.status === 'draft' ? 'The course is a draft. Make it active and it has a link to send.' : 'The course is archived. Make it active to invite students again.'}</p>
        <button className="btn btn-primary mt-3 w-full" onClick={() => mutateCourse(course.id, (c) => { c.status = 'active' })}>Make it active</button>
      </div>
    )
  return (
    <div className="card p-4" data-course-invite>
      <div className="flex gap-2.5">
        <button className="btn btn-primary flex-1" disabled={!ready} data-copy-course={url} onClick={() => void copy()}>{copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy invite link</>}</button>
        {canShare && <button className="btn btn-outline" disabled={!ready} aria-label="Share the link" onClick={() => void navigator.share({ title: course.title, text: `Join ${course.title} on Aura`, url }).catch(() => undefined)}><Share2 size={16} /></button>}
      </div>
      <p className="mt-2.5 text-[12.5px] leading-snug text-ink-2">Anyone who opens it joins this course. Without an account they make one first.</p>
      {!ready && <SyncLine className="mt-2" />}
      {code && ready && <div className="mt-4 flex flex-col items-center"><QrCode value={url} size={200} /><span className="mt-2 text-[12px] text-ink-3">Or let them scan it.</span></div>}
      {isLocalOnly() && <p className="mt-2.5 text-[12px] leading-snug text-warn">You opened Aura at {window.location.host}, which only exists on this computer. Copy the link from aurathletics.nl.</p>}
    </div>
  )
}
