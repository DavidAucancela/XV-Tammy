# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

```bash
npm install                    # install dependencies
npm run dev                    # dev server on http://localhost:3000
npm run build                  # type-check + production build
npm start                      # production: HOSTNAME=0.0.0.0 node .next/standalone/server.js
npm run lint                   # ESLint
npm run seed                   # load guests from scripts/seed.ts into Postgres
npm run seed:dry               # preview seed without writing to DB
npm run db:migrate             # apply scripts/db/schema.sql against DATABASE_URL
```

No test suite configured. Validate by running `dev` and testing routes with a browser or `curl`.

### Critical: Standalone build (Railway)
- `next.config.ts` sets `output: "standalone"` — reduces runtime memory from ~434MB to ~66MB
- **Must keep** `HOSTNAME=0.0.0.0` in `npm start` — Railway auto-sets `HOSTNAME` to container ID, which silently breaks proxy binding (502/499 errors despite "Ready" logs)
- `postbuild` script copies `public/` and `.next/static/` into `.next/standalone/` since standalone server doesn't serve them
- Never change `npm start` to `node .next/standalone/server.js` without the `HOSTNAME=0.0.0.0` prefix

## Project Overview

Digital invitation + QR check-in system for a quinceañera (50–150 guests). Next.js 15 + Postgres (Railway) + Railway.

**Event:** Tammy Maguana Sánchez  
**Date:** 2026-09-19 at 17:00 (Quito, Ecuador)

### Routes

**Landing & Public**
- `/` — single-viewport hero (no scroll): seal intro, garden scene + minigame, countdown, event preview → link to `/recuerdos`
- `/recuerdos` — scrollable: photo gallery, family messages, full location + map, invite/calendar CTA
- `/i/[token]` — personalized invitation with RSVP flow (SSR, token-gated)

**APIs**
- `/api/qr?token=<token>` — PNG generation (nodejs runtime only; immutable cache)
- `/api/invitacion` — POST `{ telefono }` → `{ token, nombre }` (phone lookup)
- `/api/rsvp` — POST RSVP confirm/decline (validates `pases_confirmados ≤ pases`)
- `/api/checkin` — POST guest entry (admin only)

**Auth & Admin**
- `/scan` — QR scanner for door staff (camera-based)
- `/admin` — check-in dashboard, polls `/api/admin/guests` every ~4s (authenticated only)
- `/login` — magic link login (own JWT-based auth, email sent via Resend)
- `/auth/callback` — verifies the magic-link token, sets the session cookie (validates `?next=` as relative path only)

**Internal**
- `/api/admin/guests` — GET, session-cookie protected; polled by `/admin` for live updates
- `/api/auth/request-link` — POST `{ email, next }`; only sends if `email` is in `ADMIN_ALLOWED_EMAILS`
- `/api/auth/signout` — POST; clears the session cookie

### Database (Postgres on Railway)

**Table `guests`**
```
id (uuid, pk, default gen_random_uuid())
nombre (text, required)
pases (int, default 1)
telefono (text, digits-only, nullable)
token (text, unique, required)
rsvp_estado (text, nullable)
pases_confirmados (int, nullable)
checked_in_at (timestamptz, nullable)
created_at (timestamptz, default now())
```
Schema lives in `scripts/db/schema.sql`, applied with `npm run db:migrate`.

- No RLS/RPCs — access is enforced entirely at the Next.js layer: every query goes through `src/lib/db.ts`, which is only ever imported from server-only code (API routes, Server Components). `DATABASE_URL` is never exposed to the browser, same isolation model the old `createAdminClient()` had.
- `check_in` is a plain idempotent `UPDATE ... WHERE checked_in_at IS NULL` in `checkInGuest()` (`src/lib/db.ts`) — no stored procedure needed anymore.

## Architecture & File Structure

