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

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
  css: { postcss: { plugins: [pxToRem] } },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5173, host: true },
})
