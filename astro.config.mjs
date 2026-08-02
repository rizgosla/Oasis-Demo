import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://oasisdentalcarehb.com',
  // Fully static: every page is prerendered and the appointment form is handled
  // by public/appointment.php on the Apache host. No server runtime is needed,
  // so dist/ is a plain folder of HTML that uploads anywhere.
  output: 'static',
  // Every internal link is written without a trailing slash (href="/services"),
  // so canonical tags and the sitemap are pinned to that same form. Leave
  // build.format at its 'directory' default — switching it to 'file' makes
  // Astro.url.pathname resolve to '/services.html' during prerender, which
  // ends up in the canonical tag.
  trailingSlash: 'never',
  integrations: [sitemap()],
});
