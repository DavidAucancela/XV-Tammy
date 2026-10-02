# XV Años — Tammy

Invitación digital personalizada y control de acceso con QR para los XV años de Tammy Maguana Sánchez.

- **Evento:** sábado 3 de octubre de 2026, 5:00 pm (Quito, Ecuador)
- **Producción:** https://xv-tammy-production.up.railway.app
- **Escala:** 50–150 invitados

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router, `output: "standalone"`) |
| Base de datos | PostgreSQL nativo de Railway (`pg`, acceso solo server-side) |
| Auth del staff | Magic link propio: JWT con `jose` + email por Resend |
| Estilos | Tailwind CSS v4 |
| Animaciones | Framer Motion |
| QR | `qrcode` (genera el PNG) · `html5-qrcode` (escáner en puerta) |
| Deploy | Railway (auto-deploy desde `main`) |

> Supabase ya no se usa. Ver [`MIGRATION.md`](MIGRATION.md) para la historia de la migración.

## Rutas

| Ruta | Descripción | Acceso |
|---|---|---|
| `/` | Landing de una sola pantalla: sobre de apertura, jardín con minijuego, cuenta regresiva | Público |
| `/recuerdos` | Galería de fotos, mensajes de la familia, ubicación y calendario | Público |
| `/i/[token]` | Invitación personalizada: fecha, cuenta regresiva, RSVP y tarjeta 3D con el QR | Link personal (token) |
| `/scan` | Escáner de QR para la puerta (cámara) | Staff con sesión |
| `/admin` | Panel de check-in en vivo (polling cada ~4 s) | Staff con sesión |
| `/login` | Acceso por magic link | Correo en `ADMIN_ALLOWED_EMAILS` |
| `/api/qr?token=` | PNG del QR (contiene el link `/i/<token>`) | Público |
| `/api/invitacion` | POST `{ telefono }` → `{ token, nombre }` | Público |
| `/api/rsvp` | POST confirmar/declinar (valida `pases_confirmados ≤ pases`) | Token |
| `/api/checkin` | POST registra la entrada (idempotente) | Sesión de staff |
| `/api/admin/guests` | GET lista de invitados | Sesión de staff |
| `/api/auth/request-link`, `/auth/callback`, `/api/auth/signout` | Flujo del magic link | — |

## Cómo funciona el QR

El QR de cada invitado codifica su link personal `…/i/<token>`. **La cámara normal del celular solo abre la invitación y no registra nada.** El check-in se hace únicamente desde `/scan`, que lee el token y llama a `/api/checkin`. Guía completa en [`docs/EVENTO.md`](docs/EVENTO.md).

## Setup local

```bash
npm install
cp .env.example .env        # los scripts leen .env (no .env.local)
npm run db:migrate          # aplica scripts/db/schema.sql contra DATABASE_URL
npm run dev                 # http://localhost:3000
```

Variables de entorno (detalle en `CLAUDE.md`):

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Postgres. Local: URL pública del proxy TCP de Railway. Producción: `${{Postgres.DATABASE_URL}}` (privada) |
| `AUTH_SECRET` | Firma magic links y sesión. Distinto en local y producción |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Envío del magic link |
| `ADMIN_ALLOWED_EMAILS` | Correos con acceso a `/login`, separados por coma |
| `NEXT_PUBLIC_EVENT_DATE` | ISO 8601 con zona, p. ej. `2026-10-03T17:00:00-05:00` |
| `NEXT_PUBLIC_EVENT_DATE_CONFIRMED` | `true` muestra fecha, hora y cuenta regresiva; `false` muestra "Próximamente" |
| `NEXT_PUBLIC_VENUE_LAT`, `NEXT_PUBLIC_VENUE_LNG` | Coordenadas del salón |
| `NEXT_PUBLIC_CELEBRANT_NAME` | Nombre de la quinceañera |
| `NEXT_PUBLIC_APP_URL` | URL canónica (se usa en el QR y en los mensajes) |
| `DEV_ORIGIN` | Opcional: IP local para probar en móvil |

