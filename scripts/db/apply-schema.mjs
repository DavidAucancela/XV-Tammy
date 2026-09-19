#!/usr/bin/env node
/**
 * Aplica scripts/db/schema.sql contra DATABASE_URL.
 * Uso: npm run db:migrate
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

if (!process.env.DATABASE_URL) {
  console.error("❌  Falta DATABASE_URL en .env");
  process.exit(1);
}

const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  await pool.query(schema);
  console.log("✓  Schema aplicado");
} catch (err) {
  console.error("❌  Error aplicando el schema:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
