/**
 * Carga invitados desde scripts/guests.csv a Postgres y genera los links.
 * Uso: npm run seed
 * Flags: --dry-run (preview sin insertar)
 */
import { Pool } from "pg";
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
const DATABASE_URL = process.env.DATABASE_URL;
const APP_URL      = process.env.NEXT_PUBLIC_APP_URL ?? "https://tu-app.railway.app";

if (!DATABASE_URL) {
  console.error("❌  Falta DATABASE_URL en .env");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });
const isDryRun = process.argv.includes("--dry-run");

// ── Leer CSV ───────────────────────────────────────────────────────────────
const csvPath = resolve(process.cwd(), "scripts/guests.csv");
if (!existsSync(csvPath)) {
  console.error("❌  No encontré scripts/guests.csv");
  console.error("    Copiá scripts/guests.example.csv como guests.csv y completalo.");
  process.exit(1);
}

type GuestRow = { nombre: string; pases: number; telefono: string | null; token: string };

// Normaliza para comparar nombres entre CSV y Supabase — colapsa espacios
// dobles/internos además de trim+lowercase, para no crear duplicados por
// un typo de espaciado (ej. "JHORDYAN  SANCHEZ" vs "JHORDYAN SANCHEZ").
function normalizeName(str: string) {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

const rows: GuestRow[] = readFileSync(csvPath, "utf-8")
  .split("\n")
  .map(l => l.trim())
  .filter(l => l && !l.startsWith("#") && !l.toLowerCase().startsWith("nombre"))
  .map(line => {
    const [nombre, pasesStr, telefonoStr] = line.split(",").map(s => s.trim());
    if (!nombre) return null;
    const pases = parseInt(pasesStr ?? "1", 10);
    // Solo dígitos — /api/invitacion busca por los últimos 9, sin formato
    const telefono = (telefonoStr ?? "").replace(/\D/g, "") || null;
    return { nombre, pases: isNaN(pases) || pases < 1 ? 1 : pases, telefono, token: randomUUID() };
  })
  .filter(Boolean) as GuestRow[];

if (rows.length === 0) {
  console.error("❌  El CSV está vacío o mal formateado.");
  process.exit(1);
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n✦  XV Tammy — Seed de invitados`);
  console.log(`   ${rows.length} invitados en el CSV | ${isDryRun ? "DRY RUN (sin insertar)" : "modo real"}\n`);

  // Invitados que ya existen en la DB: se actualizan (pases/teléfono) en
  // vez de re-insertarse — así el CSV es la fuente de verdad y se puede
  // editar y re-correr el seed sin duplicar ni perder token/RSVP/check-in.
  type ExistingGuest = { id: string; nombre: string; token: string; pases: number; telefono: string | null };
  let existingGuests: ExistingGuest[];
  try {
    const { rows } = await pool.query<ExistingGuest>(`select id, nombre, token, pases, telefono from guests`);
    existingGuests = rows;
  } catch (err) {
    console.error(`❌  No pude leer invitados existentes: ${(err as Error).message}`);
    process.exit(1);
  }
  const existingByName = new Map(
    existingGuests.map(g => [normalizeName(g.nombre), g])
  );

  const lines: string[] = [];
  let inserted = 0;
  let updated = 0;
  let unchanged = 0;
  let fail = 0;

  for (const guest of rows) {
    const existing = existingByName.get(normalizeName(guest.nombre));

    if (existing) {
      const existingLink = `${APP_URL}/i/${existing.token}`;
      const changed = existing.pases !== guest.pases || existing.telefono !== guest.telefono;

      if (!changed) {
        console.log(`  ·  ${guest.nombre.padEnd(30)} sin cambios  →  ${existingLink}`);
        lines.push(`${guest.nombre}\t${existingLink}`);
        unchanged++;
        continue;
      }

      if (isDryRun) {
        console.log(
          `  ↻  ${guest.nombre.padEnd(30)} ${existing.pases}p → ${guest.pases}p  →  ${existingLink}`
        );
        lines.push(`${guest.nombre}\t${existingLink}`);
        continue;
      }

      try {
        await pool.query(`update guests set pases = $2, telefono = $3 where id = $1`, [
          existing.id, guest.pases, guest.telefono,
        ]);
        console.log(
          `  ↻  ${guest.nombre.padEnd(30)} ${existing.pases}p → ${guest.pases}p  →  ${existingLink}`
        );
        lines.push(`${guest.nombre}\t${existingLink}`);
        updated++;
      } catch (err) {
        console.error(`  ✗  ${guest.nombre}: ${(err as Error).message}`);
        fail++;
      }
      continue;
    }

    // Invitado nuevo — no está en la DB todavía.
    const link = `${APP_URL}/i/${guest.token}`;

    if (isDryRun) {
      console.log(`  ○  ${guest.nombre.padEnd(30)} ${guest.pases}p (nuevo)  →  ${link}`);
      lines.push(`${guest.nombre}\t${link}`);
      continue;
    }

    try {
      await pool.query(
        `insert into guests (nombre, pases, telefono, token) values ($1, $2, $3, $4)`,
        [guest.nombre, guest.pases, guest.telefono, guest.token]
      );
      console.log(`  ✓  ${guest.nombre.padEnd(30)} ${guest.pases}p (nuevo)  →  ${link}`);
      lines.push(`${guest.nombre}\t${link}`);
      inserted++;
    } catch (err) {
      console.error(`  ✗  ${guest.nombre}: ${(err as Error).message}`);
      fail++;
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
    console.log(
      `\n  ✅  ${inserted} nuevos · ↻ ${updated} actualizados · · ${unchanged} sin cambios${fail > 0 ? ` · ❌ ${fail} errores` : ""}`
    );
  }

  console.log("\n  Enviá cada link por WhatsApp al invitado correspondiente.\n");
}

main()
  .catch(err => { console.error(err); process.exit(1); })
  .finally(() => pool.end());
