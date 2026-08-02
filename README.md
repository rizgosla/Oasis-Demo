# Oasis Dental Care — Website

Marketing website for **Oasis Dental Care**, a warm, family-run dental practice in Huntington Beach, California. Led by Dr. Jason Fu, who has cared for Orange County families for over 25 years.

Built with [Astro](https://astro.build) as a fully static site, deployed to
Apache hosting (SiteGround). The appointment form is handled by a small PHP
script — see [Deployment](#deployment--siteground).

---

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `src/pages/index.astro` | Homepage — hero, service deck, Dr. Fu, reviews, location, book CTA |
| `/services` | `src/pages/services.astro` | 12-service catalog grid + detail modal |
| `/services/<slug>` | `src/pages/services/[slug].astro` | One indexable page per service, generated from `src/data/services.js` |
| `/practice` | `src/pages/practice.astro` | Mission, team, core values |
| `/new-patients` | `src/pages/new-patients.astro` | What to expect, FAQ, patient forms |
| `/contact` | `src/pages/contact.astro` | Appointment request form + office info |
| `/404` | `src/pages/404.astro` | Not-found page |
| `/api/appointment` | `public/appointment.php` | Form handler — `.htaccess` rewrites this path to the PHP script |

## Project Structure

```
/
├── public/                   # copied verbatim into dist/
│   ├── .htaccess             # WordPress 301s, trailing slash, form rewrite, 404
│   ├── appointment.php       # Appointment form handler
│   ├── logo.png              # also used as the .phero watermark in global.css
│   └── dr-jason-fu.jpg
├── src/
│   ├── components/           # StatusBar, Header, Footer, SchemaLocalBusiness, Invisalign*
│   ├── data/
│   │   └── services.js       # Single source of truth for all 12 services
│   ├── layouts/
│   │   └── Layout.astro      # HTML shell — meta, canonical, Open Graph, schema slot
│   ├── pages/
│   └── styles/
│       └── global.css        # Full design system (tokens, components, layout)
├── astro.config.mjs
└── package.json
```

### Services are data-driven

All twelve services live in `src/data/services.js`. That one array feeds the
card grid, the modal, the twelve detail pages, the header dropdown, the footer
list, and the `availableService` block in the LocalBusiness schema. **Add or
edit a service there and every surface updates**, including the sitemap.

---

## Local Development

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:4321`.

To preview the production build locally:

```bash
npm run build
npm run preview
```

---

## Deployment — SiteGround

The build is **fully static**. There is no server runtime, no adapter and no
Node process on the host.

```bash
npm run build          # outputs dist/
```

Upload the **contents** of `dist/` to `public_html`. That's the whole deploy.
`.htaccess` and `appointment.php` are included in the output automatically
(anything in `public/` is copied verbatim).

Requires PHP 8+ — SiteGround's default.

### What `.htaccess` does

`public/.htaccess` is the single source of truth for URL handling:

1. **301s** for all 30 old WordPress URLs (see below)
2. **Trailing-slash removal**, so the served URL matches the canonical tag.
   Astro is configured `trailingSlash: 'never'`; without `DirectorySlash Off`
   Apache would 301 `/contact` to `/contact/` and every canonical would point
   at a redirect.
3. **Directory indexes** — serves `/services/veneers/index.html` for
   `/services/veneers`
4. **Rewrites** `/api/appointment` to `appointment.php`, so the form's action
   attribute needs no host-specific value
5. `ErrorDocument 404 /404.html`

### WordPress migration

The 301 map covers every URL from the old site's `wp-sitemap.xml` — 22 pages and
8 posts. The 12 old service pages map 1:1 onto the new `/services/<slug>` routes.
Blog posts point at the closest topical service page rather than all at
`/services`, since a redirect to an unrelated page is treated as a soft 404.

**Do not blanket-redirect `/wp-content/*`** — third parties hotlink those assets
and redirecting them manufactures soft 404s. Let them 404.

> Search visibility is gated by `SITE_INDEXABLE` in `src/config/seo.js`. It is
> `false` while the WordPress site is still live — two indexable copies of the
> same practice would compete. Flip it to `true` at cutover; it drives both the
> robots meta tag and `robots.txt`.

---

## Design System

All design tokens and component styles live in `src/styles/global.css`.

**Colors**
- `--teal` `#0b8174` — primary brand
- `--dark` `#08221f` — dark sections, header sections
- `--bg` `#f8fbfa` — page background
- `--panel` `#ffffff` — card surfaces

**Fonts** (loaded from Google Fonts)
- Display / headings: **Space Grotesk**
- Body: **Hanken Grotesk**

**Key components**: `.btn`, `.tag`, `.cell` (bento), `.scell` (service card), `.scard` (sidebar card), `.ctacard`, `.phero`, `.sbar`, `.site-head`, `.site-foot`

---

## Contact Form

The form on `/contact` POSTs to `/api/appointment`, which `.htaccess` rewrites to
`public/appointment.php`. That script validates the input, sends the request with
PHP's built-in `mail()`, and redirects back to `/contact?sent=1`. The page reports
the outcome client-side in the existing note box.

**No API key, no third-party account, no manual DNS.** It works as soon as the
file is uploaded.

Protections: a hidden `company` honeypot field (bots fill it, humans never see
it — those submissions are silently discarded), a same-origin check, server-side
validation, and CRLF stripping so submitted values cannot inject mail headers.

### Optional environment variables

| Variable | Default | Notes |
|---|---|---|
| `APPOINTMENT_TO` | `oasisdentalcarehb@yahoo.com` | Where requests are delivered. |
| `APPOINTMENT_FROM` | `website@<host>` | Must be **on this domain** or SPF fails. The patient's address goes in `Reply-To`, so replying still reaches them. |

Set via Site Tools → Devs → Environment Variables, or `SetEnv` in `.htaccess`
(Apache never serves that file).

### ⚠️ Deliverability — test this before launch

Mail sent by `mail()` from a shared-hosting IP is frequently spam-filed, and the
destination is a **Yahoo** address. Yahoo has enforced sender authentication
strictly since February 2024.

Two things make it far more reliable, both done in SiteGround rather than in code:

1. **Host email for `oasisdentalcarehb.com` at SiteGround.** SPF and DKIM are
   then configured automatically.
2. **Set `APPOINTMENT_FROM`** to a real mailbox on that domain.

`mail()` reports only that the message was handed to the local mail server — not
that it arrived. **Send a test request and check the spam folder.** If delivery
proves unreliable, switching to an API sender (Resend/Postmark) is a
self-contained change to `appointment.php`.

### Known limitation

With JavaScript disabled the submission still works and the email is delivered,
but the confirmation message does not render — the visitor sees the default note
text. Fixing it means adding a separate thank-you page.

---

## Practice Info

| | |
|---|---|
| **Address** | 6552 Bolsa Ave, Suite J, Huntington Beach, CA 92647 |
| **Phone** | (714) 893-2106 |
| **Email** | oasisdentalcarehb@yahoo.com |
| **Hours** | Mon–Thu 9 AM–5 PM · Fri 9 AM–4 PM · Sat by appt |
