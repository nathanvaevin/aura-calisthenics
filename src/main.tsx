// First, and alone: what a device had at the old address is put in place before anything that reads the browser's
// storage is loaded at all. (A plain import would not do: shared code is bundled apart and runs before this file.)
import './data/moveIn'
import '@fontsource-variable/geist/wght.css'
import '@fontsource-variable/geist-mono/wght.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
// The display faces of the other themes. Only the rules are loaded here; a browser fetches a face when a page uses it.
import '@fontsource/barlow-condensed/latin-700-italic.css'
import '@fontsource/barlow-condensed/latin-800-italic.css'
import '@fontsource/anton/latin-400.css'
import './styles/index.css'

void import('./boot')
