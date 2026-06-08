// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Tailwind v4 se carga vía PostCSS (postcss.config.mjs) por compatibilidad
// con el rolldown-vite que usa Astro 6.
// https://astro.build/config
export default defineConfig({
  site: 'https://linamarcelaperez.pages.dev',
  integrations: [sitemap()],
});
