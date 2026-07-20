"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Firefly = {
  id: number;
  x: number; // vw
  y: number; // vh
  size: number;
  driftX: number;
  driftY: number;
  driftDur: number;
  flickerDur: number;
  delay: number;
};

/**
 * Luciérnagas: puntos dorados que derivan lento y parpadean. Glow logrado con
 * radial-gradient + box-shadow (nada de filter:blur). 1 nodo DOM por bicho.
 */
export default function Fireflies() {
  const [flies, setFlies] = useState<Firefly[]>([]);

  useEffect(() => {
    const count = window.matchMedia("(min-width: 768px)").matches ? 12 : 8;
    setFlies(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        // Concentradas en el tercio inferior y bordes laterales
        x: i % 3 === 0 ? Math.random() * 22 + 2 : i % 3 === 1 ? Math.random() * 22 + 76 : Math.random() * 60 + 20,
        y: Math.random() * 40 + 55,
        size: Math.random() * 1.5 + 3.5,
        driftX: (Math.random() - 0.5) * 110,
        driftY: (Math.random() - 0.5) * 70,
        driftDur: Math.random() * 6 + 8,
        flickerDur: Math.random() * 2.5 + 2.2,
        delay: Math.random() * 4,
      }))
    );
  }, []);

  if (!flies.length) return null;

  return (
    <div
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}
    >
      {flies.map((f) => (
        <motion.div
          key={f.id}
          animate={{
            x: [0, f.driftX, 0],
            y: [0, f.driftY, 0],
            opacity: [0.1, 1, 0.15, 0.9, 0.1],
          }}
          transition={{
            x: { duration: f.driftDur, repeat: Infinity, ease: "easeInOut", delay: f.delay },
            y: { duration: f.driftDur * 1.25, repeat: Infinity, ease: "easeInOut", delay: f.delay },
            opacity: { duration: f.flickerDur, repeat: Infinity, ease: "easeInOut", delay: f.delay },
          }}
          style={{
            position: "absolute",
            left: `${f.x}vw`,
            top: `${f.y}vh`,
            width: f.size,
            height: f.size,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,235,180,0.95) 0%, rgba(var(--gold-rgb),0.5) 40%, transparent 70%)",
            boxShadow: "0 0 8px 3px rgba(var(--gold-rgb),0.35)",
          }}
        />
      ))}
    </div>
  );
}
