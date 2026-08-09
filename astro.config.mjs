import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://oasisdentalcarehb.com',
  // Deployed to Cloudflare Pages. Every page is still prerendered to static
  // HTML — 'static' remains the default and only routes that opt out with
  // `export const prerender = false` run on demand. That is exactly one route:
  // src/pages/api/appointment.ts, the form handler.
  output: 'static',
  adapter: cloudflare({
    // No page uses the astro:assets Image pipeline -- every image is a plain
    // static <img>, so there is nothing for Astro to optimize either at build
    // or at runtime. 'compile' still wires up a runtime /_image fallback
    // endpoint that bundles `sharp` (a native Node addon) into the Worker;
    // Cloudflare's Worker bundler cannot load that native binary, and the
    // Pages build fails even though `astro build` succeeds locally.
    // 'passthrough' drops both the sharp build step and the runtime endpoint.
    imageService: 'passthrough',
  }),
  // Every internal link is written without a trailing slash (href="/services"),
  // so canonical tags and the sitemap are pinned to that same form. Leave
  // build.format at its 'directory' default — switching it to 'file' makes
  // Astro.url.pathname resolve to '/services.html' during prerender, which
  // ends up in the canonical tag.
  trailingSlash: 'never',
  // NOTE: security.checkOrigin is deliberately not relied on here. Astro only
  // activates it when settings.buildOutput resolves to 'server', which does not
  // hold with output: 'static' — a cross-origin POST to /api/appointment was
  // verified to pass straight through. The route does the origin check itself.
  integrations: [sitemap()],
});
