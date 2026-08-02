"use client";

import { motion } from "framer-motion";

export type Particle = { id: number; x: number; y: number };

interface ConfettiProps {
  particles: Particle[];
  onDone: (id: number) => void;
}

export default function Confetti({ particles, onDone }: ConfettiProps) {
  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
          animate={{
            x: p.x + (Math.random() - 0.5) * 200,
            y: p.y + Math.random() * 300,
            opacity: 0,
            scale: 0,
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: Math.random() * 0.5 + 0.8,
            ease: "easeOut",
          }}
          onAnimationComplete={() => onDone(p.id)}
          style={{
            position: "fixed",
            pointerEvents: "none",
            zIndex: 100,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: `hsl(${Math.random() * 60 + 330}, 100%, 60%)`,
              boxShadow: "0 0 4px rgba(255,255,255,0.8)",
            }}
          />
        </motion.div>
      ))}
    </>
  );
}

let particleIdCounter = 0;

export function makeConfettiParticles(x: number, y: number, count: number = 12): Particle[] {
  return Array.from({ length: count }, () => ({
    id: ++particleIdCounter,
    x,
    y,
  }));
}
