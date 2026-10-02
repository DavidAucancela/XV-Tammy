#!/usr/bin/env node
/**
 * Genera una página HTML con botones de WhatsApp para enviar un RECORDATORIO
 * del evento a los invitados CONFIRMADOS (rsvp_estado = 'confirmado').
 *
 * A diferencia de generate-whatsapp-invites.mjs (que lee guests.csv + links.txt),
 * este script lee los invitados directamente de Postgres, así refleja el estado
 * real de la BD, incluyendo confirmaciones hechas a mano.
 *
 * Uso:  node scripts/generate-whatsapp-reminder.mjs
 * Salida:  scripts/whatsapp-reminder.html
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";

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

const DATABASE_URL = process.env.DATABASE_URL;
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
const CELEBRANT = process.env.NEXT_PUBLIC_CELEBRANT_NAME ?? "Tammy";
const FIRST_NAME = CELEBRANT.split(" ")[0];
const EVENT_DATE = process.env.NEXT_PUBLIC_EVENT_DATE;

if (!DATABASE_URL) {
  console.error("❌  Falta DATABASE_URL en .env");
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

// Alias del invitado = solo su primer nombre ("FELIX FLORE" → "Felix")
function alias(str) {
  return toTitleCase(str).split(" ")[0];
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
  return [
    `Hola ${alias(guestName)},`,
    ``,
    `✦ RECORDATORIO ✦`,
    ``,
    `Ya falta poco para los quince años de ${FIRST_NAME}.`,
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
const pool = new Pool({ connectionString: DATABASE_URL });

let guests;
try {
  const { rows } = await pool.query(
    `select nombre, telefono, pases, pases_confirmados, token
     from guests where rsvp_estado = 'confirmado' order by nombre`
  );
  guests = rows;
} catch (err) {
  console.error("❌  Error consultando la base de datos:", err.message);
  process.exit(1);
} finally {
  await pool.end();
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
        <div class="guest-card" data-id="${esc(g.token)}">
          <div class="badges"><span class="badge badge-rsvp">Confirmado</span><span class="badge badge-sent">Pendiente de enviar</span></div>
          <div class="guest-name">${esc(toTitleCase(g.nombre))}</div>
          ${hasWa ? `<div class="guest-phone">+${esc(g.waPhone)}</div>` : ""}
          <div class="guest-pases">${g.pases_confirmados ?? g.pases} confirmado${(g.pases_confirmados ?? g.pases) > 1 ? "s" : ""}</div>
          ${
            hasWa
              ? `<a href="https://wa.me/${g.waPhone}?text=${encodeURIComponent(
                  buildReminderMessage(g.nombre, g.inviteUrl)
                )}" target="_blank" class="btn-whatsapp" onclick="markSent(this)">Enviar recordatorio</a>`
              : ""
          }
          <button class="btn-copy" onclick="copyMsg(this)" data-msg="${esc(
            buildReminderMessage(g.nombre, g.inviteUrl)
          )}">Copiar mensaje</button>
          <button class="btn-sent" onclick="toggleSent(this)">Marcar como enviado</button>
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
    .badges { display: flex; gap: 0.4rem; margin-bottom: 0.6rem; flex-wrap: wrap; }
    .badge { font-size: 0.72rem; font-weight: 600; padding: 0.2rem 0.55rem; border-radius: 999px; }
    .badge-rsvp { background: #e6f3e6; color: #2f6b34; }
    .badge-sent { background: #f6e3e6; color: #8f4e5f; }
    .guest-card.sent { opacity: 0.6; }
    .guest-card.sent .badge-sent { background: #dff0ff; color: #1f5f99; }
    .btn-sent { display: block; width: 100%; padding: 0.5rem 1rem; margin-top: 0.5rem; background: transparent; color: #7a6355;
      border: 1px dashed #c9b69a; border-radius: 4px; font-size: 0.85rem; cursor: pointer; }
    .filters { display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .filters button { padding: 0.5rem 1rem; border-radius: 999px; border: 1px solid #c9b69a; background: white; color: #4a372e; cursor: pointer; }
    .filters button.active { background: #b4707c; color: white; border-color: #b4707c; }
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
      <div class="stat"><div class="stat-value" id="sentCount">0</div><div class="stat-label">Enviados</div></div>
      <div class="stat"><div class="stat-value" id="pendingCount">0</div><div class="stat-label">Por enviar</div></div>
    </div>

    <div class="filters">
      <button data-f="all" class="active">Todos</button>
      <button data-f="pending">Por enviar</button>
      <button data-f="sent">Enviados</button>
      <button id="resetSent">Reiniciar estados</button>
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
    const KEY = "xv-reminder-sent";
    let sent = {};
    try { sent = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch {}
    let filter = "all";
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(sent)); } catch {} };
    function render() {
      const cards = [...document.querySelectorAll(".guest-card")];
      let n = 0;
      cards.forEach((c) => {
        const isSent = !!sent[c.dataset.id];
        if (isSent) n++;
        c.classList.toggle("sent", isSent);
        c.querySelector(".badge-sent").textContent = isSent ? "Enviado" : "Pendiente de enviar";
        c.querySelector(".btn-sent").textContent = isSent ? "Desmarcar enviado" : "Marcar como enviado";
        c.style.display = filter === "all" || (filter === "sent") === isSent ? "" : "none";
      });
      document.getElementById("sentCount").textContent = n;
      document.getElementById("pendingCount").textContent = cards.length - n;
    }
    function markSent(a) { sent[a.closest(".guest-card").dataset.id] = Date.now(); save(); render(); }
    function toggleSent(b) {
      const id = b.closest(".guest-card").dataset.id;
      if (sent[id]) delete sent[id]; else sent[id] = Date.now();
      save(); render();
    }
    function copyMsg(btn) {
      navigator.clipboard.writeText(btn.dataset.msg).then(() => {
        const t = btn.textContent; btn.textContent = "Copiado";
        setTimeout(() => (btn.textContent = t), 1500);
      });
    }
    document.querySelectorAll(".filters button[data-f]").forEach((b) => b.addEventListener("click", () => {
      filter = b.dataset.f;
      document.querySelectorAll(".filters button[data-f]").forEach((x) => x.classList.toggle("active", x === b));
      render();
    }));
    document.getElementById("resetSent").addEventListener("click", () => {
      if (confirm("¿Reiniciar todos los estados de envío?")) { sent = {}; save(); render(); }
    });
    render();
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
