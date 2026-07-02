# XV Años — Tammy

Sistema digital de invitaciones personalizadas y control de acceso con QR para una quinceañera. Construido con Next.js 15, Supabase y desplegado en Railway.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router) |
| Base de datos | Supabase (PostgreSQL + Realtime) |
| Estilos | Tailwind CSS v4 |
| Animaciones | Framer Motion v12 |
| Scanner QR | html5-qrcode |
| Generación QR | qrcode (server-side PNG) |
| Deploy | Railway |

## Rutas

| Ruta | Descripción | Acceso |
|---|---|---|
| `/` | Landing page con countdown, galería, mensajes, video, mapa | Público |
| `/i/[token]` | Invitación personalizada con QR | Público (token requerido) |
| `/scan` | Escáner de QR para staff en puerta | Staff (dispositivo físico) |
| `/admin` | Dashboard de check-in en tiempo real | Staff autenticado |
| `/login` | Login por magic link (email OTP) | Staff |
| `/api/qr?token=<token>` | Genera PNG del QR del invitado | Server-side |
| `/api/checkin` | POST — registra ingreso del invitado | Server-side |
| `/api/rsvp` | POST — confirma o declina RSVP | Server-side |

## Setup local

### 1. Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # solo server, nunca al browser

NEXT_PUBLIC_EVENT_DATE=2026-12-31T20:00:00-05:00
NEXT_PUBLIC_VENUE_LAT=-0.1234
NEXT_PUBLIC_VENUE_LNG=-78.5678
NEXT_PUBLIC_CELEBRANT_NAME=Tammy

NEXT_PUBLIC_APP_URL=http://localhost:3000
DEV_ORIGIN=                             # opcional: IP local para probar en móvil
```

### 2. Schema de Supabase

```sql
create table guests (
  id               uuid primary key default gen_random_uuid(),
  nombre           text not null,
  pases            int  not null default 1,
  token            text not null unique,
  rsvp_estado      text,
  pases_confirmados int,
  checked_in_at    timestamptz,
  created_at       timestamptz default now()
);

-- RPC idempotente de check-in (security definer)
create or replace function check_in(p_token text)
returns void language plpgsql security definer as $$
begin
  update guests
  set checked_in_at = coalesce(checked_in_at, now())
  where token = p_token;
end;
$$;
```

Habilitar RLS y agregar política para que solo usuarios autenticados lean `guests`.

### 3. Instalar y correr

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

```bash
npm run seed       # carga invitados de scripts/seed.ts a Supabase
npm run seed:dry   # previsualiza sin escribir en DB
npm run build      # type-check + build de producción
npm run lint       # ESLint
```

## Personalizar contenido

Editar `src/data/landingContent.ts`:

```ts
// Fotos de la galería (paths en /public/photos/)
export const photos: string[] = [
  "/photos/foto1.jpg",
  "/photos/foto2.jpg",
];

// Mensajes de la familia
export const messages = [
  { author: "Mamá y Papá", role: "Padres", text: "..." },
];

// URL de YouTube embed (vacío = placeholder)
export const videoUrl = "https://www.youtube.com/embed/VIDEO_ID";

// Nombre y dirección del salón
export const venue = {
  name: "Salón Elegance",
  address: "Av. Principal 123, Ciudad",
};
```

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx              # fuentes + metadata OG
│   ├── globals.css             # keyframes del mesh + color-scheme
│   ├── page.tsx                # landing (Server Component orquestador)
│   ├── i/[token]/page.tsx      # invitación personalizada (SSR)
│   ├── scan/page.tsx           # escáner QR
│   ├── admin/page.tsx          # dashboard (requiere sesión)
│   ├── login/page.tsx          # magic link login
│   ├── auth/callback/route.ts  # intercambio de código OAuth
│   └── api/
│       ├── checkin/route.ts    # POST — check-in
│       ├── rsvp/route.ts       # POST — confirmar/declinar
│       └── qr/route.ts         # GET  — PNG del QR
├── components/
│   └── landing/
│       ├── MeshBackground.tsx  # fondo animado fixed
│       ├── StickyNav.tsx       # nav glassmorphism
│       ├── HeroSection.tsx     # hero con parallax
│       ├── CountdownSection.tsx
│       ├── PhotoGallery.tsx
│       ├── FamilyMessages.tsx
│       ├── VideoSection.tsx
│       ├── EventLocation.tsx   # detalles + embed Google Maps
│       ├── InvitePrompt.tsx
│       ├── RevealText.tsx      # kinetic word-reveal
│       └── TiltCard.tsx        # tilt 3D + cursor glow
├── data/
│   └── landingContent.ts       # fotos, mensajes, video, venue
└── lib/supabase/
    ├── client.ts               # browser client (anon key)
    └── server.ts               # SSR client + createAdminClient
```

## Seguridad

- Auth callback valida que `?next=` sea un path relativo (evita open redirect)
- `createAdminClient` solo se llama desde server-side (service role key)
- CSP headers configurados en `next.config.ts` (frame-src, connect-src, etc.)
- RLS en Supabase: verificar que la tabla `guests` solo sea legible por usuarios autenticados

## Deploy en Railway

1. Conectar el repositorio en Railway
2. Agregar todas las variables de entorno del `.env.example`
3. Definir `NEXT_PUBLIC_APP_URL` con el dominio de Railway
4. Railway detecta Next.js y corre `npm run build` + `npm start` automáticamente
