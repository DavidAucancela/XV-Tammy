# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server on http://localhost:3000
npm run build    # type-check + production build
npm run lint     # ESLint
```

No test suite configured yet. Validate behavior by running `dev` and hitting routes with a browser or `curl`.

## Project

Digital invitation + QR check-in system for a quinceañera (50–150 guests). A single Next.js 15 app backed by Supabase, deployed on Railway.

**Routes**
- `/` — placeholder home
- `/i/[token]` — personalized invitation (SSR, public)
- `/api/qr?token=<token>` — server-side PNG generation, immutable cache
- `/scan` — camera-based QR scanner for door staff
- `/admin` — real-time check-in dashboard

**Supabase schema**
- Table `guests`: `id`, `nombre`, `pases`, `token`, `rsvp_estado`, `pases_confirmados`, `checked_in_at`, `created_at`
- RPC `check_in(p_token)`: idempotent, security definer
- RPCs to add: `get_invitation`, `confirmar_rsvp`, updated `check_in` with partial passes

## Architecture

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx / globals.css
│   ├── i/[token]/page.tsx    # invitation — async params (Next 15 requirement)
│   ├── scan/page.tsx
│   ├── admin/page.tsx
│   └── api/qr/route.ts       # runtime: nodejs — uses qrcode npm package
└── lib/supabase/
    ├── client.ts             # createBrowserClient — use in Client Components
    └── server.ts             # createServerClient (SSR) + createAdminClient (service role)
```

**Two Supabase clients:**
- `lib/supabase/client.ts` — browser, uses anon key, safe to import in `"use client"` components
- `lib/supabase/server.ts` — SSR client (cookie-based session) for Server Components and Route Handlers; `createAdminClient()` uses `SUPABASE_SERVICE_ROLE_KEY` and must never be called from client-side code

**Next.js 15 async params:** Dynamic route `params` are a `Promise` — always `await params` before destructuring.

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only, never expose to browser
NEXT_PUBLIC_EVENT_DATE=           # ISO 8601 with TZ offset, e.g. 2026-12-31T20:00:00-05:00
NEXT_PUBLIC_VENUE_LAT=
NEXT_PUBLIC_VENUE_LNG=
```

## Key dependencies

| Package | Purpose |
|---|---|
| `@supabase/ssr` | SSR-aware Supabase client (replaces `@supabase/auth-helpers-nextjs`) |
| `qrcode` | Server-side PNG generation in `/api/qr` |
| `html5-qrcode` | Browser camera scanner for `/scan` (Client Component only) |
| `framer-motion` | Invitation animations |
