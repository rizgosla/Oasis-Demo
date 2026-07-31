import { SITE_INDEXABLE } from '../config/seo.js';

export const prerender = true;

export function GET({ site }) {
  const body = SITE_INDEXABLE
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`
    : `User-agent: *\nDisallow: /\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
