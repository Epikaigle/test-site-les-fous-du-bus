import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://test-site-les-fous-du-bus.epikaigle444.workers.dev',
  output: 'static',
  prefetch: true,
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
    pagefind()
  ]
});
