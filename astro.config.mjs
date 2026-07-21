// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Le site est statique par défaut : il est servi depuis dist/ (Cloudflare Workers
// Static Assets). Aucune route serveur en V1.
export default defineConfig({
  site: 'https://lesfousdubus.sbs',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