```
src/
├── app/                          # Next.js 15 App Router (async params require await)
│   ├── layout.tsx                # MusicProvider, MotionConfig, PageTransition
│   ├── globals.css               # @import "tailwindcss" (v4), CSS vars, keyframes
│   ├── page.tsx / recuerdos/page.tsx  # Server Components, call getEventDetails()
│   ├── i/[token]/page.tsx        # SSR invitation (await params before destructure)
│   ├── scan/page.tsx / admin/page.tsx
│   ├── login/page.tsx
│   ├── auth/callback/route.ts    # verifies magic-link token, sets session cookie
│   └── api/
│       ├── checkin/route.ts      # src/lib/db.ts (server-only)
│       ├── rsvp/route.ts         # src/lib/db.ts (server-only)
│       ├── invitacion/route.ts   # src/lib/db.ts (server-only)
│       ├── admin/guests/route.ts # polled by /admin, session-cookie protected
│       ├── auth/request-link/route.ts  # sends magic-link email via Resend
│       ├── auth/signout/route.ts
│       └── qr/route.ts           # runtime: "nodejs" (qrcode incompatible with edge)
├── components/landing/
│   ├── MeshBackground.tsx / FloatingIcons.tsx
│   ├── GardenScene.tsx / Fireflies.tsx / Hummingbirds.tsx / PassingBirds.tsx
│   ├── ButterflyGame.tsx / Butterflies.tsx
│   ├── HomeHero.tsx / InvitationOpener.tsx
│   ├── PhotoGallery.tsx / PhotoGrid.tsx / GalleryNav.tsx
│   ├── FamilyMessages.tsx / EventLocation.tsx
│   ├── InvitePrompt.tsx
│   ├── MusicPlayer.tsx / PageTransition.tsx / ScrollProgress.tsx
│   ├── RevealText.tsx / TiltCard.tsx
│   ├── CornerFlorals.tsx / FallingPetals.tsx / PetalBurst.tsx / SparkleTrail.tsx / Sparkles.tsx (decorative only)
│   ├── Button.tsx / SectionHeading.tsx
│   └── [other animation components]
├── context/
│   └── MusicContext.tsx          # MusicProvider + useMusic() hook
├── data/
│   └── landingContent.ts         # photos[], messages[], videoUrl, venue, dressCode — all editable
├── lib/
│   ├── eventDetails.ts           # getEventDetails() derives celebrant/dateLabel/timeLabel/calendarUrl/lat/lng
│   ├── photos.ts                 # getGalleryPhotos() reads public/photos/ at build, numeric filenames sorted
│   ├── usePointerParallax.ts     # cursor parallax hook
│   ├── db.ts                     # pg Pool (lazy) + typed query helpers, server-only
│   ├── auth.ts                   # magic-link + session JWTs (jose), ADMIN_ALLOWED_EMAILS check
│   └── email.ts                  # Resend client, sendMagicLink()
└── ...
```

### Key Technical Patterns

**Data access (`src/lib/db.ts`):**
- `getPool()` — lazy singleton `pg.Pool`, never opened at import time (safe for build)
- Typed helpers: `getGuestByToken`, `checkInGuest`, `updateRsvp`, `findGuestByPhoneSuffix`, `listGuestsOrdered`
- Only ever imported from server-only code (API routes, Server Components) — `DATABASE_URL` never reaches the browser

**Auth (`src/lib/auth.ts`):**
- `jose`-signed JWTs: a 15-min magic-link token (`/api/auth/request-link` → email via Resend → `/auth/callback`) and a 7-day session cookie, verified in `middleware.ts` on every `/admin` and `/scan` request
- `isAllowedEmail()` gates who can request a link — set via `ADMIN_ALLOWED_EMAILS`

**Next.js 15 async params:** Routes with `[token]` receive `params` as a `Promise`
```ts
export default async function Page(props: { params: Promise<{ token: string }> }) {
  const { token } = await props.params;  // must await before destructuring
  // ...
}
```

**Content management:**
- Editable content (messages, music, venue, dress code, hero photo) → `src/data/landingContent.ts`
- Gallery photos are auto-discovered, not hardcoded: `src/lib/photos.ts` reads `public/photos/` at build
  - Numeric filenames sorted by number (chronological)
  - Decimals interleave: `2.1.jpeg` sits between `2.jpg` and `3.jpg`
  - Use `./scripts/optimize-photos.sh <folder>` to add/optimize photos
- `getEventDetails()` derives shared props for both landing pages (`page.tsx` + `recuerdos/page.tsx`)

**Imports:** `@/` alias points to `./src/*` (defined in `tsconfig.json`)

**Tailwind CSS v4:** No `tailwind.config.js`
- Config declared in CSS via `@import "tailwindcss"` in `globals.css`
- PostCSS plugin: `@tailwindcss/postcss` (not v3 `tailwindcss`)
- CSS custom vars (champagne palette) live in `:root` of `globals.css`

