-- Postgres de Railway — reemplaza el schema de Supabase.
-- Aplicar con: psql "$DATABASE_URL" -f scripts/db/schema.sql

create extension if not exists pgcrypto;

create table if not exists guests (
  id                 uuid primary key default gen_random_uuid(),
  nombre             text not null,
  pases              integer not null default 1,
  telefono           text,
  token              text not null unique,
  rsvp_estado        text,
  pases_confirmados  integer,
  checked_in_at      timestamptz,
  created_at         timestamptz not null default now()
);

create index if not exists guests_telefono_idx on guests (telefono);

-- Recuerdos: fotos y videos que suben los invitados (archivos en el bucket S3 de Railway).
create table if not exists recuerdos (
  id          uuid primary key default gen_random_uuid(),
  guest_id    uuid not null references guests(id) on delete cascade,
  storage_key text not null unique,
  tipo        text not null check (tipo in ('foto', 'video')),
  content_type text not null,
  size_bytes  bigint not null,
  created_at  timestamptz not null default now()
);

create index if not exists recuerdos_created_idx on recuerdos (created_at desc);
