"use client";

import { motion } from "framer-motion";
import RevealText from "./RevealText";

export default function InvitePrompt({ celebrant }: { celebrant: string }) {
  return (
    <section
      style={{
        padding: "100px 24px 120px",
        background: "rgba(13, 6, 16, 0.88)",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: 480, margin: "0 auto" }}
      >
        <div
          style={{
            width: 60,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #e8699a, transparent)",
            margin: "0 auto 50px",
          }}
        />

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
            color: "#7a5870",
            marginBottom: 44,
            lineHeight: 1.85,
            fontWeight: 300,
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
            background: "rgba(22, 13, 30, 0.95)",
            border: "1px solid #251535",
            borderRadius: 18,
            padding: "20px 30px",
            display: "inline-block",
            marginBottom: 56,
            boxShadow: "0 0 40px rgba(232,105,154,0.07)",
          }}
        >
          <p style={{ fontSize: 13, color: "#c9a0b8", letterSpacing: "0.04em" }}>
            Revisa tu WhatsApp o correo por el enlace ✉️
          </p>
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
            color: "#4a2a3e",
            lineHeight: 1.75,
            marginBottom: 52,
          }}
        >
          "Que este día sea el comienzo de tus sueños más grandes"
        </motion.p>

        <p
          style={{
            fontSize: 9,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#2a1535",
          }}
        >
          ✦ &nbsp; con cariño · {celebrant} y familia &nbsp; ✦
        </p>
      </motion.div>
    </section>
  );
}
