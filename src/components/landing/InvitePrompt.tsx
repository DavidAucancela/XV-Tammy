"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [telefono, setTelefono] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const buscar = async () => {
    if (status === "loading") return;
    const digits = telefono.replace(/\D/g, "");
    if (digits.length < 9) {
      setStatus("error");
      setErrorMsg("Escribe tu número completo (ej: 0991234567)");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/invitacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefono }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(
          res.status === 404
            ? "No encontramos una invitación con ese número. Verifica que sea el celular donde recibiste el WhatsApp."
            : "Algo salió mal, inténtalo de nuevo."
        );
        return;
      }
      router.push(`/i/${data.token}`);
    } catch {
      setStatus("error");
      setErrorMsg("Algo salió mal, inténtalo de nuevo.");
    }
  };

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
          Tu invitación llega por WhatsApp. Ingresa el número de celular donde la
          recibiste y abre tu pase de entrada con código QR.
        </motion.p>

        <motion.form
          onSubmit={(e) => {
            e.preventDefault();
            buscar();
          }}
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
            width: "100%",
            maxWidth: 420,
          }}
        >
          <div
            style={{
              background: "var(--surface-elevated)",
              borderRadius: 17,
              padding: "24px 26px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <label
              htmlFor="telefono-invitacion"
              style={{
                fontSize: 10,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "var(--accent-ink)",
                textAlign: "left",
              }}
            >
              Número de celular
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-solid)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0 }}>
                <rect x="7" y="2" width="10" height="20" rx="2.5" />
                <path d="M11 18h2" />
              </svg>
              <input
                id="telefono-invitacion"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0991234567"
                value={telefono}
                onChange={(e) => {
                  setTelefono(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                style={{
                  flex: 1,
                  minWidth: 0,
                  minHeight: 44,
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--ivory)",
                  color: "var(--text)",
                  fontSize: 16,
                  letterSpacing: "0.06em",
                  outline: "none",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>
            {status === "error" && (
              <p
                role="alert"
                style={{
                  fontSize: 12.5,
                  color: "var(--accent-ink)",
                  textAlign: "left",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {errorMsg}
              </p>
            )}
            <Button variant="primary" style={{ justifyContent: "center", opacity: status === "loading" ? 0.7 : 1 }}>
              {status === "loading" ? "Buscando…" : "Ver mi invitación"}
            </Button>
          </div>
        </motion.form>

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