**Animations:**
- Framer Motion throughout; `MotionConfig reducedMotion="user"` in layout respects `prefers-reduced-motion` globally
- `PageTransition` wraps `{children}` in layout for cross-page transitions
- Decorative-only components: `Butterflies`, `CornerFlorals`, `FallingPetals`, `PetalBurst`, `SparkleTrail`, `Sparkles`

**Music & Video:**
- `MusicContext` mounted in layout.tsx, wraps entire app
- `MusicPlayer` renders on `/recuerdos` + `/i/[token]` only
- Auto-pauses during family video playback

## Environment Variables

Copy `.env.example` to `.env.local` (dev) or `.env` (production/seed scripts).

| Variable | Purpose | Example |
|---|---|---|
| `DATABASE_URL` | Postgres connection string (Railway), server-only | `postgres://user:pass@host:5432/railway` |
| `AUTH_SECRET` | Signs magic-link + session JWTs, server-only | random 32+ byte string |
| `RESEND_API_KEY` | Sends magic-link emails, server-only | `re_...` |
| `RESEND_FROM_EMAIL` | From-address for magic-link emails | `Acceso XV <acceso@tu-dominio.com>` |
| `ADMIN_ALLOWED_EMAILS` | Comma-separated allowlist for `/login` | `a@x.com,b@x.com` |
| `NEXT_PUBLIC_EVENT_DATE` | ISO 8601 with TZ offset | `2026-09-19T17:00:00-05:00` |
| `NEXT_PUBLIC_EVENT_DATE_CONFIRMED` | `"true"` once the date is official; otherwise the site shows "Próximamente" everywhere instead of date/time/countdown/calendar link | `false` |
| `NEXT_PUBLIC_VENUE_LAT` | Venue latitude | `-0.2234` |
| `NEXT_PUBLIC_VENUE_LNG` | Venue longitude | `-78.5123` |
| `NEXT_PUBLIC_CELEBRANT_NAME` | Celebrant name (hero + invite) | `Tammy` |
| `NEXT_PUBLIC_APP_URL` | Canonical app URL (auth callback fallback) | `https://example.com` |
| `DEV_ORIGIN` | Local dev IP for mobile testing | `http://192.168.x.x:3000` |

**Seed scripts:** `npm run seed` / `npm run seed:dry` read from `.env` (not `.env.local`). Seed reads `scripts/guests.csv` and writes `scripts/links.txt`.

## Key Dependencies

| Package | Purpose | Notes |
|---|---|---|
| `pg` | Postgres driver (Railway) | Server-only, used by `src/lib/db.ts` |
| `jose` | Sign/verify magic-link + session JWTs | `src/lib/auth.ts`, also runs in middleware (edge) |
| `resend` | Sends magic-link emails | `src/lib/email.ts`, server-only |
| `qrcode` | Server-side PNG generation | `/api/qr` endpoint |
| `html5-qrcode` | Browser QR camera scanner | `/scan` page, dynamically imported |
| `framer-motion` | Landing animations | Parallax, word-reveal, 3D tilt, glow |
| `next` | Framework | v15.3.3 (App Router, async params) |
| `tailwindcss` | CSS framework | v4 (CSS-in-CSS config, no .config.js) |

## Page Features

### `/` — Single-viewport landing (no scroll)
- Animated gradient mesh (5 blobs) + 12 floating decorative icons
- Hero: 220×220px centered medallion + kinetic title
- Countdown timer (days/hours/mins/secs)
- Condensed event info (date/time/venue name only; full location in `/recuerdos`)
- Silent (no audio)
- Link to `/recuerdos`

### `/recuerdos` — Scrollable second page
- Photo gallery: Ken Burns slideshow + filmstrip navigation
- Family messages: accordion-style (text or video) with music auto-pause
- Full event location: map + "Cómo llegar"
- Background music player (MusicPlayer component)
- Scrollspy nav (reveals at 65% scroll): links to galería/familia/evento sections
- Link back to `/`

### `/i/[token]` — Personalized invitation (SSR)
- Champagne + rose gold color scheme matching landing
- RSVP flow: select guests → confirm → QR display
- Downloadable QR for mobile check-in
- Event details (date/time/location)
- MusicPlayer component

### `/scan` — Door QR scanner
- Camera-based (html5-qrcode)
- Staff-facing, triggers guest check-in

