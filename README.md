# Oasis Dental Care — Website

Marketing website for **Oasis Dental Care**, a precision, technology-forward dental practice in Huntington Beach, California. Led by Dr. Jason Fu.

Built with [Astro](https://astro.build) and deployed as a static site to [Cloudflare Pages](https://pages.cloudflare.com).

---

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `src/pages/index.astro` | Homepage — hero, bento services, tech section, Dr. Fu, reviews, location, book CTA |
| `/services` | `src/pages/services.astro` | Full 13-service catalog grid |
| `/service` | `src/pages/service.astro` | Service detail template (Dental Implants example) |
| `/team` | `src/pages/team.astro` | Dr. Fu feature + staff grid |
| `/contact` | `src/pages/contact.astro` | Appointment request form + office info |

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── StatusBar.astro   # Top announcement bar
│   │   ├── Header.astro      # Sticky nav header
│   │   └── Footer.astro      # Site footer
│   ├── layouts/
│   │   └── Layout.astro      # Base HTML shell (imports global CSS, wraps all pages)
│   ├── pages/
│   │   ├── index.astro
│   │   ├── services.astro
│   │   ├── service.astro
│   │   ├── team.astro
│   │   └── contact.astro
│   └── styles/
│       └── global.css        # Full design system (tokens, components, layout)
├── astro.config.mjs
└── package.json
```

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

## Deploy to Cloudflare Pages

### First-time setup

1. Push this repository to GitHub (or GitLab).
2. In the [Cloudflare Pages dashboard](https://dash.cloudflare.com), click **Create application → Pages → Connect to Git**.
3. Select this repository, then set the build settings:

| Setting | Value |
|---|---|
| **Framework preset** | Astro |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Node version** | `20` (set in environment variables: `NODE_VERSION = 20`) |

4. Click **Save and Deploy**. Cloudflare builds and publishes the site automatically.

### Subsequent deploys

Every push to the `main` branch triggers a new build and deploy automatically.

---

## Design System

All design tokens and component styles live in `src/styles/global.css`.

**Colors**
- `--teal` `#0b8174` — primary brand
- `--dark` `#08221f` — dark sections, header sections
- `--bg` `#f3f6f5` — page background
- `--panel` `#ffffff` — card surfaces

**Fonts** (loaded from Google Fonts)
- Display / headings: **Space Grotesk**
- Body: **Hanken Grotesk**

**Key components**: `.btn`, `.tag`, `.cell` (bento), `.scell` (service card), `.scard` (sidebar card), `.ctacard`, `.phero`, `.sbar`, `.site-head`, `.site-foot`

---

## Contact Form

The form on `/contact` currently posts to `action="#"`. To receive submissions, replace `action="#"` with a form-handling endpoint such as:

- [Cloudflare Workers](https://workers.cloudflare.com) (keep everything on Cloudflare)
- [Formspree](https://formspree.io)
- Any backend endpoint that accepts a `POST` with `application/x-www-form-urlencoded`

---

## Practice Info

| | |
|---|---|
| **Address** | 6552 Bolsa Ave, Suite J, Huntington Beach, CA 92647 |
| **Phone** | (714) 893-2106 |
| **Email** | oasisdentalcarehb@yahoo.com |
| **Hours** | Mon–Thu 9 AM–5 PM · Fri 9 AM–4 PM · Sat by appt |
