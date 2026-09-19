# Migración: Supabase → Postgres (Railway) + auth propia

**Fecha:** 2026-09-18/19
**Rama:** `feat/migrate-railway-postgres` → mergeada a `main` (commit `838f673`)

## Por qué

Se decidió dejar de depender de Supabase por completo: datos, autenticación (`/login`, `/admin`, `/scan`) y el realtime del dashboard de check-in. La app ya corre en Railway (no Vercel), así que se migró a un Postgres nativo de Railway en el mismo proyecto.

## Incidente: el proyecto de Supabase murió en medio de la migración

Mientras se armaba el script para copiar los datos en vivo, `rcksgnqvpyjwixhptvqr.supabase.co` empezó a devolver `NXDOMAIN` — el slug del proyecto quedó reasignado a otro proyecto de Supabase (no fue algo causado por esta migración). Se confirmó que **producción ya estaba rota** antes de tocar código: `POST /api/invitacion` devolvía 500 `fetch failed`.

David tenía un backup (`pg_dumpall`, `db_cluster-15-09-2026@22-40-22.backup`, descargado el 2026-09-15) guardado en `backup - Supabase/` en la raíz del repo (gitignored, contiene PII — no se commitea). Los 31 invitados se restauraron desde ese dump con `scripts/migrate-from-backup.mjs`, preservando `id`/`token`/RSVP/check-in.

**Lección:** los backups automáticos de Supabase (o cualquier proveedor) hay que descargarlos y guardarlos aparte periódicamente — el proyecto puede desaparecer sin aviso.

## Qué cambió

| Antes (Supabase) | Ahora |
|---|---|
| Tabla `guests` + RLS + RPCs `check_in`/`get_invitation` | Postgres nativo de Railway, acceso 100% server-side vía `src/lib/db.ts` (pool `pg` perezoso). Sin RLS/RPCs — el control de acceso vive en las rutas de Next.js. |
| Auth por magic-link de Supabase (`signInWithOtp` + `exchangeCodeForSession`) | Magic-link propio: JWT firmado con `jose` (`src/lib/auth.ts`), email enviado por **Resend** (`src/lib/email.ts`), allowlist `ADMIN_ALLOWED_EMAILS` |
| Realtime de `/admin` vía `postgres_changes` | Polling cada 4s a `/api/admin/guests` (protegido por la cookie de sesión) |
| Cookie de sesión de Supabase | Cookie `session` propia (JWT, httpOnly + secure + `sameSite=lax`, 7 días), verificada en `middleware.ts` |

### Archivos nuevos
- `src/lib/db.ts`, `src/lib/auth.ts`, `src/lib/email.ts`
- `src/app/api/auth/request-link/route.ts`, `src/app/api/auth/signout/route.ts`, `src/app/api/admin/guests/route.ts`
- `scripts/db/schema.sql` + `scripts/db/apply-schema.mjs` (`npm run db:migrate`)
- `scripts/migrate-from-backup.mjs` (one-off, usado para la restauración inicial — no hace falta volver a correrlo)

### Archivos borrados
- `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`

### Rutas migradas a `src/lib/db.ts`
`api/checkin`, `api/rsvp`, `api/invitacion`, `admin/page.tsx`, `i/[token]/page.tsx`, `scripts/seed.ts`, `scripts/generate-whatsapp-reminder.mjs`

## Infraestructura en Railway

Proyecto `XV-Tammy` (`e2e96ae0-55ed-42fe-b097-899992783002`), ambiente `production`:
- **Servicio `Postgres`** (`465c08f3-fc44-4cb2-b26d-cd015b3b9fe4`) — imagen `ghcr.io/railwayapp-templates/postgres-ssl:latest`, volumen persistente `postgres-data` (5GB). Tiene un **TCP Proxy público** habilitado (`DATABASE_PUBLIC_URL`) para poder conectarse desde una máquina local — protegido por SSL + contraseña random de 32 caracteres. El intento de usar un túnel SSH privado (`railway connect --tunnel-only --ssh`) falló por falta de llaves SSH configuradas en la cuenta; se optó por el proxy público como alternativa pragmática. **Pendiente evaluar si conviene cerrarlo** una vez que ya no se necesite acceso local frecuente.
- **Servicio `XV-Tammy`** (la app) — usa `DATABASE_URL=${{Postgres.DATABASE_URL}}` (referencia privada, sin pasar por el proxy público).

## Variables de entorno nuevas

Ver `.env.example` y la tabla en `CLAUDE.md` → Environment Variables. Resumen:

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Connection string de Postgres (local: la pública del proxy TCP; producción: `${{Postgres.DATABASE_URL}}`, la privada) |
| `AUTH_SECRET` | Firma los JWT de magic-link y sesión — **distinto en local y en producción** (el de producción se generó aparte, no es el mismo que se usó para pruebas locales) |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Envío del magic-link. Sin dominio verificado en Resend, `onboarding@resend.dev` solo entrega al email con el que se creó la cuenta de Resend — hoy alcanza porque solo David entra a `/admin` |
| `ADMIN_ALLOWED_EMAILS` | Allowlist de `/login` — hoy solo `david102002@hotmail.com` |

Variables de Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) quedaron **removidas** de `.env`/`.env.example`; en Railway (producción) siguen listadas en el servicio pero sin uso — se pueden borrar cuando se confirme que todo sigue estable.

## Verificación hecha

- `npm run build` limpio (type-check + build).
- End-to-end en local (puerto 3050 — el 3000 lo tenía ocupado otro proyecto): `/api/invitacion`, `/i/[token]`, `/api/checkin` (idempotente), `/api/rsvp`, `/api/auth/request-link` (envío real por Resend), `/auth/callback` + cookie de sesión, `/admin` autenticado, `/api/admin/guests` (200 con cookie / 401 sin cookie), `/api/auth/signout`.
- Deploy a producción confirmado: `POST /api/invitacion` en `https://xv-tammy-production.up.railway.app` responde 200 con datos reales (antes daba 500).

## Pendiente / seguimiento

- [ ] Confirmar en vivo que el magic-link a `/login` llega al correo y el login completo funciona en producción (no solo probado con un JWT generado a mano).
- [ ] Decidir si cerrar el TCP Proxy público del Postgres una vez que ya no haga falta para desarrollo local.
- [ ] Borrar las variables de Supabase que quedaron sin uso en el servicio `XV-Tammy` de Railway.
- [ ] Si en algún momento se suma otro staff con otro email a `/admin`/`/scan`, hay que verificar un dominio propio en Resend (el modo sandbox actual solo entrega a un destinatario).
- [ ] Configurar backups periódicos del Postgres nuevo (Railway lo permite desde el dashboard del servicio) — lección aprendida de este incidente.
