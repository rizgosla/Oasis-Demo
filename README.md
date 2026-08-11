# Oasis Dental Care — Website

Marketing website for **Oasis Dental Care**, a warm, family-run dental practice in Huntington Beach, California. Led by Dr. Jason Fu, who has cared for Orange County families for over 25 years.

Built with [Astro](https://astro.build) and deployed to **Cloudflare Pages**.
Every page is prerendered to static HTML; the single exception is the
appointment form handler, which runs on demand — see
[Deployment](#deployment--cloudflare-pages).

---

# 🚀 LAUNCH CHECKLIST — do this once, in this order

**Status: not yet done.** Until steps 1–3 are complete the contact form does not
work — it returns `error=server` on every submission. Nothing in the code needs
changing; this is all account and DNS setup.

Do them **in this order** — steps 2 and 3 both assume Cloudflare is already
running your DNS.

You will need: the **SiteGround account** (for the DNS zone + nameservers), a
**Cloudflare account**, and a **Resend account** (free tier is fine).

- [ ] **1. Move nameservers to Cloudflare** ([details](#step-1--move-nameservers-to-cloudflare))
- [ ] **2. Verify the domain in Resend** ([details](#step-2--verify-the-domain-in-resend))
- [ ] **3. Set `RESEND_API_KEY` in Cloudflare Pages** ([details](#step-3--set-resend_api_key-in-cloudflare-pages))
- [ ] **4. Send a real test submission and check the spam folder** ([details](#step-4--test-it-for-real))
- [ ] **5. Spot-check two old WordPress URLs redirect correctly** ([details](#step-5--spot-check-the-301s))

---

## Step 1 — Move nameservers to Cloudflare

Nameservers decide *who answers DNS questions* for your domain. Right now that is
SiteGround. Pointing them at Cloudflare hands that job over — and **any record
that does not come across simply stops existing.**

That is the risk here. Cloudflare auto-imports your records when you add the
domain, but the import is not guaranteed complete, and missing mail records fail
**silently** — nothing errors, mail just stops landing.

> The domain can stay **registered** at SiteGround. It does not need
> transferring. You are only changing which nameservers it points at.

1. **SiteGround → Site Tools → Domain → DNS Zone Editor.** Screenshot or export
   the entire zone. This is your reference for the next steps.
2. **Cloudflare → Add a site** → enter `oasisdentalcarehb.com`. It scans and
   imports what it can find.
3. **Compare the imported records against your screenshot, one by one.** Add
   anything missing. Pay particular attention to:
   - `MX` records
   - any `TXT` record starting with `v=spf1`
   - the `_dmarc` record
   - anything with `_domainkey` in the name (DKIM)
4. Cloudflare gives you **two nameservers**. Back in
   **SiteGround → Domain → Nameservers**, replace the existing ones with those.
5. Wait for Cloudflare to show the domain as **Active** — usually minutes, up to
   a few hours.

### ⚠️ The grey cloud

In Cloudflare's DNS list every `A` and `CNAME` record has an orange/grey cloud
toggle. **Orange = proxied through Cloudflare, which only works for web traffic
(HTTP/HTTPS).** If a mail hostname such as `mail.oasisdentalcarehb.com` is set to
orange, **email breaks.** Set any mail-related hostname to **grey (DNS only)**.

`MX` and `TXT` records cannot be proxied, so those are fine either way.

Since the practice's contact address is `@yahoo.com`, inbound mail to the domain
may not matter much — but if anyone uses an `@oasisdentalcarehb.com` mailbox,
the `MX` records are critical.

---

## Step 2 — Verify the domain in Resend

**This is not optional and not just a spam-folder issue.** The form sends *from*
`website@oasisdentalcarehb.com`. Resend refuses to send from a domain you have
not proven you own — it rejects the API call outright. Without this,
**every submission fails with `error=server`.**

1. Sign up at [resend.com](https://resend.com) → **Domains → Add Domain** →
   enter `oasisdentalcarehb.com`.
2. Resend shows a handful of DNS records — typically a `TXT` for SPF, a `TXT`
   for DKIM, sometimes an `MX` for bounce handling.
3. **Cloudflare → DNS → Records → Add record.** Copy each one across exactly.
   If any of them is a `CNAME`, set it to **grey cloud**.
4. Back in Resend, click **Verify**. Can take a few minutes to propagate.

SPF and DKIM are what tell Yahoo "Resend is allowed to send as this domain."
Yahoo has enforced this strictly since February 2024, so this is the difference
between the inbox and the spam folder.

> **Want to smoke-test before DNS is ready?** Every Resend account can send from
> `onboarding@resend.dev` without any verification, but it only delivers to your
> own account email. Temporarily set `APPOINTMENT_FROM=onboarding@resend.dev` and
> `APPOINTMENT_TO=<your own address>` to confirm the plumbing works, then switch
> both back to the real values.

---

## Step 3 — Set `RESEND_API_KEY` in Cloudflare Pages

The handler reads this key to authenticate with Resend. It is a secret, so it
cannot live in the repo — it has to be set on the host. No key means
`error=server` on every submission.

1. **Resend → API Keys → Create API Key.** Copy it immediately — it starts with
   `re_` and is shown **only once**.
2. **Cloudflare → Workers & Pages → [this project] → Settings → Environment
   variables.**
3. **Add variable:** name `RESEND_API_KEY`, paste the value, set the type to
   **Secret** (encrypts it and hides it from the dashboard afterwards).
4. Add it to **Production**. Add it to **Preview** too if you want preview
   deploys to work.
5. **Redeploy.** ← Easy to miss. Environment variables do **not** apply
   retroactively to an existing deployment; the current build will not see the
   key until you deploy again.

`APPOINTMENT_TO` and `APPOINTMENT_FROM` can be set here too, but both have
working defaults — only set them to override
`oasisdentalcarehb@yahoo.com` and `website@oasisdentalcarehb.com`.

---

## Step 4 — Test it for real

Submit the form at `/contact` with a real address and confirm:

- the page shows the "Thanks — your request is in" confirmation
- the email arrives at `oasisdentalcarehb@yahoo.com` — **check the spam folder**
- hitting Reply in that email addresses the patient, not the website
- a confirmation email also arrives at the address you submitted, letting the
  patient know the request went through; this send is best-effort and won't
  fail the submission if it doesn't go out

A successful send is not proof of inbox placement, which is why the spam-folder
check matters. If it fails, Cloudflare logs the exact Resend error: **Workers &
Pages → [project] → Logs**, look for lines starting `appointment:`.

---

## Step 5 — Spot-check the 301s

All 30 old WordPress URLs are mapped in `public/_redirects`. The source paths are
written without trailing slashes and Cloudflare Pages normalises them, but the
old URLs were all published **with** a trailing slash — so confirm two live ones
actually land, for example:

```
/our-practice-dentristy-oasis-dental-care/   ->  /practice
/services-dentristy-oasis-dental-care/services-veneers-dentristy-oasis-dental-care/  ->  /services/veneers
```

If they 404 instead of redirecting, add trailing-slash variants of each source
line to `public/_redirects`.

> Search visibility is already on — `SITE_INDEXABLE` in `src/config/seo.js` is
> `true`. If this build goes live while the old WordPress site is still up, set
> it to `false` until cutover; two indexable copies compete with each other.

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
| `/api/appointment` | `src/pages/api/appointment.ts` | Form handler — the only on-demand route; everything else is prerendered |

## Project Structure

```
/
├── public/                   # copied verbatim into dist/
│   ├── _redirects            # the 30 WordPress 301s, read by Cloudflare Pages
│   ├── logo.png              # also used as the .phero watermark in global.css
│   └── dr-jason-fu.jpg
├── src/
│   ├── components/           # StatusBar, Header, Footer, SchemaLocalBusiness, Invisalign*
│   ├── data/
│   │   └── services.js       # Single source of truth for all 12 services
│   ├── layouts/
│   │   └── Layout.astro      # HTML shell — meta, canonical, Open Graph, schema slot
│   ├── pages/
│   │   └── api/
│   │       └── appointment.ts  # Form handler (prerender = false)
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

## Deployment — Cloudflare Pages

```bash
npm run build          # outputs dist/
npm run deploy         # build + wrangler pages deploy dist
```

Or connect the repo in the Cloudflare dashboard with build command
`npm run build` and output directory `dist`.

One-time account and DNS setup — nameservers, Resend verification and
`RESEND_API_KEY` — is the [Launch Checklist](#-launch-checklist--do-this-once-in-this-order)
at the top of this file. The form does not work until those are done.

The domain can stay registered at SiteGround; apex domains on Pages need
Cloudflare DNS anyway, for CNAME flattening.

### URL handling

`public/_redirects` holds the **30 WordPress 301s**. It replaced the old
`public/.htaccess`, which Cloudflare Pages does not read.

Three things the `.htaccess` did are native to Pages and need no config:
trailing-slash normalisation (the site is `trailingSlash: 'never'`), directory
indexes (`/services/veneers` → `/services/veneers/index.html`), and the custom
404, served from `dist/404.html` automatically.

`dist/_routes.json` is generated at build time and confirms the split: only
`/api/*` reaches the Worker, so every page and every redirect is served from
the edge.

### WordPress migration

The 301 map in `public/_redirects` covers every URL from the old site's
`wp-sitemap.xml` — 22 pages and 8 posts. The 12 old service pages map 1:1 onto
the new `/services/<slug>` routes.
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

The form on `/contact` POSTs to `/api/appointment`
(`src/pages/api/appointment.ts`). It validates the input, sends through
**Resend**'s HTTP API, and redirects 303 back to `/contact?sent=1`. The page
reports the outcome client-side in the existing note box.

Two emails go out on a successful submission: the request itself to the
practice (`APPOINTMENT_TO`), and a best-effort confirmation back to the
patient's own address letting them know the request was received. The
confirmation send never fails the submission — if it errors, the error is
logged but the patient still sees the success page, since their request is
already safely in the practice's inbox.

It calls the Resend REST endpoint with `fetch` rather than using the SDK: the
SDK pulls in Node builtins and would require the `nodejs_compat` flag on the
Worker, while a plain fetch has no such requirement and no dependency to track.

Protections: a hidden `company` honeypot field (bots fill it, humans never see
it — those submissions are silently accepted and discarded), an explicit
same-origin check, server-side validation, and CRLF stripping on header-bound
values.

> **The origin check is done by hand, on purpose.** Astro's
> `security.checkOrigin` only activates when `buildOutput` resolves to
> `'server'`, which does not hold under `output: 'static'` — a cross-origin POST
> was verified to pass straight through it. Do not remove the manual check in
> favour of the config flag without re-testing.

### Environment variables

Set in Cloudflare Pages → Settings → Environment variables. Copy
`.env.example` to `.env` for local dev.

| Variable | Required | Default | Notes |
|---|---|---|---|
| `RESEND_API_KEY` | **yes** | — | From resend.com. Mark as a secret. Without it the form returns `error=server`. |
| `APPOINTMENT_TO` | no | `oasisdentalcarehb@yahoo.com` | Where requests are delivered. |
| `APPOINTMENT_FROM` | no | `website@<host>` | Must be on the domain verified with Resend. The patient's address goes in `reply_to`, so replying still reaches them. |

### ⚠️ Deliverability

The destination is a **Yahoo** address, and Yahoo has enforced sender
authentication strictly since February 2024. Domain verification and the SPF/DKIM
records that make mail land are
[Step 2 of the Launch Checklist](#step-2--verify-the-domain-in-resend).

Unlike PHP's `mail()`, Resend returns a real send result, so a failure is a
genuine failure rather than a silent drop — the status and Resend's error body
are logged (**Cloudflare → Workers & Pages → [project] → Logs**, lines beginning
`appointment:`) and the visitor is redirected to `?error=server`. A successful
send still is not proof of inbox placement, so the spam-folder check in
[Step 4](#step-4--test-it-for-real) matters.

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
