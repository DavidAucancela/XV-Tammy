# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server on http://localhost:3000
npm run build    # type-check + production build
npm run lint     # ESLint
npm run seed     # load guests from scripts/seed.ts into Supabase
npm run seed:dry # preview seed without writing to DB
```

No test suite configured yet. Validate behavior by running `dev` and hitting routes with a browser or `curl`.

## Project

Digital invitation + QR check-in system for a quinceañera (50–150 guests). A single Next.js 15 app backed by Supabase, deployed on Railway.

**Routes**
- `/` — full landing page (hero, countdown, gallery, family messages, video, location, CTA)
- `/i/[token]` — personalized invitation (SSR, public)
- `/api/qr?token=<token>` — server-side PNG generation, immutable cache
- `/api/checkin` — POST, registers guest entry (admin client)
- `/api/rsvp` — POST, confirms or declines RSVP (admin client)
- `/scan` — camera-based QR scanner for door staff
- `/admin` — real-time check-in dashboard (requires auth)
- `/login` — magic link login (email OTP via Supabase)
- `/auth/callback` — OAuth code exchange; `next` param is validated to be a relative path only

**Supabase schema**
- Table `guests`: `id`, `nombre`, `pases`, `token`, `rsvp_estado`, `pases_confirmados`, `checked_in_at`, `created_at`
- RPC `check_in(p_token)`: idempotent, security definer — sets `checked_in_at` only if null
- RLS must be enabled; only authenticated users should be able to read `guests`

## Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx / globals.css
│   ├── page.tsx                  # landing — Server Component, imports all sections
│   ├── i/[token]/page.tsx        # invitation — async params (Next 15 requirement)
│   ├── scan/page.tsx
│   ├── admin/page.tsx
│   ├── login/page.tsx
│   ├── auth/callback/route.ts
│   └── api/
│       ├── checkin/route.ts      # uses createAdminClient
│       ├── rsvp/route.ts         # uses createAdminClient
│       └── qr/route.ts           # runtime: nodejs — uses qrcode npm package
├── components/
│   └── landing/                  # all landing page sections (Client Components)
│       ├── MeshBackground.tsx    # fixed animated gradient mesh (CSS @keyframes)
│       ├── StickyNav.tsx         # glassmorphism nav, appears after 65% vh scroll
│       ├── HeroSection.tsx       # parallax layers + kinetic title
│       ├── CountdownSection.tsx
│       ├── PhotoGallery.tsx
│       ├── FamilyMessages.tsx
│       ├── VideoSection.tsx
│       ├── EventLocation.tsx     # event details + Google Maps iframe
│       ├── InvitePrompt.tsx
│       ├── RevealText.tsx        # word-by-word stagger reveal (Framer Motion)
│       └── TiltCard.tsx          # 3D tilt + cursor-following glow
├── data/
│   └── landingContent.ts         # photos[], messages[], videoUrl, venue — edit here
└── lib/supabase/
    ├── client.ts                 # createBrowserClient — use in Client Components
    └── server.ts                 # createServerClient (SSR) + createAdminClient (service role)
```

**Two Supabase clients:**
- `lib/supabase/client.ts` — browser, uses anon key, safe to import in `"use client"` components
- `lib/supabase/server.ts` — SSR client (cookie-based session) for Server Components and Route Handlers; `createAdminClient()` uses `SUPABASE_SERVICE_ROLE_KEY` and must never be called from client-side code

**Next.js 15 async params:** Dynamic route `params` are a `Promise` — always `await params` before destructuring.

**Landing content:** All customizable content (photos, family messages, video URL, venue) lives in `src/data/landingContent.ts`. The `page.tsx` Server Component reads env vars and passes everything as serializable props to Client Components.

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=           # server-only, never expose to browser
NEXT_PUBLIC_EVENT_DATE=              # ISO 8601 with TZ offset, e.g. 2026-12-31T20:00:00-05:00
NEXT_PUBLIC_VENUE_LAT=
NEXT_PUBLIC_VENUE_LNG=
NEXT_PUBLIC_CELEBRANT_NAME=          # used in hero + invite prompt
NEXT_PUBLIC_APP_URL=                 # canonical URL, used in auth callback fallback
DEV_ORIGIN=                          # optional: local IP for mobile testing (e.g. http://192.168.x.x:3000)
```

See `.env.example` for a complete template.

## Key dependencies

| Package | Purpose |
|---|---|
| `@supabase/ssr` | SSR-aware Supabase client (replaces `@supabase/auth-helpers-nextjs`) |
| `@supabase/supabase-js` | Direct client used by `createAdminClient` (service role, server-only) |
| `qrcode` | Server-side PNG generation in `/api/qr` |
| `html5-qrcode` | Browser camera scanner for `/scan` (Client Component only, dynamic import) |
| `framer-motion` | Landing animations: parallax, word-reveal, 3D tilt, cursor glow |

## Security notes

- **Open redirect:** `auth/callback/route.ts` validates `next` starts with `/` before redirecting
- **RSVP:** `/api/rsvp` fetches the guest first to verify token existence and that `pases_confirmados ≤ guest.pases`
- **check_in:** `/api/checkin` checks `{ error }` from the RPC call; returns 500 if it fails
- **CSP:** `next.config.ts` sets `Content-Security-Policy`, `X-Frame-Options`, and `X-Content-Type-Options` headers on all routes
- **Admin real-time:** `AdminClient` uses the browser (anon key) client — RLS must be configured in Supabase so only authenticated users can read `guests`

## Color palette

```
bg:      #0d0610   card:   rgba(22,13,30,0.92–0.95)   border: #251535
text:    #fdf0f8   accent: #e8699a                     muted:  #7a5870
```

Fonts: `--font-playfair` (Playfair Display, headings) + `--font-lato` (Lato, body).
