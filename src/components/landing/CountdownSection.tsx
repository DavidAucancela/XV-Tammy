"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "./SectionHeading";

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

export default function CountdownSection({
  dateLabel,
  timeLabel,
}: {
  dateLabel: string;
  timeLabel: string;
}) {
  const [time, setTime] = useState<TimeLeft | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1_000);
    return () => clearInterval(id);
  }, []);

  // Scroll-linked parallax: section floats up slightly as it scrolls into view
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const sectionY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -20]);
  const sectionOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [0, 1, 1, 0.85]
  );

  return (
    <section
      ref={ref}
      id="countdown"
      style={{
        padding: "100px 24px",
        background: "rgba(13, 6, 16, 0.88)",
        textAlign: "center",
      }}
    >
      <motion.div
        style={{ maxWidth: 520, margin: "0 auto", y: sectionY, opacity: sectionOpacity }}
      >
        <SectionHeading title="Cuenta Regresiva" marginBottom={48} />

        {/* Date card — supporting info; the countdown digits below carry the section */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "22px 40px",
            marginBottom: 60,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <p
            style={{
              fontSize: 9,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: 14,
            }}
          >
            fecha del evento
          </p>
          <p
            style={{
              fontSize: 18,
              color: "#c9a0b8",
              textTransform: "capitalize",
              marginBottom: 6,
              fontWeight: 300,
            }}
          >
            {dateLabel}
          </p>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>{timeLabel}</p>
        </div>

        {/* Countdown grid */}
        {time !== null && (
          <>
            <p
              style={{
                fontSize: 9,
                letterSpacing: "0.40em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: 24,
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
                        fontSize: "clamp(1.3rem, 2.5vw, 2.2rem)",
                        color: "var(--gold-solid)",
                        lineHeight: 1,
                        opacity: 0.55,
                        margin: "0 clamp(2px, 1vw, 8px)",
                      }}
                    >
                      :
                    </span>
                  )}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.08 }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontSize: "clamp(2.2rem, 4.2vw, 3.6rem)",
                        color: "var(--text)",
                        lineHeight: 1,
                        fontVariantNumeric: "tabular-nums",
                        textShadow: "0 0 44px rgba(232,105,154,0.35)",
                      }}
                    >
                      {v}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                        marginTop: 10,
                      }}
                    >
                      {l}
                    </span>
                  </motion.div>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
}
