"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
        {/* Date card */}
        <div
          style={{
            background: "rgba(22, 13, 30, 0.92)",
            border: "1px solid #251535",
            borderRadius: 22,
            padding: "30px 40px",
            marginBottom: 52,
            boxShadow: "0 0 60px rgba(232,105,154,0.06)",
          }}
        >
          <p
            style={{
              fontSize: 9,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "#7a5870",
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
          <p style={{ fontSize: 14, color: "#7a5870" }}>{timeLabel}</p>
        </div>

        {/* Countdown grid */}
        {time !== null && (
          <>
            <p
              style={{
                fontSize: 9,
                letterSpacing: "0.40em",
                textTransform: "uppercase",
                color: "#7a5870",
                marginBottom: 24,
              }}
            >
              faltan
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 14,
              }}
            >
              {[
                { v: pad(time.days), l: "días" },
                { v: pad(time.hours), l: "hrs" },
                { v: pad(time.minutes), l: "min" },
                { v: pad(time.seconds), l: "seg" },
              ].map(({ v, l }, i) => (
                <motion.div
                  key={l}
                  initial={{ opacity: 0, y: 30, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
                  style={{
                    background: "rgba(22, 13, 30, 0.92)",
                    border: "1px solid #251535",
                    borderRadius: 18,
                    padding: "24px 8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxShadow: "0 0 30px rgba(232,105,154,0.08)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      fontSize: 36,
                      color: "#e8699a",
                      lineHeight: 1,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {v}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: "#7a5870",
                      marginTop: 10,
                    }}
                  >
                    {l}
                  </span>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
}
