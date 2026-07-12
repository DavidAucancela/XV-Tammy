"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Flight = {
  id: number;
  startY: number; // vh
  size: number;
  duration: number;
  delay: number;
  reverse: boolean;
  hue: keyof typeof WING_FILLS;
};

const WING_FILLS = {
  rose: { upper: "#DE9AA9", lower: "#C4788A", spot: "#E8CD9C" },
  gold: { upper: "#E0BE85", lower: "#C6A25E", spot: "#F0C3CE" },
} as const;

function ButterflyShape({ size, hue, mirror }: { size: number; hue: Flight["hue"]; mirror?: boolean }) {
  const c = WING_FILLS[hue];
  return (
    <svg
      width={size}
      height={size * 0.8}
      viewBox="0 0 40 32"
      style={{ display: "block", transform: mirror ? "scaleX(-1)" : undefined }}
    >
      {/* wings */}
      <path d="M19 16 C10 2 2 4 3 12 C4 19 12 20 19 17 Z" fill={c.upper} />
      <path d="M21 16 C30 2 38 4 37 12 C36 19 28 20 21 17 Z" fill={c.upper} />
      <path d="M19 17 C11 22 6 28 11 29 C15 30 18 24 19 19 Z" fill={c.lower} />
      <path d="M21 17 C29 22 34 28 29 29 C25 30 22 24 21 19 Z" fill={c.lower} />
      {/* wing spots */}
      <circle cx="9" cy="11" r="2" fill={c.spot} opacity="0.9" />
      <circle cx="31" cy="11" r="2" fill={c.spot} opacity="0.9" />
      {/* body + antennae */}
      <ellipse cx="20" cy="17" rx="1.6" ry="7" fill="#4A372E" />
      <path
        d="M18.6 10.5 C17 7.5 15.5 6.5 14.5 6 M21.4 10.5 C23 7.5 24.5 6.5 25.5 6"
        stroke="#4A372E"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * A few butterflies crossing the hero on long looping flights — wings flap
 * fast (scaleX pulse) while the flight path drifts up and down.
 */
export default function Butterflies({ count = 3 }: { count?: number }) {
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    setFlights(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        startY: Math.random() * 55 + 12,
        size: Math.random() * 12 + 26,
        duration: Math.random() * 9 + 17,
        delay: Math.random() * 8 + i * 4,
        reverse: i % 2 === 1,
        hue: i % 2 === 1 ? "gold" : "rose",
      }))
    );
  }, [count]);

  if (!flights.length) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {flights.map((f) => {
        const xPath = f.reverse
          ? ["104vw", "72vw", "38vw", "8vw", "-8vw"]
          : ["-8vw", "24vw", "56vw", "82vw", "108vw"];
        return (
          <motion.div
            key={f.id}
            style={{ position: "absolute", top: `${f.startY}vh`, left: 0 }}
            animate={{
              x: xPath,
              y: ["0vh", "-7vh", "4vh", "-5vh", "2vh"],
              rotate: f.reverse ? [-8, 6, -10, 4, -6] : [8, -6, 10, -4, 6],
              opacity: [0, 1, 1, 1, 0],
            }}
            transition={{
              duration: f.duration,
              delay: f.delay,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          >
            {/* wing flap — fast scaleX pulse on a separate element */}
            <motion.div
              animate={{ scaleX: [1, 0.45, 1] }}
              transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
            >
              <ButterflyShape size={f.size} hue={f.hue} mirror={f.reverse} />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
