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
