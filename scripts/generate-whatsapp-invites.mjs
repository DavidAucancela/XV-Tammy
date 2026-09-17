#!/usr/bin/env node
/**
 * Genera una página HTML con botones de WhatsApp para cada invitado.
 * Lee guests.csv y links.txt, genera whatsapp-invites.html
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Leer guests.csv
const guestsCsv = fs.readFileSync(path.join(__dirname, "guests.csv"), "utf-8");
const guestLines = guestsCsv
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.toLowerCase().startsWith("nombre"));

const guests = guestLines.map((line) => {
  const [nombre, pases, telefono] = line.split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
  return { nombre, pases: parseInt(pases || "1", 10), telefono };
});

// Leer links.txt
const linksText = fs.readFileSync(path.join(__dirname, "links.txt"), "utf-8");
const links = {};

linksText.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed.startsWith("https://")) {
    // La línea anterior debe ser el nombre
    const prevLine = linksText
      .substring(0, linksText.indexOf(trimmed))
      .trim()
      .split("\n")
      .pop();
    if (prevLine && !prevLine.startsWith("https://")) {
      links[prevLine] = trimmed;
    }
  }
});

// Normalizar teléfono a wa.me format (Ecuador: +593xxxxxxxxx)
function normalizePhone(tel) {
  if (!tel) return null;
  const digits = tel.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("0")) {
    // Local format: 0991234567 → +5939912345567
    return "593" + digits.substring(1);
  } else if (digits.length === 9) {
    // Missing 0: 991234567 → +5939912345567
    return "593" + digits;
  } else if (digits.startsWith("593")) {
    // Already international
    return digits;
  }
  return null;
}

// "FELIX FLORE" → "Felix Flore" (nombre del CSV está en mayúsculas)
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// Generar mensaje
function generateMessage(guestName, invitationLink) {
  const name = toTitleCase(guestName);
  // Solo símbolos del plano básico (2 bytes UTF-8) — los emoji de 4 bytes
  // (🎉📅📍, etc.) se corrompen al pasar por el handoff whatsapp:// del
  // cliente de escritorio de WhatsApp en Mac.
  return `Hola ${name},\n\n✦ QUINCE AÑOS ✦\n\nTammy Maguana Sánchez\nte invita a celebrar su llegada a los quince años\n\n✦ 19 de septiembre de 2026\n✦ Hora: 19:00\n✦ Lugar: Servellón Urbina N58-143 y Víctor Hugo, Quito, Ecuador\n\nAccede a tu invitación personalizada:\n${invitationLink}\n\n✓ Se solicita confirmación de asistencia\n✦ Código de vestimenta: Formal`;
}

// Generar HTML
const withPhone = [];
const withoutPhone = [];

guests.forEach((guest) => {
  const link = links[guest.nombre] || null;
  const waPhone = normalizePhone(guest.telefono);

  if (waPhone && link) {
    withPhone.push({ ...guest, invitationLink: link, waPhone });
  } else {
    withoutPhone.push({ ...guest, invitationLink: link });
  }
});

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Invitaciones XV Tammy - WhatsApp</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      background: linear-gradient(135deg, #f3e6d6 0%, #ead8c3 100%);
      min-height: 100vh;
      padding: 2rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    header {
      text-align: center;
      margin-bottom: 3rem;
    }
    header h1 {
      font-size: 2.5rem;
      color: #4a372e;
      margin-bottom: 0.5rem;
    }
    header p {
      font-size: 1.1rem;
      color: #7a6355;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
      text-align: center;
    }
    .stat {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(43, 33, 28, 0.1);
    }
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #b4707c;
    }
    .stat-label {
      font-size: 0.9rem;
      color: #7a6355;
      margin-top: 0.5rem;
    }
    .section {
      margin-bottom: 3rem;
    }
    .section-title {
      font-size: 1.5rem;
      color: #4a372e;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #dcc7ae;
    }
    .guests-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .guest-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(43, 33, 28, 0.08);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .guest-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(43, 33, 28, 0.12);
    }
    .guest-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: #4a372e;
      margin-bottom: 0.5rem;
    }
    .guest-phone {
      font-size: 0.95rem;
      color: #7a6355;
      margin-bottom: 0.5rem;
      font-family: monospace;
      word-break: break-all;
    }
    .guest-pases {
      font-size: 0.9rem;
      color: #7a6355;
      margin-bottom: 1rem;
    }
    .btn-whatsapp {
      display: inline-block;
      width: 100%;
      padding: 0.75rem;
      background: #25d366;
      color: white;
      text-align: center;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      transition: background 0.2s;
      font-size: 0.95rem;
    }
    .btn-whatsapp:hover {
      background: #20ba5a;
    }
    .btn-copy {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: #dcc7ae;
      color: #4a372e;
      text-align: center;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      font-size: 0.85rem;
      cursor: pointer;
      border: none;
      margin-top: 0.5rem;
      width: 100%;
      transition: background 0.2s;
    }
    .btn-copy:hover {
      background: #c9b69a;
    }
    .note {
      background: #fff9f0;
      border-left: 4px solid #b4707c;
      padding: 1rem;
      border-radius: 4px;
      color: #4a372e;
      font-size: 0.95rem;
    }
    footer {
      text-align: center;
      color: #7a6355;
      font-size: 0.9rem;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid #dcc7ae;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🎉 XV Años de Tammy</h1>
      <p>Generador de invitaciones por WhatsApp</p>
    </header>

    <div class="stats">
      <div class="stat">
        <div class="stat-value">${guests.length}</div>
        <div class="stat-label">Total de invitados</div>
      </div>
      <div class="stat">
        <div class="stat-value">${withPhone.length}</div>
        <div class="stat-label">Con teléfono</div>
      </div>
      <div class="stat">
        <div class="stat-value">${withoutPhone.length}</div>
        <div class="stat-label">Sin teléfono</div>
      </div>
    </div>

    ${
      withPhone.length > 0
        ? `
    <div class="section">
      <h2 class="section-title">✅ Invitados (${withPhone.length})</h2>
      <div class="note">
        💡 Haz clic en "Enviar por WhatsApp" para abrir WhatsApp Web/App con el mensaje y número listos.
        Revisa el mensaje antes de enviar.
      </div>
      <div class="guests-grid" style="margin-top: 1.5rem;">
        ${withPhone
          .map(
            (guest) => `
        <div class="guest-card">
          <div class="guest-name">${toTitleCase(guest.nombre)}</div>
          <div class="guest-phone">📱 +${guest.waPhone}</div>
          <div class="guest-pases">${guest.pases} pase${guest.pases > 1 ? "s" : ""}</div>
          <a
            href="https://wa.me/${guest.waPhone}?text=${encodeURIComponent(generateMessage(guest.nombre, guest.invitationLink))}"
            target="_blank"
            class="btn-whatsapp"
          >
            ✓ Enviar por WhatsApp
          </a>
          <button
            class="btn-copy"
            onclick="copyToClipboard('${guest.invitationLink}')"
          >
            📋 Copiar link
          </button>
        </div>
        `
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    ${
      withoutPhone.length > 0
        ? `
    <div class="section">
      <h2 class="section-title">⚠️ Sin teléfono (${withoutPhone.length})</h2>
      <div class="note">
        Estos invitados no tienen número de WhatsApp registrado. Puedes copiar su enlace y enviarlo manualmente.
      </div>
      <div class="guests-grid" style="margin-top: 1.5rem;">
        ${withoutPhone
          .map(
            (guest) => `
        <div class="guest-card">
          <div class="guest-name">${toTitleCase(guest.nombre)}</div>
          <div class="guest-pases">${guest.pases} pase${guest.pases > 1 ? "s" : ""}</div>
          <button
            class="btn-copy"
            onclick="copyToClipboard('${guest.invitationLink || "sin enlace"}')"
          >
            📋 Copiar link
          </button>
        </div>
        `
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    <footer>
      <p>Generado automáticamente • Evento: 19 de septiembre de 2026</p>
    </footer>
  </div>

  <script>
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        alert("✓ Enlace copiado al portapapeles");
      }).catch(err => {
        console.error("Error al copiar:", err);
      });
    }
  </script>
</body>
</html>
`;

// Guardar archivo
const outputPath = path.join(__dirname, "whatsapp-invites.html");
fs.writeFileSync(outputPath, htmlContent, "utf-8");

console.log(
  `\n✓ Página generada: ${outputPath}\n`
);
console.log(`📊 Resumen:`);
console.log(`  • Total de invitados: ${guests.length}`);
console.log(`  • Con teléfono: ${withPhone.length}`);
console.log(`  • Sin teléfono: ${withoutPhone.length}`);
console.log(`\n💡 Abre el archivo en tu navegador: open ${outputPath}\n`);
