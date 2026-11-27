// Draws the browser and home-screen icons from public/favicon.svg.
// Chrome and Firefox read the SVG itself; Safari, an iPhone's home screen
// and search results need pictures, so this paints them:
//   favicon.ico (32 and 48), apple-touch-icon.png (180, square: iOS rounds it),
//   icon-192.png and icon-512.png (the web app manifest).
// Run after changing favicon.svg:  npm run icons
import { chromium } from 'playwright-core'
import { readFileSync, writeFileSync } from 'node:fs'

const svg = readFileSync('public/favicon.svg', 'utf8')
// The home screen rounds its own corners: give it the square.
const square = svg.replace(/ rx="14"/, '')

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 600, height: 600 } })

async function paint(source, size) {
  await page.setContent(
    `<html><body style="margin:0;background:transparent">` +
      source.replace('<svg ', `<svg width="${size}" height="${size}" style="display:block" `) +
      `</body></html>`,
  )
  return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } })
}

function ico(images) {
  // An .ico holding PNGs: a 6-byte header, a 16-byte entry each, then the pictures.
  const header = Buffer.alloc(6 + 16 * images.length)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = header.length
  images.forEach(({ size, png }, i) => {
    const at = 6 + 16 * i
    header.writeUInt8(size >= 256 ? 0 : size, at)
    header.writeUInt8(size >= 256 ? 0 : size, at + 1)
    header.writeUInt16LE(1, at + 4)
    header.writeUInt16LE(32, at + 6)
    header.writeUInt32LE(png.length, at + 8)
    header.writeUInt32LE(offset, at + 12)
    offset += png.length
  })
  return Buffer.concat([header, ...images.map((x) => x.png)])
}

const small = [32, 48]
const pngs = []
for (const size of small) pngs.push({ size, png: await paint(svg, size) })
writeFileSync('public/favicon.ico', ico(pngs))
writeFileSync('public/apple-touch-icon.png', await paint(square, 180))
writeFileSync('public/icon-192.png', await paint(svg, 192))
writeFileSync('public/icon-512.png', await paint(svg, 512))

await browser.close()
console.log('icons: favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png')
