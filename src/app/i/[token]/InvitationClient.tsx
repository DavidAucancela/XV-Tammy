"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PassCard from "@/components/landing/PassCard";

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

  const dateConfirmed = process.env.NEXT_PUBLIC_EVENT_DATE_CONFIRMED === "true";

  useEffect(() => {
    if (!dateConfirmed) return;
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1_000);
    return () => clearInterval(id);
  }, [dateConfirmed]);

  const eventDate = new Date(process.env.NEXT_PUBLIC_EVENT_DATE!);
  const celebrant = process.env.NEXT_PUBLIC_CELEBRANT_NAME ?? "XV Años";

  const dateLabel = dateConfirmed
    ? new Intl.DateTimeFormat("es", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "America/Guayaquil",
      }).format(eventDate)
    : "Próximamente";

  const timeLabel = dateConfirmed
    ? new Intl.DateTimeFormat("es", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/Guayaquil",
      }).format(eventDate)
    : "Por confirmar";

  const parts = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("es", { timeZone: "America/Guayaquil", ...opts });
  const weekday = capitalize(parts({ weekday: "long" }).format(eventDate));
  const dayNum = parts({ day: "numeric" }).format(eventDate);
  const monthName = parts({ month: "long" }).format(eventDate).toUpperCase();
  const yearNum = parts({ year: "numeric" }).format(eventDate);
  const timePieces = parts({ hour: "numeric", minute: "2-digit", hour12: true }).formatToParts(eventDate);
  const pick = (t: string) => timePieces.find((x) => x.type === t)?.value ?? "";
  const timeBig = `${pick("hour")}:${pick("minute")}`;
  const timePeriod = pick("dayPeriod").replace(/[\s.]/g, "").toUpperCase();

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

        {/* ── Fecha y hora ── */}
        {dateConfirmed ? (
          <motion.div
            variants={fade}
            className="mt-10 w-full rounded-[28px] px-6 py-8 relative overflow-hidden"
            style={{
              background: "linear-gradient(165deg, rgba(252,246,236,0.95) 0%, rgba(234,216,195,0.75) 100%)",
              border: "1px solid rgba(198,162,94,0.55)",
              boxShadow: "0 12px 40px rgba(43,33,28,0.10)",
            }}
          >
            <div aria-hidden className="absolute inset-2 rounded-[22px] pointer-events-none" style={{ border: "1px solid rgba(198,162,94,0.3)" }} />
            <p className="text-[11px] tracking-[0.45em] uppercase" style={{ color: "#96702E" }}>
              {weekday}
            </p>
            <div className="mt-2 flex items-center justify-center gap-5">
              <span className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, #C6A25E)" }} />
              <span
                className="text-[88px] leading-none"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#B4707C" }}
              >
                {dayNum}
              </span>
              <span className="h-px flex-1" style={{ background: "linear-gradient(270deg, transparent, #C6A25E)" }} />
            </div>
            <p className="mt-2 text-sm tracking-[0.5em] uppercase" style={{ color: "#4A372E" }}>
              {monthName}
            </p>
            <p className="mt-1 text-xs tracking-[0.4em]" style={{ color: "#7A6355" }}>
              {yearNum}
            </p>

            <div className="mx-auto my-6 flex items-center justify-center gap-3" style={{ color: "#C6A25E" }}>
              <span className="h-px w-10" style={{ background: "#C6A25E", opacity: 0.6 }} />
              <span className="text-xs">✦</span>
              <span className="h-px w-10" style={{ background: "#C6A25E", opacity: 0.6 }} />
            </div>

            <p className="text-[10px] tracking-[0.35em] uppercase" style={{ color: "#7A6355" }}>
              a las
            </p>
            <p className="mt-1 flex items-baseline justify-center gap-2">
              <span
                className="text-5xl"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#4A372E" }}
              >
                {timeBig}
              </span>
              <span className="text-sm tracking-[0.3em]" style={{ color: "#B4707C" }}>
                {timePeriod}
              </span>
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={fade}
            className="mt-10 w-full rounded-2xl p-6 flex flex-col gap-3 text-sm"
            style={{ background: "rgba(234,216,195,0.65)", border: "1px solid #DCC7AE" }}
          >
            <Detail icon="✦" label={capitalize(dateLabel)} />
            <Detail icon="✦" label={timeLabel} />
          </motion.div>
        )}

        {/* ── Cuenta regresiva ── */}
        {dateConfirmed && time !== null && (time.days > 0 || time.hours > 0 || time.minutes > 0) && (
          <motion.div
            variants={fade}
            className="mt-8 w-full rounded-[28px] px-4 py-8 relative overflow-hidden"
            style={{
              background: "radial-gradient(120% 100% at 50% 0%, #4A372E 0%, #2B211C 70%)",
              border: "1px solid rgba(198,162,94,0.5)",
              boxShadow: "0 16px 48px rgba(43,33,28,0.30)",
            }}
          >
            <div
              aria-hidden
              className="absolute -top-16 left-1/2 -translate-x-1/2 h-40 w-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: "rgba(198,162,94,0.22)" }}
            />
            <p className="relative text-[10px] tracking-[0.45em] uppercase" style={{ color: "#C6A25E" }}>
              ✦ &nbsp; cada vez más cerca &nbsp; ✦
            </p>
            <div className="relative mt-6 flex items-start justify-center gap-1.5">
              {[
                { v: time.days, l: "días" },
                { v: time.hours, l: "horas" },
                { v: time.minutes, l: "min" },
                { v: time.seconds, l: "seg" },
              ].map(({ v, l }, i) => (
                <div key={l} className="flex items-start">
                  {i > 0 && (
                    <span className="mx-1 mt-3 text-xl font-light" style={{ color: "rgba(198,162,94,0.5)" }}>
                      :
                    </span>
                  )}
                  <div className="flex flex-col items-center w-[62px]">
                    <div
                      className="relative h-14 w-full rounded-xl overflow-hidden flex items-center justify-center"
                      style={{
                        background: "linear-gradient(180deg, rgba(252,246,236,0.10) 0%, rgba(252,246,236,0.03) 100%)",
                        border: "1px solid rgba(198,162,94,0.35)",
                      }}
                    >
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={pad(v)}
                          initial={{ y: -18, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 18, opacity: 0 }}
                          transition={{ duration: 0.28, ease: "easeOut" }}
                          className="text-3xl font-light tabular-nums"
                          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#E8CF9B" }}
                        >
                          {pad(v)}
                        </motion.span>
                      </AnimatePresence>
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-1/2 h-px"
                        style={{ background: "rgba(43,33,28,0.55)" }}
                      />
                    </div>
                    <span className="mt-2 text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(243,230,214,0.65)" }}>
                      {l}
                    </span>
                  </div>
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
                <PassCard
                  token={token}
                  celebrant={celebrant}
                  guestName={guest.nombre}
                  dateLine={dateConfirmed ? `${dayNum} ${monthName} ${yearNum}` : undefined}
                />
                <a
                  href={`/api/qr?token=${token}`}
                  download={`invitacion-${guest.nombre.replace(/\s+/g, "-")}.png`}
                  className="text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
                  style={{ color: "#B4707C" }}
                >
                  Descargar QR ↓
                </a>


                <Link
                  href="/"
                  className="mt-2 rounded-xl px-6 py-3 text-sm font-light tracking-widest uppercase transition-opacity hover:opacity-80"
                  style={{ background: "#B4707C", color: "#F3E6D6" }}
                >
                  Ir al inicio
                </Link>
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
