"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Spark = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  repeatDelay: number;
  hue: "gold" | "rose";
};

/** Crisp four-point star, like a camera flash catching the fairy lights. */
export function Star({ size, hue }: { size: number; hue: "gold" | "rose" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: "block" }}>
      <path
        d="M10 0 C10.8 6.5 13.5 9.2 20 10 C13.5 10.8 10.8 13.5 10 20 C9.2 13.5 6.5 10.8 0 10 C6.5 9.2 9.2 6.5 10 0 Z"
        fill={hue === "gold" ? "#D9B36C" : "#DE9AA9"}
      />
      <circle cx="10" cy="10" r="1.6" fill="#FCF6EC" />
    </svg>
  );
}

/**
 * Twinkling stars scattered over the hero — each one pops in with a spin,
 * shines, and fades out on its own rhythm. Sharp vectors, zero blur.
 */
export default function Sparkles({ count = 14 }: { count?: number }) {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    setSparks(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 10 + 9,
        duration: Math.random() * 1.4 + 1.6,
        delay: Math.random() * 5,
        repeatDelay: Math.random() * 3 + 1,
        hue: Math.random() > 0.35 ? "gold" : "rose",
      }))
    );
  }, [count]);

  if (!sparks.length) return null;

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
      {sparks.map((s) => (
        <motion.div
          key={s.id}
          style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%` }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.95, 0],
            rotate: [0, 90],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: s.repeatDelay,
            ease: "easeInOut",
          }}
        >
          <Star size={s.size} hue={s.hue} />
        </motion.div>
      ))}
    </div>
  );
}
