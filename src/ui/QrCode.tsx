import { useMemo } from 'react'
import qrcode from 'qrcode-generator'

/**
 * A QR code drawn as one SVG path. Always dark on white with a quiet zone,
 * whatever the theme, because that is what phone cameras read most reliably.
 */
export function QrCode({ value, size = 240, className }: { value: string; size?: number; className?: string }) {
  const { path, count } = useMemo(() => {
    const qr = qrcode(0, 'M')
    qr.addData(value)
    qr.make()
    const n = qr.getModuleCount()
    let d = ''
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`
    return { path: d, count: n }
  }, [value])
  const quiet = 3
  return (
    <svg
      viewBox={`${-quiet} ${-quiet} ${count + quiet * 2} ${count + quiet * 2}`}
      width={size} height={size} className={className} style={{ maxWidth: '100%', height: 'auto', borderRadius: 18, background: '#fff' }}
      shapeRendering="crispEdges" role="img" aria-label="QR code"
    >
      <path d={path} fill="#0b0c0e" />
    </svg>
  )
}
