#!/usr/bin/env node
/**
 * El proyecto de Supabase murió (el slug quedó reasignado a otro proyecto,
 * NXDOMAIN). Este script restaura la tabla `guests` a partir de un dump
 * pg_dumpall descargado antes de que muriera, en vez de leer de Supabase
 * en vivo (ver scripts/migrate-from-supabase.mjs, ya no sirve).
 *
 * Uso: node scripts/migrate-from-backup.mjs "<ruta al .backup>"
 */
import fs from "fs";
import path from "path";
import { Pool } from "pg";

const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const idx = trimmed.indexOf("=");
      if (idx === -1) return;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (key && !process.env[key]) process.env[key] = val;
    });
}

const backupPath = process.argv[2];
if (!backupPath) {
  console.error("❌  Uso: node scripts/migrate-from-backup.mjs \"<ruta al .backup>\"");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("❌  Falta DATABASE_URL en .env (destino) — aplicá primero scripts/db/schema.sql");
  process.exit(1);
}

// Deshace el escapado de texto de Postgres COPY (formato text, no CSV).
function unescapeCopyField(raw) {
  if (raw === "\\N") return null;
  return raw.replace(/\\([btnrfv\\])/g, (_, c) => {
    switch (c) {
      case "b": return "\b";
      case "t": return "\t";
      case "n": return "\n";
      case "r": return "\r";
      case "f": return "\f";
      case "v": return "\v";
      default: return c; // \\  →  \
    }
  });
}

const raw = fs.readFileSync(backupPath, "utf-8");
const lines = raw.split(/\r?\n/);

const copyStart = lines.findIndex((l) => l.startsWith("COPY public.guests ("));
if (copyStart === -1) {
  console.error("❌  No encontré 'COPY public.guests (...)' en el backup");
  process.exit(1);
}

const header = lines[copyStart].match(/\(([^)]+)\)/)[1].split(",").map((s) => s.trim());

const rows = [];
for (let i = copyStart + 1; i < lines.length; i++) {
  const line = lines[i];
  if (line === "\\.") break;
  if (line === "") continue;
  const fields = line.split("\t").map(unescapeCopyField);
  const row = {};
  header.forEach((col, idx) => { row[col] = fields[idx]; });
  rows.push(row);
}

console.log(`\n✦  ${rows.length} invitados en el backup — restaurando a Postgres...\n`);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  let ok = 0;
  let fail = 0;

  for (const g of rows) {
    try {
      await pool.query(
        `insert into guests (id, nombre, pases, telefono, token, rsvp_estado, pases_confirmados, checked_in_at, created_at)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         on conflict (id) do update set
           nombre = excluded.nombre, pases = excluded.pases, telefono = excluded.telefono,
           token = excluded.token, rsvp_estado = excluded.rsvp_estado,
           pases_confirmados = excluded.pases_confirmados, checked_in_at = excluded.checked_in_at`,
        [g.id, g.nombre, Number(g.pases), g.telefono, g.token, g.rsvp_estado, g.pases_confirmados === null ? null : Number(g.pases_confirmados), g.checked_in_at, g.created_at]
      );
      ok++;
    } catch (err) {
      console.error(`  ✗  ${g.nombre}: ${err.message}`);
      fail++;
    }
  }

  const { rows: countRows } = await pool.query(`select count(*)::int as n from guests`);

  console.log(`\n  ✅  ${ok} restaurados${fail > 0 ? ` · ❌ ${fail} errores` : ""}`);
  console.log(`  📊  Filas en Postgres ahora: ${countRows[0].n} (backup tenía: ${rows.length})`);
}

main()
  .catch((err) => { console.error(err); process.exitCode = 1; })
  .finally(() => pool.end());
