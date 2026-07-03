# AGENTS.md

Complemento de `CLAUDE.md` — solo hechos no obvios que un agente probablemente erraría sin ayuda.

## Comandos

- `npm run build` == `next build` (type-check + build). No existe `tsc` separado.
- Seed: `npm run seed` lee **`.env`** (no `.env.local`), insume `scripts/guests.csv`, escribe `scripts/links.txt`. `.env` está en `.gitignore`.
- Seed script usa `npx tsx` internamente, no `ts-node` ni `tsc`.

## Imports

- `@/` apunta a `./src/*` (definido en `tsconfig.json` paths). Todos los imports del proyecto usan este alias.

## Tailwind CSS v4

- No hay `tailwind.config.js`. La configuración se declara en CSS via `@import "tailwindcss"` (`src/app/globals.css`).
- PostCSS plugin: `@tailwindcss/postcss` (v4), no `tailwindcss` (v3).

## QR route

- `/api/qr/route.ts` exporta `runtime = "nodejs"` porque `qrcode` no funciona en edge runtime. No cambiar a edge.

## Clientes Supabase

- `createAdminClient` (`lib/supabase/server.ts`) usa `autoRefreshToken: false, persistSession: false` — es service role, no maneja sesiones de usuario.
- `createClient` (SSR) usa cookie store via `next/headers`; en Server Components los `setAll` call se tragan silenciosamente (los cookies se setean en middleware).

## Dev server

- `DEV_ORIGIN` habilita `allowedDevOrigins` en `next.config.ts` para testeo mobile. Se setea en `.env`, no `.env.local`.

## Tests

- No hay suite de tests. Validación manual: `npm run dev` + curl/browser.
