import { lazy, Suspense, type ComponentProps } from 'react'
import { cx } from '@/lib/format'

const LazyDemo = lazy(() => import('@/visual/Demo'))

/**
 * The 3D stage, fetched the first time one is shown. Safe to use on any
 * screen: the engine and the characters stay out of the first load.
 */
export function Stage3D(props: ComponentProps<typeof LazyDemo>) {
  return (
    <Suspense fallback={<div className={cx('w-full rounded-card border border-line bg-(--stage)', props.className)} style={{ aspectRatio: String(props.ratio ?? 1) }} />}>
      <LazyDemo {...props} />
    </Suspense>
  )
}
