import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';

const site = process.env.PUBLIC_SITE_URL || 'https://lesfousdubus.sbs';

export default defineConfig({
  site,
  output: 'static',
  prefetch: true,
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
    pagefind()
  ]
});
