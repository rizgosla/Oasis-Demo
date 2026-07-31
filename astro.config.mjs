import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://oasisdentalcarehb.com',
  output: 'server',
  adapter: cloudflare(),
  // Every internal link is written without a trailing slash (href="/services"),
  // so canonical tags and the sitemap are pinned to that same form. Leave
  // build.format at its 'directory' default — switching it to 'file' makes
  // Astro.url.pathname resolve to '/services.html' during prerender, which
  // ends up in the canonical tag.
  trailingSlash: 'never',
  integrations: [sitemap()],
});
