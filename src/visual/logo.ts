import { CanvasTexture, SRGBColorSpace, type Texture } from 'three'

let wordmark: Texture | null = null

/** The Aura wordmark as it is drawn in the app: the serif name and the dot. */
export function logoTexture(): Texture {
  if (wordmark) return wordmark
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 174
  const g = c.getContext('2d')!
  const draw = () => {
    g.clearRect(0, 0, c.width, c.height)
    g.font = `400 150px 'Instrument Serif', Georgia, serif`
    g.textBaseline = 'alphabetic'
    g.fillStyle = '#f4f2ec'
    const w = g.measureText('Aura').width
    const x = (c.width - w - 40) / 2
    g.fillText('Aura', x, 138)
    g.fillStyle = '#ecc77f'
    g.beginPath()
    g.arc(x + w + 22, 138 - 13, 13.5, 0, Math.PI * 2)
    g.fill()
  }
  draw()
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 4
  // The serif may still be on its way.
  void document.fonts?.load(`150px 'Instrument Serif'`).then(() => { draw(); tex.needsUpdate = true })
  wordmark = tex
  return tex
}
