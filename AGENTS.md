# AGENTS.md

Complemento de `CLAUDE.md` — solo hechos no obvios que un agente probablemente erraría sin ayuda.

## Comandos

- `npm run build` == `next build` (type-check + build). No existe `tsc` separado.
- Seed: `npm run seed` lee **`.env`** (no `.env.local`), insume `scripts/guests.csv`, escribe `scripts/links.txt`. `.env` está en `.gitignore`.
- Seed script usa `npx tsx` internamente, no `ts-node` ni `tsc`.
- `npm run lint` hoy falla (ESLint 9 sin config flat): validar con `npx tsc --noEmit` o `npm run build`.
- `next dev` puede tardar minutos en arrancar en una máquina cargada; el puerto 3000 puede estar ocupado por otro proyecto (usar `-p 3050`).
- `npm run seed:dry` previsualiza sin escribir en DB.

## Imports

- `@/` apunta a `./src/*` (definido en `tsconfig.json` paths). Todos los imports del proyecto usan este alias.

## Tailwind CSS v4

- No hay `tailwind.config.js`. La configuración se declara en CSS via `@import "tailwindcss"` (`src/app/globals.css`).
- PostCSS plugin: `@tailwindcss/postcss` (v4), no `tailwindcss` (v3).
- Variables CSS custom (champagne palette) en `:root` de `globals.css` — colores, sombras, radius, motion.

## QR

- `/api/qr/route.ts` exporta `runtime = "nodejs"` porque `qrcode` no funciona en edge runtime. No cambiar a edge.
- El QR codifica `${NEXT_PUBLIC_APP_URL}/i/<token>`, no el token suelto. La cámara normal solo abre la invitación; el check-in solo ocurre desde `/scan` (`/api/checkin`).
- En `/i/[token]` el QR se muestra dentro de `PassCard` (tarjeta 3D, `src/components/landing/PassCard.tsx`).

## Deploy

- Railway despliega en cada merge a `main` y en cada cambio de variables. Ramas y PRs no despliegan. Antes del evento (2026-10-03) no mergear a `main` salvo urgencias. Ver `docs/EVENTO.md`.

## Base de datos y auth (sin Supabase)

- Supabase ya no existe en el proyecto. Todo acceso a datos pasa por `src/lib/db.ts` (pool `pg` perezoso, solo importable desde código de servidor). No hay RLS ni RPCs.
- Auth del staff: magic link propio con JWT (`jose`, `src/lib/auth.ts`) + Resend (`src/lib/email.ts`). La sesión es la cookie `session` (7 días), verificada en `middleware.ts` para `/admin` y `/scan`, y de nuevo dentro de `/api/admin/guests`.
- Solo los correos en `ADMIN_ALLOWED_EMAILS` reciben el magic link. Resend sin dominio verificado solo entrega al correo de la cuenta.

## Recuerdos (fotos y videos de invitados)

- La sección "Carga tus recuerdos" de `/recuerdos` solo se habilita con sesión de invitado: cookie `xv_guest` (JWT `jose`, httpOnly, 30 días, `src/lib/guestSession.ts`), revalidada contra `guests` en cada petición. Se abre por el link de la invitación (`/api/recuerdos/entrar?t=<token>`, botón en `/i/[token]`) o validando el celular (`InvitePrompt` → `POST /api/recuerdos/sesion`). El token no viaja por la URL de las demás rutas ni se guarda en `localStorage`.
- Archivos: bucket S3 privado de Railway (`recuerdos`, región sjc), subida directa del navegador con URL prefirmada (`/api/recuerdos/presign`), luego `POST /api/recuerdos` verifica el objeto (HeadObject, máx. 50MB) y lo registra en la tabla `recuerdos`. Lectura con URLs firmadas de 1 h. Código en `src/lib/storage.ts`.
- CORS del bucket: el panel de Railway no lo ofrece; se aplica por API con `railway run -s XV-Tammy node scripts/set-bucket-cors.mjs` (orígenes: `localhost:3050` y `NEXT_PUBLIC_APP_URL`). Si cambia el dominio, volver a correrlo.
- El CSP de `next.config.ts` permite `https://*.storageapi.dev` (img/media/connect).
- Probar la subida en local requiere las variables `S3_*`: `railway run -s XV-Tammy -- npm run dev -- -p 3050` (ojo: `DATABASE_URL` interna de Railway no resuelve en local; exportar la del `.env`).

## Dev server

- `DEV_ORIGIN` habilita `allowedDevOrigins` en `next.config.ts` para testeo mobile. Se setea en `.env`, no `.env.local`.

## Contexto de música

- `src/context/MusicContext.tsx` provee `MusicProvider` y hook `useMusic()`. Se monta en `layout.tsx` envolviendo toda la app.
- `MusicPlayer` se renderiza en `/recuerdos` y en `/i/[token]`. Se auto-pausa cuando se reproduce un video de familia (`FamilyMessages`).
- La música de fondo y el `dressCode` se definen en `src/data/landingContent.ts` (el `dressCode` ya no se muestra en `/i/[token]`; sí en los mensajes de WhatsApp).

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
