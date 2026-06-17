"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Guest = {
  id: string;
  nombre: string;
  pases: number;
  rsvp_estado: string | null;
  pases_confirmados: number | null;
  checked_in_at: string | null;
};

type Step = "pending" | "selecting" | "confirmed" | "declined";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, new Date(process.env.NEXT_PUBLIC_EVENT_DATE!).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function InvitationClient({ guest, token }: { guest: Guest; token: string }) {
  const [time, setTime] = useState<TimeLeft | null>(null);
  const [step, setStep] = useState<Step>(() => {
    if (guest.rsvp_estado === "confirmado") return "confirmed";
    if (guest.rsvp_estado === "rechazado") return "declined";
    return "pending";
  });
  const [selectedPases, setSelectedPases] = useState(guest.pases_confirmados ?? 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1_000);
    return () => clearInterval(id);
  }, []);

  const eventDate = new Date(process.env.NEXT_PUBLIC_EVENT_DATE!);
  const celebrant = process.env.NEXT_PUBLIC_CELEBRANT_NAME ?? "XV Años";

  const dateLabel = new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(eventDate);

  const timeLabel = new Intl.DateTimeFormat("es", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(eventDate);

  const lat = process.env.NEXT_PUBLIC_VENUE_LAT;
  const lng = process.env.NEXT_PUBLIC_VENUE_LNG;
  const mapsUrl = lat && lng ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` : null;

  async function handleRsvp(accion: "confirmar" | "declinar") {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          accion,
          pases_confirmados: accion === "confirmar" ? selectedPases : 0,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Error desconocido");
      setStep(accion === "confirmar" ? "confirmed" : "declined");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo salió mal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center pb-16"
      style={{ background: "#0d0610", color: "#fdf0f8", fontFamily: "var(--font-lato), system-ui, sans-serif" }}
    >
      {/* ── Hero ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="w-full max-w-md px-6 pt-14 flex flex-col items-center text-center"
      >
        <motion.p variants={fade} className="text-xs tracking-[0.3em] uppercase" style={{ color: "#e8699a" }}>
          ✦ &nbsp; una invitación especial &nbsp; ✦
        </motion.p>

        <motion.h1
          variants={fade}
          className="mt-6 text-4xl leading-tight"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#fdf0f8" }}
        >
          Los XV Años
          <br />
          <span style={{ color: "#e8699a" }}>de {celebrant}</span>
        </motion.h1>

        <motion.div variants={fade} className="mt-1 w-16 h-px" style={{ background: "#e8699a" }} />

        <motion.p variants={fade} className="mt-6 text-lg font-light" style={{ color: "#f4b8d0" }}>
          {guest.nombre}
        </motion.p>
        <motion.p variants={fade} className="mt-1 text-sm" style={{ color: "#7a5870" }}>
          {guest.pases === 1 ? "1 pase reservado" : `${guest.pases} pases reservados`}
        </motion.p>

        {/* ── Detalles del evento ── */}
        <motion.div
          variants={fade}
          className="mt-10 w-full rounded-2xl p-6 flex flex-col gap-3 text-sm"
          style={{ background: "#160d1e", border: "1px solid #251535" }}
        >
          <Detail icon="✦" label={capitalize(dateLabel)} />
          <Detail icon="✦" label={timeLabel} />
        </motion.div>

        {/* ── Cuenta regresiva ── */}
        {time !== null && (time.days > 0 || time.hours > 0 || time.minutes > 0) && (
          <motion.div variants={fade} className="mt-10 w-full">
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#7a5870" }}>
              faltan
            </p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { v: pad(time.days), l: "días" },
                { v: pad(time.hours), l: "hrs" },
                { v: pad(time.minutes), l: "min" },
                { v: pad(time.seconds), l: "seg" },
              ].map(({ v, l }) => (
                <div
                  key={l}
                  className="flex flex-col items-center rounded-xl py-4"
                  style={{ background: "#160d1e", border: "1px solid #251535" }}
                >
                  <span
                    className="text-2xl font-light tabular-nums"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#e8699a" }}
                  >
                    {v}
                  </span>
                  <span className="text-[10px] tracking-widest uppercase mt-1" style={{ color: "#7a5870" }}>
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── RSVP / QR ── */}
        <motion.div variants={fade} className="mt-10 w-full">
          <AnimatePresence mode="wait">
            {step === "pending" && (
              <motion.div key="pending" {...slideInOut} className="flex flex-col gap-4">
                <p className="text-sm tracking-wider uppercase" style={{ color: "#7a5870" }}>
                  ¿Confirmás tu asistencia?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("selecting")}
                    className="flex-1 rounded-xl py-3 text-sm font-light tracking-widest uppercase transition-opacity hover:opacity-80"
                    style={{ background: "#e8699a", color: "#0d0610" }}
                  >
                    Sí, voy
                  </button>
                  <button
                    onClick={() => handleRsvp("declinar")}
                    disabled={loading}
                    className="flex-1 rounded-xl py-3 text-sm font-light tracking-widest uppercase transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ background: "#1e1228", color: "#7a5870", border: "1px solid #2a1535" }}
                  >
                    No puedo
                  </button>
                </div>
              </motion.div>
            )}

            {step === "selecting" && (
              <motion.div key="selecting" {...slideInOut} className="flex flex-col gap-5">
                <p className="text-sm tracking-wider uppercase" style={{ color: "#7a5870" }}>
                  ¿Cuántas personas van a asistir?
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  {Array.from({ length: guest.pases }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setSelectedPases(n)}
                      className="w-12 h-12 rounded-full text-sm font-light transition-all"
                      style={
                        selectedPases === n
                          ? { background: "#e8699a", color: "#0d0610" }
                          : { background: "#1e1228", color: "#7a5870", border: "1px solid #2a1535" }
                      }
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {error && <p className="text-xs text-center" style={{ color: "#e07070" }}>{error}</p>}
                <button
                  onClick={() => handleRsvp("confirmar")}
                  disabled={loading}
                  className="w-full rounded-xl py-3 text-sm font-light tracking-widest uppercase transition-opacity hover:opacity-80 disabled:opacity-40"
                  style={{ background: "#e8699a", color: "#0d0610" }}
                >
                  {loading ? "Confirmando…" : "Confirmar"}
                </button>
                <button
                  onClick={() => setStep("pending")}
                  className="text-xs tracking-widest uppercase"
                  style={{ color: "#7a5870" }}
                >
                  ← Volver
                </button>
              </motion.div>
            )}

            {step === "confirmed" && (
              <motion.div key="confirmed" {...slideInOut} className="flex flex-col items-center gap-5">
                <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "#e8699a" }}>
                  ✦ &nbsp; ¡Te esperamos! &nbsp; ✦
                </p>
                <p className="text-sm font-light" style={{ color: "#7a5870" }}>
                  Tu pase de entrada —{" "}
                  <span style={{ color: "#f4b8d0" }}>
                    {selectedPases} {selectedPases === 1 ? "persona" : "personas"}
                  </span>
                </p>
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="rounded-2xl overflow-hidden p-3"
                  style={{ background: "#fafafa" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/qr?token=${token}`}
                    alt="QR de acceso"
                    width={240}
                    height={240}
                    className="block"
                  />
                </motion.div>
                <a
                  href={`/api/qr?token=${token}`}
                  download={`invitacion-${guest.nombre.replace(/\s+/g, "-")}.png`}
                  className="text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
                  style={{ color: "#e8699a" }}
                >
                  Descargar QR ↓
                </a>
                <p className="text-xs text-center max-w-xs" style={{ color: "#7a5870" }}>
                  Guarda esta pantalla o descarga tu QR. Lo vas a necesitar en la entrada.
                </p>
              </motion.div>
            )}

            {step === "declined" && (
              <motion.div key="declined" {...slideInOut} className="flex flex-col items-center gap-3">
                <p className="text-sm" style={{ color: "#7a5870" }}>
                  Lamentamos que no puedas acompañarnos.
                </p>
                <button
                  onClick={() => setStep("pending")}
                  className="text-xs tracking-widest uppercase mt-2"
                  style={{ color: "#e8699a" }}
                >
                  Cambiar respuesta
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Cómo llegar ── */}
        {mapsUrl && (
          <motion.a
            variants={fade}
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 text-xs tracking-[0.25em] uppercase transition-opacity hover:opacity-70"
            style={{ color: "#7a5870" }}
          >
            ¿Cómo llegar? →
          </motion.a>
        )}

        <motion.p variants={fade} className="mt-14 text-[10px] tracking-widest uppercase" style={{ color: "#2a1535" }}>
          ✦ &nbsp; con cariño &nbsp; ✦
        </motion.p>
      </motion.div>
    </div>
  );
}

function Detail({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs" style={{ color: "#e8699a" }}>{icon}</span>
      <span style={{ color: "#9a7888" }}>{label}</span>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const slideInOut = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: "easeIn" as const } },
};
