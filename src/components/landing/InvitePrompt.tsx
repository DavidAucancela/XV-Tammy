"use client";

import { motion } from "framer-motion";
import RevealText from "./RevealText";

export default function InvitePrompt({ celebrant }: { celebrant: string }) {
  return (
    <section
      style={{
        padding: "100px 24px 120px",
        background: "rgba(13, 6, 16, 0.88)",
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
            color: "#fdf0f8",
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
            color: "#a87f96",
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
              "linear-gradient(135deg, rgba(210,155,55,0.45), rgba(232,105,154,0.4), rgba(210,155,55,0.2))",
            marginBottom: 56,
            boxShadow: "0 0 40px rgba(232,105,154,0.08)",
          }}
        >
          <div
            style={{
              background: "rgba(22, 13, 30, 0.97)",
              borderRadius: 17,
              padding: "20px 32px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span aria-hidden style={{ fontSize: 18, opacity: 0.85 }}>
              ✉️
            </span>
            <p style={{ fontSize: 13, color: "#e0c0d0", letterSpacing: "0.04em" }}>
              Revisa tu WhatsApp o correo por el enlace
            </p>
          </div>
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
            color: "#8a6478",
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
            color: "#5a3a50",
          }}
        >
          ✦ &nbsp; con cariño · {celebrant} y familia &nbsp; ✦
        </p>
      </motion.div>
    </section>
  );
}
