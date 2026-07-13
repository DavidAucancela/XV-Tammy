"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlipCard from "@/components/landing/FlipCard";
import { dressCode } from "@/data/landingContent";

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
      style={{ background: "#F3E6D6", color: "#4A372E", fontFamily: "var(--font-lato), system-ui, sans-serif" }}
    >
      {/* ── Hero ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="w-full max-w-md px-6 pt-14 flex flex-col items-center text-center"
      >
        <motion.p variants={fade} className="text-xs tracking-[0.3em] uppercase" style={{ color: "#B4707C" }}>
          ✦ &nbsp; una invitación especial &nbsp; ✦
        </motion.p>

        <motion.h1
          variants={fade}
          className="mt-6 text-4xl leading-tight"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#B4707C" }}
        >
          {celebrant}
        </motion.h1>

        <motion.div variants={fade} className="mt-1 w-16 h-px" style={{ background: "#B4707C" }} />

        <motion.p variants={fade} className="mt-6 text-lg font-light" style={{ color: "#B4707C" }}>
          {guest.nombre}
        </motion.p>
        <motion.p variants={fade} className="mt-1 text-sm" style={{ color: "#7A6355" }}>
          {guest.pases === 1 ? "1 pase reservado" : `${guest.pases} pases reservados`}
        </motion.p>

        <motion.p variants={fade} className="mt-2 text-xs tracking-widest uppercase" style={{ color: "#B4707C" }}>
          {dressCode}
        </motion.p>

        {/* ── Tarjeta volteadora ── */}
        <motion.div variants={fade} className="mt-10 w-full">
          <FlipCard />
        </motion.div>

        {/* ── Detalles del evento: Lugar y hora ── */}
        <motion.div
          variants={fade}
          className="mt-10 w-full rounded-2xl p-6 flex flex-col gap-3 text-sm"
          style={{ background: "rgba(234,216,195,0.65)", border: "1px solid #DCC7AE" }}
        >
          <Detail icon="✦" label={capitalize(dateLabel)} />
          <Detail icon="✦" label={timeLabel} />
        </motion.div>

        {/* ── Cada vez más cerca ── */}
        {time !== null && (time.days > 0 || time.hours > 0 || time.minutes > 0) && (
          <motion.div variants={fade} className="mt-10 w-full">
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#7A6355" }}>
              cada vez más cerca
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
                  style={{ background: "rgba(234,216,195,0.65)", border: "1px solid #DCC7AE" }}
                >
                  <span
                    className="text-2xl font-light tabular-nums"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#B4707C" }}
                  >
                    {v}
                  </span>
                  <span className="text-[10px] tracking-widest uppercase mt-1" style={{ color: "#7A6355" }}>
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
                <p className="text-sm tracking-wider uppercase" style={{ color: "#7A6355" }}>
                  ¿Confirmás tu asistencia?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("selecting")}
                    className="flex-1 rounded-xl py-3 text-sm font-light tracking-widest uppercase transition-opacity hover:opacity-80"
                    style={{ background: "#B4707C", color: "#F3E6D6" }}
                  >
                    Sí, voy
                  </button>
                  <button
                    onClick={() => handleRsvp("declinar")}
                    disabled={loading}
                    className="flex-1 rounded-xl py-3 text-sm font-light tracking-widest uppercase transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ background: "rgba(234,216,195,0.65)", color: "#7A6355", border: "1px solid #DCC7AE" }}
                  >
                    No puedo
                  </button>
                </div>
              </motion.div>
            )}

            {step === "selecting" && (
              <motion.div key="selecting" {...slideInOut} className="flex flex-col gap-5">
                <p className="text-sm tracking-wider uppercase" style={{ color: "#7A6355" }}>
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
                          ? { background: "#B4707C", color: "#F3E6D6" }
                          : { background: "rgba(234,216,195,0.65)", color: "#7A6355", border: "1px solid #DCC7AE" }
                      }
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {error && <p className="text-xs text-center" style={{ color: "#C85555" }}>{error}</p>}
                <button
                  onClick={() => handleRsvp("confirmar")}
                  disabled={loading}
                  className="w-full rounded-xl py-3 text-sm font-light tracking-widest uppercase transition-opacity hover:opacity-80 disabled:opacity-40"
                  style={{ background: "#B4707C", color: "#F3E6D6" }}
                >
                  {loading ? "Confirmando…" : "Confirmar"}
                </button>
                <button
                  onClick={() => setStep("pending")}
                  className="text-xs tracking-widest uppercase"
                  style={{ color: "#7A6355" }}
                >
                  ← Volver
                </button>
              </motion.div>
            )}

            {step === "confirmed" && (
              <motion.div key="confirmed" {...slideInOut} className="flex flex-col items-center gap-5">
                <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "#B4707C" }}>
                  ✦ &nbsp; ¡Te esperamos! &nbsp; ✦
                </p>
                <p className="text-sm font-light" style={{ color: "#7A6355" }}>
                  Tu pase de entrada —{" "}
                  <span style={{ color: "#B4707C" }}>
                    {selectedPases} {selectedPases === 1 ? "persona" : "personas"}
                  </span>
                </p>
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="rounded-2xl overflow-hidden p-3"
                  style={{ background: "#FCFAEF" }}
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
                  style={{ color: "#B4707C" }}
                >
                  Descargar QR ↓
                </a>
                <p className="text-xs text-center max-w-xs" style={{ color: "#7A6355" }}>
                  Guarda esta pantalla o descarga tu QR. Lo vas a necesitar en la entrada.
                </p>
              </motion.div>
            )}

            {step === "declined" && (
              <motion.div key="declined" {...slideInOut} className="flex flex-col items-center gap-3">
                <p className="text-sm" style={{ color: "#7A6355" }}>
                  Lamentamos que no puedas acompañarnos.
                </p>
                <button
                  onClick={() => setStep("pending")}
                  className="text-xs tracking-widest uppercase mt-2"
                  style={{ color: "#B4707C" }}
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
            style={{ color: "#7A6355" }}
          >
            ¿Cómo llegar? →
          </motion.a>
        )}

        <motion.p variants={fade} className="mt-14 text-[10px] tracking-widest uppercase" style={{ color: "#B4707C" }}>
          ✦ &nbsp; con cariño &nbsp; ✦
        </motion.p>
      </motion.div>
    </div>
  );
}

function Detail({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs" style={{ color: "#B4707C" }}>{icon}</span>
      <span style={{ color: "#4A372E" }}>{label}</span>
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