### `/admin` — Check-in dashboard
- Shows guest list + check-in status, updates via polling (`/api/admin/guests`, ~4s interval)
- Requires authentication

### Responsive design
- Mobile-first: 375px, 768px, 1024px, 1440px breakpoints
- Centered, symmetric layouts
- Touch targets: min 44×44px

## Security Notes

- **Open redirect prevention:** `auth/callback/route.ts` and `/api/auth/request-link` validate `?next=`/`next` starts with `/` (relative path only)
- **RSVP validation:** `/api/rsvp` verifies token exists and `pases_confirmados ≤ guest.pases` before accepting
- **Check-in:** `/api/checkin` looks up the guest before calling `checkInGuest()`; returns 500 on failure
- **CSP headers:** `next.config.ts` sets Content-Security-Policy, X-Frame-Options, X-Content-Type-Options
- **Auth allowlist:** `/api/auth/request-link` only emails a link when the address is in `ADMIN_ALLOWED_EMAILS`; the response is identical either way so the endpoint can't be used to enumerate valid staff emails
- **Session cookie:** httpOnly + secure + `sameSite: "lax"`, verified with `jose` in `middleware.ts` (`/admin`, `/scan`) and again inside `/api/admin/guests` (doesn't rely solely on the middleware matcher)
- **DB isolation:** `DATABASE_URL` only read by `src/lib/db.ts`, imported exclusively from server-only code; never expose it to the browser

## Design & Colors (Editorial champagne aesthetic)

Defined as CSS custom properties in `src/app/globals.css`:

**Primary palette**
| Var | Value | Use |
|---|---|---|
| `--bg` | #F3E6D6 | Champagne main background |
| `--surface` | rgba(234,216,195,0.65) | Card backgrounds, subtle depth |
| `--surface-elevated` | rgba(252,246,236,0.85) | Highlighted cards |
| `--border` | #DCC7AE | Dividers, subtle accents |
| `--text` | #4A372E | Taupe-dark, primary text |
| `--text-muted` | #7A6355 | Secondary text, labels |
| `--accent` | #B4707C | Old rose, buttons/icons |
| `--accent-ink` | #8F4E5F | Darker rose, text on light |
| `--gold` | #C6A25E | Soft gold, decorative accents |
| `--gold-solid` | #96702E | Deep gold, icon strokes |
| `--ivory` | #FCF6EC | Off-white, text on dark |

**Dark layer (nav, music player, widgets)**
| Var | Value | Use |
|---|---|---|
| `--ink` | #2B211C | Dark chocolate backgrounds |
| `--on-ink` | #F3E6D6 | Light text on dark |
| `--on-ink-muted` | rgba(243,230,214,0.65) | Secondary text on dark |

**Other**
- **Shadows:** `0 4px 16px`, `0 8px 24px`, `0 12px 40px` with rgba(43,33,28,{.08/.10/.12})
- **Fonts:** Playfair Display (headings) + Lato (body)

## Development Tips

**Adding photos:** Use `./scripts/optimize-photos.sh <folder>` to batch-optimize and move to `public/photos/` with numeric filenames.

**Customizing content:** All editable content (messages, photos, music, venue, dress code) lives in `src/data/landingContent.ts`. No code changes needed for content-only updates.

**Mobile testing:** Set `DEV_ORIGIN` in `.env` to your local IP (e.g., `http://192.168.x.x:3000`) to test on physical mobile devices.

**Testing seed:** Always run `npm run seed:dry` before `npm run seed` to preview DB changes.

**Animations:** Uses Framer Motion throughout. All animation respects `prefers-reduced-motion` via `MotionConfig` in layout.

## Knowledge Graph (graphify)

This project has a knowledge graph at `graphify-out/` (community structure, cross-file relationships, god nodes).

**When to use:**
- **Quick lookup:** `graphify query "<question>"` — e.g., "where is the countdown timer implemented?"
- **Relationships:** `graphify path "<file-A>" "<file-B>"` — trace dependencies between files
- **Concept search:** `graphify explain "<concept>"` — e.g., "explain the RSVP flow"
- **Broad review:** `graphify-out/GRAPH_REPORT.md` for architecture overview (only if queries don't surface enough)

**Keep it current:** After significant code changes, run `graphify update .` (AST-based, no API calls).
