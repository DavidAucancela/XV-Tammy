"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useTransform } from "framer-motion";
import { usePointerParallax } from "@/lib/usePointerParallax";
import PetalBurst, { makeBurst, type Burst } from "./PetalBurst";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(eventDateISO: string): TimeLeft {
  const diff = Math.max(0, new Date(eventDateISO).getTime() - Date.now());
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
  eventDateISO,
}: {
  celebrant: string;
  photo?: string;
  dateLabel: string;
  timeLabel: string;
  venueName: string;
  eventDateISO: string;
}) {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(getTimeLeft(eventDateISO));
    const id = setInterval(() => setTime(getTimeLeft(eventDateISO)), 1_000);
    return () => clearInterval(id);
  }, [eventDateISO]);

  const { x: pointerX, y: pointerY } = usePointerParallax();
  const medallionX = useTransform(pointerX, [-1, 1], [-5, 5]);
  const medallionY = useTransform(pointerY, [-1, 1], [-5, 5]);

  const [bursts, setBursts] = useState<Burst[]>([]);
  const fireBurst = () => setBursts((prev) => [...prev, makeBurst()]);
  const endBurst = (id: number) => setBursts((prev) => prev.filter((b) => b.id !== id));

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

      {/* Minimal top bar — no scrollspy needed, single screen. Animated in
          on its own timer (rather than the content stagger below) so it's
          the last thing to appear: photo → title → countdown → date → link. */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
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
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--accent-ink)",
            textDecoration: "none",
            border: "1px solid var(--accent-soft)",
            borderRadius: "var(--radius-pill)",
            padding: "9px 18px",
          }}
        >
          Fotos y mensajes ✦
        </Link>
      </motion.div>

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
            <motion.button
              variants={medallionVariant}
              onClick={fireBurst}
              whileTap={{ scale: 0.93 }}
              aria-label="Sorpresa: lanzar pétalos"
              style={{
                position: "relative",
                width: "clamp(130px, 24vh, 210px)",
                height: "clamp(130px, 24vh, 210px)",
                margin: "0 auto clamp(12px, 2.4vh, 24px)",
                flexShrink: 0,
                x: medallionX,
                y: medallionY,
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "block",
              }}
            >
              {/* Idle float — separate element so it composes with the
                  entrance variant and pointer parallax on the parent. */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", inset: 0 }}
              >
              {/* Warm glow — wider and softer, blending gold + rose like the
                  fairy-light bokeh behind the venue's floral arch. */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: -28,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(var(--gold-rgb),0.28) 0%, rgba(var(--accent-rgb),0.24) 45%, transparent 72%)",
                  filter: "blur(14px)",
                }}
              />
              {/* Ivory ring — sits between the glow and the gold/rose gradient
                  ring for a double-border effect. */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: -5,
                  borderRadius: "50%",
                  background: "var(--ivory)",
                  boxShadow: "var(--shadow-sm)",
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
                      sizes="210px"
                      priority
                      style={{ objectFit: "cover", objectPosition: "50% 50%" }}
                    />
                  </div>
                </div>
              </div>
              </motion.div>
              <PetalBurst bursts={bursts} onDone={endBurst} />
            </motion.button>
          )}

          <motion.h1
            variants={fadeUp}
            className="shimmer-title"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(2.6rem, 8.5vw, 5.2rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Los XV Años
          </motion.h1>
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(1.35rem, 4.8vw, 2.4rem)",
              fontStyle: "italic",
              color: "var(--accent)",
              margin: "4px 0 0",
            }}
          >
            de {celebrant}
          </motion.p>
        </div>

        {/* Row 2 — countdown */}
        {time !== null && (
          <motion.div variants={fadeUp} style={{ minHeight: 0 }}>
            {/* Eyebrow framed by gold hairlines */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                marginBottom: "clamp(10px, 2vh, 20px)",
              }}
            >
              <span
                aria-hidden
                style={{ width: 42, height: 1, background: "linear-gradient(90deg, transparent, var(--gold))" }}
              />
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "var(--accent-ink)",
                  margin: 0,
                }}
              >
                faltan
              </p>
              <span
                aria-hidden
                style={{ width: 42, height: 1, background: "linear-gradient(90deg, var(--gold), transparent)" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "clamp(5px, 1.4vw, 14px)",
              }}
            >
              {[
                { v: pad(time.days), l: "días" },
                { v: pad(time.hours), l: "horas" },
                { v: pad(time.minutes), l: "min" },
                { v: pad(time.seconds), l: "seg" },
              ].map(({ v, l }, i) => (
                <div
                  key={l}
                  style={{ display: "flex", alignItems: "center", gap: "clamp(5px, 1.4vw, 14px)" }}
                >
                  {i > 0 && (
                    <span
                      aria-hidden
                      style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontSize: "clamp(1.3rem, 2.6vw, 2.1rem)",
                        color: "var(--gold-solid)",
                        lineHeight: 1,
                        opacity: 0.6,
                      }}
                    >
                      :
                    </span>
                  )}
                  {/* Gradient frame → glass card, echoing the invitation
                      ticket in EventLocation. Digit flips like a clock. */}
                  <div
                    style={{
                      borderRadius: 18,
                      padding: 1.5,
                      background:
                        "linear-gradient(150deg, rgba(var(--gold-rgb),0.65), rgba(var(--accent-rgb),0.45), rgba(var(--gold-rgb),0.3))",
                      boxShadow: "var(--shadow-md)",
                    }}
                  >
                    <div
                      style={{
                        minWidth: "clamp(3.6rem, 10vw, 5.4rem)",
                        padding:
                          "clamp(10px, 2vh, 16px) clamp(6px, 1.4vw, 12px) clamp(8px, 1.6vh, 12px)",
                        borderRadius: 16.5,
                        background:
                          "linear-gradient(160deg, var(--surface-elevated) 0%, var(--surface) 100%)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 7,
                        overflow: "hidden",
                      }}
                    >
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={v}
                          initial={{ y: -22, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 22, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          style={{
                            fontFamily: "var(--font-playfair), Georgia, serif",
                            fontSize: "clamp(2.1rem, 5vw, 3.4rem)",
                            color: "var(--text)",
                            lineHeight: 1,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {v}
                        </motion.span>
                      </AnimatePresence>
                      <span
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.26em",
                          textTransform: "uppercase",
                          color: "var(--accent-ink)",
                        }}
                      >
                        {l}
                      </span>
                    </div>
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
            fontSize: "clamp(13px, 3vw, 16px)",
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
