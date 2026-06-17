"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, new Date(process.env.NEXT_PUBLIC_EVENT_DATE!).getTime() - Date.now());
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const stagger = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
};

const fade = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function Home() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1_000);
    return () => clearInterval(id);
  }, []);

  const celebrant = process.env.NEXT_PUBLIC_CELEBRANT_NAME ?? "XV Años";
  const eventDate = new Date(process.env.NEXT_PUBLIC_EVENT_DATE!);

  const dateLabel = new Intl.DateTimeFormat("es", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(eventDate);

  const timeLabel = new Intl.DateTimeFormat("es", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(eventDate);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0d0610",
        color: "#fdf0f8",
        fontFamily: "var(--font-lato), system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{
          maxWidth: 400, width: "100%", textAlign: "center",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}
      >
        <motion.p variants={fade} style={{
          fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase",
          color: "#e8699a", marginBottom: 28,
        }}>
          ✦ &nbsp; una celebración especial &nbsp; ✦
        </motion.p>

        <motion.h1 variants={fade} style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: "clamp(2rem, 8vw, 3rem)",
          fontWeight: 400, lineHeight: 1.2,
          color: "#fdf0f8", margin: "0 0 4px",
        }}>
          Los XV Años
        </motion.h1>

        <motion.p variants={fade} style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: "clamp(1.4rem, 5vw, 2rem)",
          color: "#e8699a", margin: "0 0 24px",
        }}>
          de {celebrant}
        </motion.p>

        <motion.div variants={fade} style={{
          width: 48, height: 1, background: "#e8699a", opacity: 0.5, marginBottom: 28,
        }} />

        <motion.div variants={fade} style={{
          background: "#160d1e", border: "1px solid #251535",
          borderRadius: 16, padding: "16px 32px", marginBottom: 36,
        }}>
          <p style={{ fontSize: 13, color: "#c9a0b8", textTransform: "capitalize", marginBottom: 4 }}>
            {dateLabel}
          </p>
          <p style={{ fontSize: 13, color: "#7a5870" }}>{timeLabel}</p>
        </motion.div>

        {time !== null && (time.days > 0 || time.hours > 0 || time.minutes > 0) && (
          <motion.div variants={fade} style={{ width: "100%" }}>
            <p style={{
              fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase",
              color: "#7a5870", marginBottom: 14,
            }}>
              faltan
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[
                { v: pad(time.days),    l: "días" },
                { v: pad(time.hours),   l: "hrs" },
                { v: pad(time.minutes), l: "min" },
                { v: pad(time.seconds), l: "seg" },
              ].map(({ v, l }) => (
                <div key={l} style={{
                  background: "#160d1e", border: "1px solid #251535",
                  borderRadius: 14, padding: "16px 8px",
                  display: "flex", flexDirection: "column", alignItems: "center",
                }}>
                  <span style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: 26, color: "#e8699a", lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {v}
                  </span>
                  <span style={{
                    fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "#7a5870", marginTop: 6,
                  }}>
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.p variants={fade} style={{
          marginTop: 48, fontSize: 11, color: "#4a2a3e", letterSpacing: "0.1em",
        }}>
          ¿Tienes tu invitación? Usa el link que recibiste.
        </motion.p>

        <motion.p variants={fade} style={{
          marginTop: 32, fontSize: 9, letterSpacing: "0.3em",
          textTransform: "uppercase", color: "#2a1535",
        }}>
          ✦ &nbsp; con cariño &nbsp; ✦
        </motion.p>
      </motion.div>
    </main>
  );
}