> Las variables `NEXT_PUBLIC_*` se incrustan al compilar: cambiarlas en Railway dispara un redeploy.

## Scripts

```bash
npm run dev | build | start | lint
npm run db:migrate           # aplica el schema
npm run seed:dry             # previsualiza la carga de invitados
npm run seed                 # carga scripts/guests.csv a Postgres y escribe scripts/links.txt
npm run whatsapp:reminder    # panel HTML de recordatorios para los confirmados
node scripts/generate-whatsapp-invites.mjs   # panel de invitaciones (guests.csv + links.txt)
./scripts/optimize-photos.sh <carpeta>       # optimiza y agrega fotos a public/photos/
```

Los HTML de WhatsApp, `guests.csv` y `links.txt` contienen datos personales y están en `.gitignore`.

### Mensajes por WhatsApp

Ambos scripts generan un panel HTML con un botón por invitado que abre WhatsApp con el mensaje listo. El saludo usa el **alias** del invitado (solo su primer nombre). El panel de recordatorios (`whatsapp:reminder`) lee los confirmados directo de Postgres y guarda en el navegador (localStorage) qué mensajes ya se enviaron, con filtros y contadores. Ese estado vive solo en ese navegador. Para refrescar RSVPs hay que volver a correr el script.

## Contenido editable

Todo en `src/data/landingContent.ts`: mensajes y videos de la familia, música, salón, código de vestimenta y foto del hero. Las fotos de la galería se descubren solas desde `public/photos/` (nombres numéricos, orden numérico; `2.1.jpeg` va entre `2.jpg` y `3.jpg`).

Pendiente de contenido: 3 de los 6 items de `familyItems` son videos de YouTube de relleno; se reemplazarán con videos grabados en la fiesta.

## Estructura

```
src/
├── app/                    # rutas (ver tabla) y layout
├── components/landing/     # hero, sobre de apertura, galería, PassCard (tarjeta 3D del QR), etc.
├── context/MusicContext.tsx
├── data/landingContent.ts  # contenido editable
├── lib/
│   ├── db.ts               # pool pg perezoso + consultas tipadas (solo server)
│   ├── auth.ts             # magic link + sesión (jose), allowlist
│   ├── email.ts            # Resend
│   ├── eventDetails.ts     # fecha/hora/calendario derivados de env
│   └── photos.ts
└── middleware.ts           # protege /admin y /scan
scripts/                    # db, seed, WhatsApp, optimización de fotos
docs/EVENTO.md             # guía operativa del evento
```

## Despliegue (Railway)

- Proyecto `XV-Tammy`, ambiente `production`, servicios `XV-Tammy` (app) y `Postgres`.
- **Auto-deploy desde `main`**: cada merge a `main` reconstruye y publica. Las ramas y PRs no despliegan.
- `npm start` debe conservar `HOSTNAME=0.0.0.0` (Railway fija `HOSTNAME` al ID del contenedor y rompe el proxy).
- El build copia `public/` y `.next/static/` al bundle standalone (`postbuild`).
- Cambiar variables en Railway también dispara un redeploy.

## Seguridad

- `DATABASE_URL` solo la lee `src/lib/db.ts`, importado únicamente desde código de servidor.
- Cookie de sesión `httpOnly` + `secure` + `sameSite=lax`, 7 días, verificada en `middleware.ts` y dentro de `/api/admin/guests`.
- `/api/auth/request-link` responde igual exista o no el correo (no permite enumerar el personal).
- `?next=` solo acepta rutas relativas (evita open redirect).
- CSP, `X-Frame-Options` y `X-Content-Type-Options` en `next.config.ts`.
- Los archivos con datos personales (`guests.csv`, `links.txt`, HTML de WhatsApp, backups, hojas de invitados) están en `.gitignore`.
