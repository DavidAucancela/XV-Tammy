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

**Celebrant:** Tammy Maguana Sánchez  
**Event Date:** 2026-08-29 at 20:00 (Quito, Ecuador)

**Routes**
- `/` — full landing page (hero, countdown, gallery, family messages, video, location, CTA)
- `/i/[token]` — personalized invitation with RSVP flow (SSR, public)
- `/api/qr?token=<token>` — server-side PNG generation, immutable cache
- `/api/checkin` — POST, registers guest entry (admin client)
- `/api/rsvp` — POST, confirms or declines RSVP (validates pases_confirmados ≤ pases)
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
│       ├── MeshBackground.tsx    # animated gradient mesh (5 blobs, varying opacities)
│       ├── FloatingIcons.tsx     # decorative floating icons (stars/diamonds, parallax)
│       ├── StickyNav.tsx         # glassmorphism nav, appears after 65% vh scroll
│       ├── HeroSection.tsx       # parallax layers + kinetic title (220×220 centered medallion)
│       ├── CountdownSection.tsx  # "Cada vez más cerca" — countdown with typography reveal
│       ├── PhotoGallery.tsx      # Ken Burns slideshow + filmstrip thumbnails
│       ├── FamilyMessages.tsx    # accordion-style family messages (text + video)
│       ├── EventLocation.tsx     # "Lugar y hora" — 2-col grid (date + time) + maps
│       ├── InvitePrompt.tsx      # CTA section + Add to Calendar
│       ├── RevealText.tsx        # word-by-word stagger reveal (Framer Motion)
│       ├── TiltCard.tsx          # 3D tilt + cursor-following glow
│       ├── MusicPlayer.tsx       # background music player + video pause integration
│       └── SectionHeading.tsx    # consistent section headers (eyebrow + title)
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

**Section titles (updated):**
- "Mensajes de tu familia" — family text/video accordion
- "Lugar y hora" — event details (date + time, no address card)
- "Mi crecimiento" — photo gallery ("de niña a señorita" eyebrow)
- "Cada vez más cerca" — countdown timer

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

## Key features

**Landing page:**
- Animated mesh background with 5 dynamic gradient blobs (22–25% opacity, 24–35s durations)
- 12 floating decorative icons (stars/diamonds) with parallax + fade animation
- Hero section: 220×220px centered portrait medallion with animated glow
- Countdown: "Cada vez más cerca" with real-time timer (days/hrs/min/sec)
- Photo gallery: Ken Burns zoom + filmstrip navigation + responsive layouts
- Family messages: Accordion-style buttons (text vs. video) with music pause integration
- Sticky navigation: Glassmorphism design, reveals at 65% viewport scroll
- Background music player: UI controls + auto-pause during video playback

**Personalized invitation (/i/[token]):**
- Matching champagne + rose gold color scheme
- Dynamic RSVP flow: select guests → confirm → QR code display
- Downloadable QR for check-in (mobile-ready)
- Same event details as landing (date, time, location link)

**Responsive design:**
- Mobile-first approach; breakpoints at 375px, 768px, 1024px, 1440px
- Centered, readable layouts on all screens
- Touch-friendly targets (min 44×44px)

## Security notes

- **Open redirect:** `auth/callback/route.ts` validates `next` starts with `/` before redirecting
- **RSVP:** `/api/rsvp` fetches the guest first to verify token existence and that `pases_confirmados ≤ guest.pases`
- **check_in:** `/api/checkin` checks `{ error }` from the RPC call; returns 500 if it fails
- **CSP:** `next.config.ts` sets `Content-Security-Policy`, `X-Frame-Options`, and `X-Content-Type-Options` headers on all routes
- **Admin real-time:** `AdminClient` uses the browser (anon key) client — RLS must be configured in Supabase so only authenticated users can read `guests`

## Color palette (Editorial champagne aesthetic)

**Light theme (landing + invitation pages):**
```
--bg:              #F3E6D6   (champagne — main background)
--surface:         rgba(234,216,195,0.65)  (card backgrounds, subtle depth)
--surface-elevated: rgba(252,246,236,0.85) (highlighted cards)
--border:          #DCC7AE   (dividers, subtle accents)
--text:            #4A372E   (taupe-dark, primary text)
--text-muted:      #7A6355   (secondary text, labels)
--accent:          #B4707C   (old rose — primary accent, buttons, icons)
--accent-ink:      #8F4E5F   (darker rose for text on light backgrounds)
--gold:            #C6A25E   (soft gold — decorative accents)
--gold-solid:      #96702E   (deep gold — icon strokes)
--ivory:           #FCF6EC   (off-white, text on dark surfaces)
```

**Dark overlay layer (nav, music player, floating widgets):**
```
--ink:             #2B211C   (dark chocolate — widget backgrounds)
--on-ink:          #F3E6D6   (light text on dark)
--on-ink-muted:    rgba(243,230,214,0.65) (secondary text on dark)
```

**Shadows:** `0 4px 16px / 0 8px 24px / 0 12px 40px rgba(43,33,28,.08/.10/.12)` (soft, neutral)

**Fonts:**  
- Display: `--font-playfair` (Playfair Display, serif — headings)
- Body: `--font-lato` (Lato, sans-serif — body text)

## Recent updates (2026-07-03)

**UI & Design:**
- ✅ Complete color palette migration: dark theme → champagne/rose gold (editorial aesthetic)
- ✅ Hero section: centered 220×220px medallion with proportional glow
- ✅ MeshBackground: enhanced with 5 blobs, increased opacities for visibility
- ✅ FloatingIcons: 12 decorative floating icons (stars/diamonds) with smooth animation
- ✅ Section titles updated (Spanish): "Cada vez más cerca", "Lugar y hora", "Mi crecimiento", "Mensajes de tu familia"
- ✅ Invitation page: matching champagne palette + new RSVP flow

**Family Messages:**
- ✅ Redesigned from masonry grid → button-based accordion system
- ✅ Each person has distinct button (text/video)
- ✅ MusicContext integration: auto-pauses background music during video playback
- ✅ Two accent colors: rosa viejo (text), dorado (video)

**Accessibility & Responsive:**
- ✅ All elements centered and symmetrical
- ✅ Mobile layouts optimized for 375px+ screens
- ✅ Touch targets meet 44×44px minimum
- ✅ Proper color contrast (WCAG AA verified)
