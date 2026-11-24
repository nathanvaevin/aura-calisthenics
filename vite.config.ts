import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

/**
 * Sizes are written in pixels throughout the app and shipped in rem, so that
 * the whole interface (text, buttons, spacing) follows one number: the root
 * font size. "Larger text" in the settings raises it; so does a browser set
 * to larger text. Hairlines under 2px stay as they are, and so does anything
 * inside a media query.
 */
const pxToRem = {
  postcssPlugin: 'aura-px-to-rem',
  Declaration(decl: { value: string }) {
    if (!decl.value.includes('px') || decl.value.includes('url(')) return
    decl.value = decl.value.replace(/(?<![\w.#-])(-?)(\d*\.?\d+)px\b/g, (all, sign: string, n: string) => {
      const v = Number(n)
      return v < 2 ? all : `${sign}${+(v / 16).toFixed(5)}rem`
    })
  },
}

/**
 * The app itself (src/boot.tsx) is imported by main.tsx only after the luggage
 * from the old address is in place (src/data/moveIn.ts). It is fetched at the
 * same time all the same: preloading brings a file in without running it.
 */
const preloadApp = {
  name: 'aura-preload-app',
  transformIndexHtml: {
    order: 'post' as const,
    handler(_html: string, ctx: { bundle?: Record<string, { type: string; fileName: string; imports?: string[]; facadeModuleId?: string | null }> }) {
      const chunks = Object.values(ctx.bundle ?? {}).filter((c) => c.type === 'chunk')
      const app = chunks.find((c) => c.facadeModuleId?.endsWith('/src/boot.tsx'))
      const need = new Set<string>()
      const add = (f: string) => { if (need.has(f)) return; need.add(f); chunks.find((c) => c.fileName === f)?.imports?.forEach(add) }
      if (app) add(app.fileName)
      return [...need].map((f) => ({ tag: 'link', attrs: { rel: 'modulepreload', crossorigin: true, href: `${process.env.VITE_BASE || '/'}${f}` }, injectTo: 'head' as const }))
    },
  },
}

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss(), preloadApp],
  css: { postcss: { plugins: [pxToRem] } },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5173, host: true },
})
