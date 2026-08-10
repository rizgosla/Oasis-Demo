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
  // NOTE: security.checkOrigin is NOT relied on here, even though it is in
  // fact active. Adding one on-demand route (src/pages/api/appointment.ts,
  // prerender = false) flips settings.buildOutput to 'server' for the whole
  // build, which turns Astro's built-in check on by default — confirmed via
  // the built manifest ("checkOrigin":true). It runs ahead of our handler and
  // rejects a bad Origin with a bare, unstyled 403 of its own. The route below
  // still does its own explicit origin check so that path produces the same
  // friendly /contact?error= redirect instead of depending on Astro's default
  // response, which cannot be customized from user code.
  integrations: [sitemap()],
});
