"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Petal = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  sway: number;
  spin: number;
  hue: keyof typeof PETAL_FILLS;
  flip: boolean;
};

const PETAL_FILLS = {
  blush: ["#F0C3CE", "#DE9AA9"],
  rose: ["#DE9AA9", "#C4788A"],
  gold: ["#E8CD9C", "#C6A25E"],
} as const;

/** Crisp SVG rose petal — a teardrop with a soft highlight vein. */
export function PetalShape({
  id,
  hue,
  size,
  flip,
}: {
  id: number | string;
  hue: keyof typeof PETAL_FILLS;
  size: number;
  flip: boolean;
}) {
  const [light, dark] = PETAL_FILLS[hue];
  const gid = `petal-grad-${id}`;
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 20 24"
      style={{ display: "block", transform: flip ? "scaleX(-1)" : undefined }}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
      </defs>
      <path d="M10 1 C16.5 6.5 16 16 10 23 C4 16 3.5 6.5 10 1 Z" fill={`url(#${gid})`} />
      <path
        d="M10 4 C10.6 10 10.6 15 10 20"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Rose petals drifting down the whole viewport — swaying side to side and
 * spinning as they fall, like petals shaken loose from the floral arch.
 * Crisp vectors, no blur. Randomized on the client (same pattern as
 * FloatingIcons) to avoid SSR hydration mismatch.
 */
export default function FallingPetals({ count = 20 }: { count?: number }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const hues = Object.keys(PETAL_FILLS) as Petal["hue"][];
    setPetals(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 12 + 15,
        duration: Math.random() * 7 + 9,
        delay: Math.random() * 6,
        sway: Math.random() * 46 + 18,
        spin: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 260 + 180),
        hue: hues[i % hues.length],
        flip: Math.random() > 0.5,
      }))
    );
  }, [count]);

  if (!petals.length) return null;

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
      {petals.map((p) => (
        <motion.div
          key={p.id}
          style={{ position: "absolute", left: `${p.left}%`, top: -32 }}
          animate={{
            y: ["-4vh", "24vh", "52vh", "80vh", "108vh"],
            x: [0, p.sway, -p.sway * 0.6, p.sway * 0.4, -p.sway * 0.2],
            rotate: [0, p.spin * 0.25, p.spin * 0.5, p.spin * 0.75, p.spin],
            opacity: [0, 0.9, 0.85, 0.65, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <PetalShape id={p.id} hue={p.hue} size={p.size} flip={p.flip} />
        </motion.div>
      ))}
    </div>
  );
}
