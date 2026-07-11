"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(): TimeLeft {
  const diff = Math.max(
    0,
    new Date(process.env.NEXT_PUBLIC_EVENT_DATE!).getTime() - Date.now()
  );
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const medallionVariant = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function HomeHero({
  celebrant,
  photo,
  dateLabel,
  timeLabel,
  venueName,
}: {
  celebrant: string;
  photo?: string;
  dateLabel: string;
  timeLabel: string;
  venueName: string;
}) {
  const [time, setTime] = useState<TimeLeft | null>(null);
  const hasSetIntervalRef = useRef(false);

  useEffect(() => {
    if (hasSetIntervalRef.current) return;
    hasSetIntervalRef.current = true;
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1_000);
    return () => clearInterval(id);
  }, []);

  return (
    <main
      style={{
        position: "relative",
        height: "100dvh",
        minHeight: 560,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "transparent",
        color: "var(--text)",
        fontFamily: "var(--font-lato), system-ui, sans-serif",
      }}
    >
      {/* Background effect (MeshBackground + FloatingIcons) is rendered by the
          parent page — this component only owns foreground content so it stays
          reusable regardless of which decorative layer sits behind it. */}

      {/* Minimal top bar — no scrollspy needed, single screen */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "flex-end",
          padding: "clamp(14px, 3vh, 22px) clamp(16px, 4vw, 28px) 0",
        }}
      >
        <Link
          href="/recuerdos"
          style={{
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--accent-ink)",
            textDecoration: "none",
            border: "1px solid var(--accent-soft)",
            borderRadius: "var(--radius-pill)",
            padding: "8px 16px",
          }}
        >
          Fotos y mensajes ✦
        </Link>
      </div>

      {/* Content — three proportioned rows filling the remaining viewport */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{
          position: "relative",
          zIndex: 1,
          flex: "1 1 0",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          padding: "0 clamp(16px, 5vw, 32px) clamp(12px, 3vh, 24px)",
          textAlign: "center",
        }}
      >
        {/* Row 1 — hero identity */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: 0 }}>
          {photo && (
            <motion.div
              variants={medallionVariant}
              style={{
                position: "relative",
                width: "clamp(96px, 20vh, 160px)",
                height: "clamp(96px, 20vh, 160px)",
                margin: "0 auto clamp(10px, 2vh, 20px)",
                flexShrink: 0,
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: -20,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(var(--accent-rgb),0.30) 0%, transparent 70%)",
                  filter: "blur(10px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  padding: 3,
                  background: "conic-gradient(from 200deg, var(--gold-solid), var(--accent), var(--gold-solid))",
                }}
              >
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", padding: 4, background: "var(--bg)" }}>
                  <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden" }}>
                    <Image
                      src={photo}
                      alt={celebrant}
                      fill
                      sizes="160px"
                      priority
                      style={{ objectFit: "cover", objectPosition: "50% 50%" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(2rem, 7vw, 3.6rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              color: "var(--text)",
              margin: 0,
            }}
          >
            Los XV Años
          </motion.h1>
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(1.1rem, 4vw, 1.8rem)",
              fontStyle: "italic",
              color: "var(--accent)",
              margin: "2px 0 0",
            }}
          >
            de {celebrant}
          </motion.p>
        </div>

        {/* Row 2 — countdown */}
        {time !== null && (
          <motion.div variants={fadeUp} style={{ minHeight: 0 }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: "0.34em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "clamp(8px, 1.6vh, 16px)",
              }}
            >
              faltan
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: "clamp(4px, 1.5vw, 14px)",
              }}
            >
              {[
                { v: pad(time.days), l: "días" },
                { v: pad(time.hours), l: "hrs" },
                { v: pad(time.minutes), l: "min" },
                { v: pad(time.seconds), l: "seg" },
              ].map(({ v, l }, i) => (
                <div key={l} style={{ display: "flex", alignItems: "flex-start" }}>
                  {i > 0 && (
                    <span
                      aria-hidden
                      style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontSize: "clamp(1.1rem, 2.2vw, 1.8rem)",
                        color: "var(--gold-solid)",
                        lineHeight: 1,
                        opacity: 0.55,
                        margin: "0 clamp(2px, 1vw, 8px)",
                      }}
                    >
                      :
                    </span>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)",
                        color: "var(--text)",
                        lineHeight: 1,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {v}
                    </span>
                    <span
                      style={{
                        fontSize: 8,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                        marginTop: 6,
                      }}
                    >
                      {l}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Row 3 — condensed event info (no map) */}
        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(8px, 2vw, 16px)",
            fontSize: "clamp(11px, 2.6vw, 13px)",
            color: "var(--text-muted)",
          }}
        >
          <span style={{ textTransform: "capitalize" }}>{dateLabel}</span>
          <span aria-hidden style={{ opacity: 0.4 }}>
            ·
          </span>
          <span>{timeLabel}</span>
          <span aria-hidden style={{ opacity: 0.4 }}>
            ·
          </span>
          <span>{venueName}</span>
        </motion.div>
      </motion.div>
    </main>
  );
}
