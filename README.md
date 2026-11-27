# Amoria — Frontend

Next.js 16 (App Router, Turbopack) + Tailwind v4 storefront. See the [project README](../README.md) for stack decisions and milestones, and [API.md](../API.md) for the backend contract this app is built against.

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Bot protection

Public forms send a Cloudflare Turnstile token and a honeypot with the JSON body. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (see `.env.local.example`). Next.js inlines `NEXT_PUBLIC_*` variables at build time, so a production build needs the key in the environment before `npm run build`. When the variable is missing in development, the widget is skipped and the forms still submit.

Covered requests:

- `POST /api/contact` — contact page
- `POST /api/newsletter` — footer “Stay Informed” and the Our Stores signup
- `POST /api/welcome` — welcome popup
- `POST /api/auth/register` — auth drawer, create account
- `POST /api/auth/resend-set-password-link` — set-password page and the order confirmation resend link
