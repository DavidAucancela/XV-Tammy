#!/usr/bin/env node
/**
 * Genera una página HTML con botones de WhatsApp para enviar un RECORDATORIO
 * del evento a los invitados CONFIRMADOS (rsvp_estado = 'confirmado').
 *
 * A diferencia de generate-whatsapp-invites.mjs (que lee guests.csv + links.txt),
 * este script lee los invitados directamente de Supabase, así refleja el estado
 * real de la BD, incluyendo confirmaciones hechas a mano.
 *
 * Uso:  node scripts/generate-whatsapp-reminder.mjs
 * Salida:  scripts/whatsapp-reminder.html
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Cargar .env manualmente (mismo patrón que scripts/seed.ts) ──────────────
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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
const CELEBRANT = process.env.NEXT_PUBLIC_CELEBRANT_NAME ?? "Tammy";
const FIRST_NAME = CELEBRANT.split(" ")[0];
const EVENT_DATE = process.env.NEXT_PUBLIC_EVENT_DATE;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌  Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env");
  process.exit(1);
}

// Datos del evento — reflejan src/data/landingContent.ts
const VENUE = "Servellón Urbina N58-143 y Víctor Hugo, Quito, Ecuador";
const DRESS_CODE = "Elegante";

const eventDate = new Date(EVENT_DATE ?? "");
const dateLabel = Number.isNaN(eventDate.getTime())
  ? ""
  : capitalize(
      new Intl.DateTimeFormat("es", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "America/Guayaquil",
      }).format(eventDate)
    );
const timeLabel = Number.isNaN(eventDate.getTime())
  ? ""
  : new Intl.DateTimeFormat("es", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Guayaquil",
    }).format(eventDate);

// ── Helpers ────────────────────────────────────────────────────────────────
function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// "FELIX FLORE" → "Felix Flore"
function toTitleCase(str) {
  return (str ?? "")
    .toLowerCase()
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// Teléfono → formato wa.me (Ecuador: 593XXXXXXXXX, sin +)
function normalizePhone(tel) {
  if (!tel) return null;
  const digits = String(tel).replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("0")) return "593" + digits.slice(1);
  if (digits.length === 9) return "593" + digits;
  if (digits.startsWith("593")) return digits;
  return null;
}

// Mensaje de recordatorio. Solo símbolos del plano básico (2 bytes UTF-8):
// los emoji de 4 bytes (🎉📅📍…) se corrompen en el handoff whatsapp:// del
// cliente de escritorio de WhatsApp en Mac.
function buildReminderMessage(guestName, inviteUrl) {
  const name = toTitleCase(guestName);
  return [
    `Hola ${name},`,
    ``,
    `✦ RECORDATORIO ✦`,
    ``,
    `Ya falta poco para los quince años de ${CELEBRANT}.`,
    ``,
    `✦ ${dateLabel}`,
    `✦ Hora: ${timeLabel}`,
    `✦ Lugar: ${VENUE}`,
    `✦ Código de vestimenta: ${DRESS_CODE}`,
    ``,
    `Tu invitación y tu pase de entrada con código QR:`,
    inviteUrl,
    ``,
    `✦ Un pedido especial: si tienes fotos junto a ${FIRST_NAME} o unas`,
    `palabras que te gustaría compartir, respóndenos por este chat.`,
    `Nos encantaría reunirlas para la celebración.`,
    ``,
    `Te esperamos ✦`,
  ].join("\n");
}

// ── Traer invitados confirmados ────────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const { data: guests, error } = await supabase
  .from("guests")
  .select("nombre, telefono, pases, pases_confirmados, token")
  .eq("rsvp_estado", "confirmado")
  .order("nombre");

if (error) {
  console.error("❌  Error consultando Supabase:", error.message);
  process.exit(1);
}

const withPhone = [];
const withoutPhone = [];

for (const g of guests ?? []) {
  const inviteUrl = `${APP_URL}/i/${g.token}`;
  const waPhone = normalizePhone(g.telefono);
  const entry = { ...g, inviteUrl, waPhone };
  (waPhone ? withPhone : withoutPhone).push(entry);
}

// ── HTML ───────────────────────────────────────────────────────────────────
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const card = (g, hasWa) => `
        <div class="guest-card">
          <div class="guest-name">${esc(toTitleCase(g.nombre))}</div>
          ${hasWa ? `<div class="guest-phone">+${esc(g.waPhone)}</div>` : ""}
          <div class="guest-pases">${g.pases_confirmados ?? g.pases} confirmado${(g.pases_confirmados ?? g.pases) > 1 ? "s" : ""}</div>
          ${
            hasWa
              ? `<a href="https://wa.me/${g.waPhone}?text=${encodeURIComponent(
                  buildReminderMessage(g.nombre, g.inviteUrl)
                )}" target="_blank" class="btn-whatsapp">Enviar recordatorio</a>`
              : ""
          }
          <button class="btn-copy" onclick="copyMsg(this)" data-msg="${esc(
            buildReminderMessage(g.nombre, g.inviteUrl)
          )}">Copiar mensaje</button>
        </div>`;

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Recordatorio XV Tammy - WhatsApp</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      background: linear-gradient(135deg, #f3e6d6 0%, #ead8c3 100%); min-height: 100vh; padding: 2rem; }
    .container { max-width: 1200px; margin: 0 auto; }
    header { text-align: center; margin-bottom: 2.5rem; }
    header h1 { font-size: 2.25rem; color: #4a372e; margin-bottom: 0.5rem; }
    header p { font-size: 1.05rem; color: #7a6355; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem; text-align: center; }
    .stat { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(43,33,28,0.1); }
    .stat-value { font-size: 2rem; font-weight: bold; color: #b4707c; }
    .stat-label { font-size: 0.9rem; color: #7a6355; margin-top: 0.5rem; }
    .preview { background: #fff9f0; border-left: 4px solid #b4707c; padding: 1.25rem 1.5rem; border-radius: 4px;
      color: #4a372e; font-size: 0.9rem; white-space: pre-wrap; line-height: 1.6; margin-bottom: 2rem; }
    .section { margin-bottom: 3rem; }
    .section-title { font-size: 1.4rem; color: #4a372e; margin-bottom: 1.25rem; padding-bottom: 0.5rem; border-bottom: 2px solid #dcc7ae; }
    .note { background: #fff9f0; border-left: 4px solid #b4707c; padding: 1rem; border-radius: 4px; color: #4a372e; font-size: 0.95rem; }
    .guests-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
    .guest-card { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 12px rgba(43,33,28,0.08); }
    .guest-name { font-size: 1.1rem; font-weight: 600; color: #4a372e; margin-bottom: 0.5rem; }
    .guest-phone { font-size: 0.95rem; color: #7a6355; margin-bottom: 0.5rem; font-family: monospace; word-break: break-all; }
    .guest-pases { font-size: 0.9rem; color: #7a6355; margin-bottom: 1rem; }
    .btn-whatsapp { display: block; width: 100%; padding: 0.75rem; background: #25d366; color: white; text-align: center;
      text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 0.95rem; }
    .btn-whatsapp:hover { background: #20ba5a; }
    .btn-copy { display: block; width: 100%; padding: 0.5rem 1rem; margin-top: 0.5rem; background: #dcc7ae; color: #4a372e;
      text-align: center; border-radius: 4px; font-weight: 500; font-size: 0.85rem; cursor: pointer; border: none; }
    .btn-copy:hover { background: #c9b69a; }
    footer { text-align: center; color: #7a6355; font-size: 0.9rem; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #dcc7ae; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Recordatorio · XV de ${esc(CELEBRANT)}</h1>
      <p>Mensaje de recordatorio para invitados confirmados</p>
    </header>

    <div class="stats">
      <div class="stat"><div class="stat-value">${(guests ?? []).length}</div><div class="stat-label">Confirmados</div></div>
      <div class="stat"><div class="stat-value">${withPhone.length}</div><div class="stat-label">Con WhatsApp</div></div>
      <div class="stat"><div class="stat-value">${withoutPhone.length}</div><div class="stat-label">Sin teléfono</div></div>
    </div>

    <div class="preview">${esc(buildReminderMessage("Nombre Invitado", `${APP_URL}/i/TOKEN`))}</div>

    ${
      withPhone.length
        ? `<div class="section">
      <h2 class="section-title">Con WhatsApp (${withPhone.length})</h2>
      <div class="note">Haz clic en "Enviar recordatorio" para abrir WhatsApp con el número y el mensaje listos. Revisa antes de enviar.</div>
      <div class="guests-grid">${withPhone.map((g) => card(g, true)).join("")}</div>
    </div>`
        : ""
    }

    ${
      withoutPhone.length
        ? `<div class="section">
      <h2 class="section-title">Sin teléfono (${withoutPhone.length})</h2>
      <div class="note">Sin número de WhatsApp registrado. Copia el mensaje y envíalo manualmente.</div>
      <div class="guests-grid">${withoutPhone.map((g) => card(g, false)).join("")}</div>
    </div>`
        : ""
    }

    <footer><p>Generado ${new Date().toLocaleString("es-EC")} · Evento: ${esc(dateLabel)}</p></footer>
  </div>
  <script>
    function copyMsg(btn) {
      navigator.clipboard.writeText(btn.dataset.msg).then(() => {
        const t = btn.textContent; btn.textContent = "Copiado";
        setTimeout(() => (btn.textContent = t), 1500);
      });
    }
  </script>
</body>
</html>
`;

const outputPath = path.join(__dirname, "whatsapp-reminder.html");
fs.writeFileSync(outputPath, htmlContent, "utf-8");

console.log(`\n✓ Página generada: ${outputPath}\n`);
console.log(`📊 Resumen:`);
console.log(`  • Confirmados:   ${(guests ?? []).length}`);
console.log(`  • Con WhatsApp:  ${withPhone.length}`);
console.log(`  • Sin teléfono:  ${withoutPhone.length}`);
if (withoutPhone.length) {
  console.log(`\n  Sin teléfono: ${withoutPhone.map((g) => toTitleCase(g.nombre)).join(", ")}`);
}
console.log(`\n💡 Ábrela con:  open ${outputPath}\n`);
