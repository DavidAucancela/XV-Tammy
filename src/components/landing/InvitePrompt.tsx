"use client";

import { motion } from "framer-motion";
import RevealText from "./RevealText";
import { Button } from "./Button";

export default function InvitePrompt({
  celebrant,
  calendarUrl,
}: {
  celebrant: string;
  calendarUrl: string;
}) {
  return (
    <section
      style={{
        padding: "100px 24px 120px",
        background: "var(--bg)",
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
          textAlign: "center",
        }}
      >
        <div className="ornament-divider" style={{ width: 160, marginBottom: 50 }}>
          <span>✦</span>
        </div>

        <RevealText
          tag="h2"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: "clamp(1.6rem, 5.5vw, 2.4rem)",
            fontWeight: 400,
            color: "var(--text)",
            marginBottom: 20,
            lineHeight: 1.3,
            justifyContent: "center",
          }}
        >
          ¿Tienes tu invitación?
        </RevealText>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontSize: 14,
            color: "var(--text-muted)",
            marginBottom: 44,
            lineHeight: 1.85,
            fontWeight: 300,
            maxWidth: 400,
          }}
        >
          Usa el link personalizado que recibiste para confirmar tu asistencia y
          generar tu pase digital de entrada.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.45 }}
          style={{
            borderRadius: 18,
            padding: 1,
            background:
              "linear-gradient(135deg, rgba(var(--gold-rgb),0.5), rgba(var(--accent-rgb),0.4), rgba(var(--gold-rgb),0.25))",
            marginBottom: 28,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              background: "var(--surface-elevated)",
              borderRadius: 17,
              padding: "20px 32px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-solid)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0 }}>
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            <p style={{ fontSize: 13, color: "var(--text)", letterSpacing: "0.04em" }}>
              Revisa tu WhatsApp o correo por el enlace
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.55 }}
          style={{ marginBottom: 56 }}
        >
          <Button href={calendarUrl} variant="primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2.5" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
            Agregar al calendario
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: "clamp(0.95rem, 3vw, 1.25rem)",
            fontStyle: "italic",
            color: "var(--text-muted)",
            lineHeight: 1.75,
            marginBottom: 52,
          }}
        >
          &ldquo;Que este día sea el comienzo de tus sueños más grandes&rdquo;
        </motion.p>

        <p
          style={{
            fontSize: 9,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          ✦ &nbsp; con cariño · {celebrant} y familia &nbsp; ✦
        </p>
      </motion.div>
    </section>
  );
}
