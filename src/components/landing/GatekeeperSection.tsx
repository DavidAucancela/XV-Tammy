"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GatekeeperSectionProps {
  eventDate: string;
  adminPreview: boolean;
  sections: "gallery" | "familia";
  children: ReactNode;
}

export default function GatekeeperSection({
  eventDate,
  adminPreview,
  sections,
  children,
}: GatekeeperSectionProps) {
  const now = new Date();
  const event = new Date(eventDate);

  // Validación de fecha
  if (Number.isNaN(event.getTime())) {
    console.error(`Invalid event date: ${eventDate}`);
    return <>{children}</>;
  }

  const isEventHere = now >= event;
  const canAccess = isEventHere || adminPreview;

  if (canAccess) {
    return <>{children}</>;
  }

  // Formatear tiempo restante
  const diff = Math.max(0, event.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const sectionLabel = sections === "gallery" ? "galería y recuerdos" : "mensajes de familia";

  return (
    <section
      style={{
        padding: "120px 24px",
        background: "#F3E6D6",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          maxWidth: 480,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div className="ornament-divider" style={{ width: 160 }}>
          <span>✦</span>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: "clamp(1.6rem, 5.5vw, 2.4rem)",
            fontWeight: 400,
            color: "#4A372E",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {sections === "gallery"
            ? "Mi crecimiento"
            : "Mensajes de la familia"}
        </h2>

        <p
          style={{
            fontSize: 14,
            color: "#7A6355",
            lineHeight: 1.85,
            fontWeight: 300,
            maxWidth: 400,
            margin: 0,
          }}
        >
          Esta sección estará disponible a partir del día del evento.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            borderRadius: 18,
            padding: 1,
            background:
              "linear-gradient(135deg, rgba(var(--gold-rgb),0.5), rgba(var(--accent-rgb),0.4), rgba(var(--gold-rgb),0.25))",
            marginTop: 12,
          }}
        >
          <div
            style={{
              background: "rgba(252,246,236,0.85)",
              borderRadius: 17,
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#7A6355",
                margin: 0,
              }}
            >
              Tiempo faltante
            </p>

            <div
              style={{
                display: "flex",
                gap: "clamp(12px, 3vw, 20px)",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: 32,
                    fontWeight: 300,
                    color: "#B4707C",
                  }}
                >
                  {String(days)}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#7A6355",
                  }}
                >
                  días
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: 32,
                    fontWeight: 300,
                    color: "#B4707C",
                  }}
                >
                  {String(hours)}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#7A6355",
                  }}
                >
                  horas
                </span>
              </div>
            </div>

            <p
              style={{
                fontSize: 11,
                color: "#7A6355",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              ¡Pronto podrás ver todos los {sectionLabel}!
            </p>
          </div>
        </motion.div>

        <p
          style={{
            fontSize: 9,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#7A6355",
            margin: 0,
          }}
        >
          ✦ &nbsp; con cariño &nbsp; ✦
        </p>
      </motion.div>
    </section>
  );
}
