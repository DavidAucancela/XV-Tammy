"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import RevealText from "./RevealText";
import { Button } from "./Button";
import LiquidButton from "./LiquidButton";

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
  const [shake, setShake] = useState(false);

  // Validación en tiempo real
  const digits = telefono.replace(/\D/g, "");
  const isValidLength = digits.length >= 10;
  const canSubmit = isValidLength && status !== "loading";
  const validationMsg =
    digits.length === 0
      ? ""
      : digits.length < 10
        ? `${digits.length}/10 dígitos`
        : "✓ Número válido";

  const buscar = async () => {
    if (status === "loading" || !isValidLength) {
      setStatus("error");
      setErrorMsg("Escribe tu número completo (ej: 0991234567)");
      setShake(true);
      setTimeout(() => setShake(false), 500);
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
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
      router.push(`/i/${data.token}`);
    } catch {
      setStatus("error");
      setErrorMsg("Algo salió mal, inténtalo de nuevo.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
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
          animate={shake ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
          transition={shake ? { duration: 0.4 } : { duration: 0.55, delay: 0.45 }}
          style={{
            borderRadius: 18,
            padding: 1,
            background:
              status === "error"
                ? "linear-gradient(135deg, rgba(200,85,85,0.3), rgba(200,85,85,0.2))"
                : isValidLength
                  ? "linear-gradient(135deg, rgba(var(--gold-rgb),0.6), rgba(var(--accent-rgb),0.5))"
                  : "linear-gradient(135deg, rgba(var(--gold-rgb),0.5), rgba(var(--accent-rgb),0.4), rgba(var(--gold-rgb),0.25))",
            marginBottom: 28,
            boxShadow: status === "error" ? "0 0 16px rgba(200,85,85,0.25)" : "var(--shadow-sm)",
            width: "100%",
            maxWidth: 420,
            transition: "all 0.3s ease",
          }}
        >
          <motion.div
            animate={{
              background:
                status === "error"
                  ? "rgba(255,240,240,0.95)"
                  : "var(--surface-elevated)",
            }}
            transition={{ duration: 0.3 }}
            style={{
              borderRadius: 17,
              padding: "24px 26px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label
                htmlFor="telefono-invitacion"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: status === "error" ? "#C85555" : "var(--accent-ink)",
                  textAlign: "left",
                  transition: "color 0.3s ease",
                }}
              >
                Número de celular
              </label>
              {digits.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    color: isValidLength ? "#5A9F6A" : "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  {validationMsg}
                </motion.span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <motion.svg
                animate={{
                  stroke:
                    status === "error"
                      ? "#C85555"
                      : isValidLength
                        ? "#5A9F6A"
                        : "var(--gold-solid)",
                }}
                transition={{ duration: 0.3 }}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                style={{ flexShrink: 0 }}
              >
                <rect x="7" y="2" width="10" height="20" rx="2.5" />
                <path d="M11 18h2" />
              </motion.svg>
              <motion.input
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
                animate={{
                  borderColor:
                    status === "error"
                      ? "#C85555"
                      : isValidLength
                        ? "#5A9F6A"
                        : "var(--border)",
                  boxShadow:
                    status === "error"
                      ? "0 0 8px rgba(200,85,85,0.2)"
                      : isValidLength
                        ? "0 0 8px rgba(90,159,106,0.15)"
                        : "none",
                }}
                transition={{ duration: 0.3 }}
                style={{
                  flex: 1,
                  minWidth: 0,
                  minHeight: 44,
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "2px solid var(--border)",
                  background: "var(--ivory)",
                  color: "var(--text)",
                  fontSize: 16,
                  letterSpacing: "0.06em",
                  outline: "none",
                  fontFamily: "var(--font-lato), system-ui, sans-serif",
                }}
                onFocus={(e) => {
                  if (status !== "error") {
                    e.currentTarget.style.borderColor = isValidLength ? "#5A9F6A" : "var(--accent)";
                  }
                }}
                onBlur={(e) => {
                  if (status !== "error") {
                    e.currentTarget.style.borderColor = isValidLength ? "#5A9F6A" : "var(--border)";
                  }
                }}
              />
            </div>
            <AnimatePresence mode="wait">
              {status === "error" && errorMsg && (
                <motion.p
                  key="error"
                  role="alert"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontSize: 12.5,
                    color: "#C85555",
                    textAlign: "left",
                    margin: 0,
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  ⚠ {errorMsg}
                </motion.p>
              )}
            </AnimatePresence>
            <motion.div
              animate={{ opacity: canSubmit ? 1 : 0.6 }}
              style={{ pointerEvents: canSubmit ? "auto" : "none" }}
            >
              <LiquidButton
                label={status === "loading" ? "Buscando…" : "Ver mi invitación"}
                onClick={buscar}
              />
            </motion.div>
          </motion.div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.55 }}
          style={{ marginBottom: 56, width: "100%", maxWidth: 320 }}
        >
          <motion.a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "14px 24px",
              borderRadius: 14,
              background: "linear-gradient(135deg, rgba(var(--accent-rgb),0.85), rgba(var(--gold-rgb),0.3))",
              border: "1px solid rgba(var(--accent-rgb),0.6)",
              color: "var(--ivory)",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.04em",
              textDecoration: "none",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(180,112,124,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              transition: "all 0.3s ease",
              width: "100%",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(180,112,124,0.35), inset 0 1px 0 rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(180,112,124,0.25), inset 0 1px 0 rgba(255,255,255,0.15)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2.5" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
            Agregar al calendario
          </motion.a>
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
