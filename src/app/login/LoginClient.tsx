"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh", background: "#0d0610",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, fontFamily: "var(--font-lato), system-ui",
      }}
    >
      <div style={{ width: "100%", maxWidth: 360 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#e8699a", marginBottom: 16 }}>
            ✦ &nbsp; acceso staff &nbsp; ✦
          </p>
          <h1
            style={{
              fontSize: 28, color: "#fdf0f8",
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontWeight: 400, margin: 0,
            }}
          >
            XV — Tammy
          </h1>
        </div>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  padding: "14px 16px", borderRadius: 12,
                  background: "#160d1e", border: "1px solid #251535",
                  color: "#fdf0f8", fontSize: 14, outline: "none",
                  fontFamily: "inherit",
                }}
              />

              {error && (
                <p style={{ fontSize: 12, color: "#e07070", textAlign: "center" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                style={{
                  padding: "14px", borderRadius: 12, border: "none",
                  background: loading || !email ? "#2a1535" : "#e8699a",
                  color: loading || !email ? "#7a5870" : "#0d0610",
                  fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase",
                  cursor: loading || !email ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                {loading ? "Enviando…" : "Enviar link de acceso"}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: "center", padding: "32px 20px",
                background: "#160d1e", borderRadius: 16,
                border: "1px solid #251535",
              }}
            >
              <p style={{ fontSize: 24, marginBottom: 12 }}>📩</p>
              <p style={{ color: "#fdf0f8", fontSize: 14, marginBottom: 8 }}>
                Revisá tu correo
              </p>
              <p style={{ color: "#7a5870", fontSize: 12 }}>
                Te enviamos un link a <span style={{ color: "#e8699a" }}>{email}</span>
              </p>
              <button
                onClick={() => setSent(false)}
                style={{
                  marginTop: 24, fontSize: 11, color: "#7a5870",
                  background: "none", border: "none", cursor: "pointer",
                  letterSpacing: "0.2em", textTransform: "uppercase",
                }}
              >
                Usar otro email
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function LoginClient() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
