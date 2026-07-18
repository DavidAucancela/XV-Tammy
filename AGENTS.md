# AGENTS.md

Complemento de `CLAUDE.md` — solo hechos no obvios que un agente probablemente erraría sin ayuda.

## Comandos

- `npm run build` == `next build` (type-check + build). No existe `tsc` separado.
- Seed: `npm run seed` lee **`.env`** (no `.env.local`), insume `scripts/guests.csv`, escribe `scripts/links.txt`. `.env` está en `.gitignore`.
- Seed script usa `npx tsx` internamente, no `ts-node` ni `tsc`.
- `npm run seed:dry` previsualiza sin escribir en DB.

## Imports

- `@/` apunta a `./src/*` (definido en `tsconfig.json` paths). Todos los imports del proyecto usan este alias.

## Tailwind CSS v4

- No hay `tailwind.config.js`. La configuración se declara en CSS via `@import "tailwindcss"` (`src/app/globals.css`).
- PostCSS plugin: `@tailwindcss/postcss` (v4), no `tailwindcss` (v3).
- Variables CSS custom (champagne palette) en `:root` de `globals.css` — colores, sombras, radius, motion.

## QR route

- `/api/qr/route.ts` exporta `runtime = "nodejs"` porque `qrcode` no funciona en edge runtime. No cambiar a edge.

## Clientes Supabase

- `createAdminClient` (`lib/supabase/server.ts`) usa `autoRefreshToken: false, persistSession: false` — es service role, no maneja sesiones de usuario.
- `createClient` (SSR) usa cookie store via `next/headers`; en Server Components los `setAll` call se tragan silenciosamente (los cookies se setean en middleware).

## Dev server

- `DEV_ORIGIN` habilita `allowedDevOrigins` en `next.config.ts` para testeo mobile. Se setea en `.env`, no `.env.local`.

## Contexto de música

- `src/context/MusicContext.tsx` provee `MusicProvider` y hook `useMusic()`. Se monta en `layout.tsx` envolviendo toda la app.
- `MusicPlayer` se renderiza en `/recuerdos` y en `/i/[token]`. Se auto-pausa cuando se reproduce un video de familia (`FamilyMessages`).
- La música de fondo y el `dressCode` se definen en `src/data/landingContent.ts`.

## Animaciones y componentes decorativos

- Framer Motion se usa en toda la app. `MotionConfig reducedMotion="user"` en `layout.tsx` respeta `prefers-reduced-motion` globalmente — no verificarlo por componente.
- `PageTransition` (`src/components/landing/PageTransition.tsx`) wrappa `{children}` en el layout — transiciones entre páginas.
- Componentes florales decorativos (solo visual, no data-driven): `Butterflies`, `CornerFlorals`, `FallingPetals`, `PetalBurst`, `SparkleTrail`, `Sparkles`.
- `ScrollProgress` — barra de progreso de scroll en `/recuerdos`.
- `usePointerParallax` (`src/lib/usePointerParallax.ts`) — hook para parallax basado en posición del cursor.

## Contenido editable

- Todo el contenido personalizable (fotos, mensajes, música, venue, dressCode, heroPhoto) vive en `src/data/landingContent.ts`.
- `src/lib/eventDetails.ts` provee `getEventDetails()` — helper que deriva celebrant/dateLabel/timeLabel/calendarUrl/lat/lng desde env vars. Usado por ambos page servers (`page.tsx` y `recuerdos/page.tsx`).

## Tests

- No hay suite de tests. Validación manual: `npm run dev` + curl/browser.

## graphify

- Existe un knowledge graph en `graphify-out/` (god nodes, community structure, cross-file relationships).
- Para preguntas sobre el codebase, usar primero `graphify query "<question>"` cuando `graphify-out/graph.json` existe.
- `graphify path` para relaciones y `graphify explain` para conceptos enfocados.
- Si `graphify-out/wiki/index.md` existe, usarlo para navegación general.
- Después de modificar código, ejecutar `graphify update .` para mantener el grafo actualizado.
