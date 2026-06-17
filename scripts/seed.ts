/**
 * Carga invitados desde scripts/guests.csv a Supabase y genera los links.
 * Uso: npm run seed
 * Flags: --dry-run (preview sin insertar)
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { randomUUID } from "crypto";

// ── Cargar .env manualmente (no requiere dotenv) ───────────────────────────
const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  readFileSync(envPath, "utf-8")
    .split("\n")
    .forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const idx = trimmed.indexOf("=");
      if (idx === -1) return;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (key && !process.env[key]) process.env[key] = val;
    });
}

// ── Validar env ────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_URL      = process.env.NEXT_PUBLIC_APP_URL ?? "https://tu-app.railway.app";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌  Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const isDryRun = process.argv.includes("--dry-run");

// ── Leer CSV ───────────────────────────────────────────────────────────────
const csvPath = resolve(process.cwd(), "scripts/guests.csv");
if (!existsSync(csvPath)) {
  console.error("❌  No encontré scripts/guests.csv");
  console.error("    Copiá scripts/guests.example.csv como guests.csv y completalo.");
  process.exit(1);
}

type GuestRow = { nombre: string; pases: number; token: string };

const rows: GuestRow[] = readFileSync(csvPath, "utf-8")
  .split("\n")
  .map(l => l.trim())
  .filter(l => l && !l.startsWith("#") && !l.toLowerCase().startsWith("nombre"))
  .map(line => {
    const [nombre, pasesStr] = line.split(",").map(s => s.trim());
    if (!nombre) return null;
    const pases = parseInt(pasesStr ?? "1", 10);
    return { nombre, pases: isNaN(pases) || pases < 1 ? 1 : pases, token: randomUUID() };
  })
  .filter(Boolean) as GuestRow[];

if (rows.length === 0) {
  console.error("❌  El CSV está vacío o mal formateado.");
  process.exit(1);
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n✦  XV Tammy — Seed de invitados`);
  console.log(`   ${rows.length} invitados | ${isDryRun ? "DRY RUN (sin insertar)" : "modo real"}\n`);

  const lines: string[] = [];
  let ok = 0;
  let fail = 0;

  for (const guest of rows) {
    const link = `${APP_URL}/i/${guest.token}`;

    if (isDryRun) {
      console.log(`  ○  ${guest.nombre.padEnd(30)} ${guest.pases}p  →  ${link}`);
      lines.push(`${guest.nombre}\t${link}`);
      continue;
    }

    const { error } = await supabase.from("guests").insert({
      nombre: guest.nombre,
      pases:  guest.pases,
      token:  guest.token,
    });

    if (error) {
      console.error(`  ✗  ${guest.nombre}: ${error.message}`);
      fail++;
    } else {
      console.log(`  ✓  ${guest.nombre.padEnd(30)} ${guest.pases}p  →  ${link}`);
      lines.push(`${guest.nombre}\t${link}`);
      ok++;
    }
  }

  // ── Guardar links ──────────────────────────────────────────────────────
  if (lines.length > 0) {
    const out = [
      `XV Tammy — Links de invitación`,
      `Generado: ${new Date().toLocaleString("es")}`,
      "",
      ...lines.map(l => {
        const [nombre, link] = l.split("\t");
        return `${nombre}\n${link}\n`;
      }),
    ].join("\n");

    const outPath = resolve(process.cwd(), "scripts/links.txt");
    writeFileSync(outPath, out, "utf-8");
    console.log(`\n  📄  Links guardados en scripts/links.txt`);
  }

  if (!isDryRun) {
    console.log(`\n  ✅  ${ok} insertados${fail > 0 ? ` · ❌ ${fail} errores` : ""}`);
  }

  console.log("\n  Enviá cada link por WhatsApp al invitado correspondiente.\n");
}

main().catch(err => { console.error(err); process.exit(1); });
