"use client";

import { motion } from "framer-motion";
import { PetalShape } from "./FallingPetals";
import { Star } from "./Sparkles";

type BurstParticle = {
  id: number;
  angle: number;
  dist: number;
  size: number;
  rot: number;
  kind: "petal" | "star";
  hue: "blush" | "rose" | "gold";
  flip: boolean;
  duration: number;
};

export type Burst = { id: number; particles: BurstParticle[] };

const HUES = ["blush", "rose", "gold"] as const;

/** Build one radial burst; randomness lives here (event time), not in render. */
export function makeBurst(): Burst {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    angle: (i / 16) * Math.PI * 2 + Math.random() * 0.5,
    dist: Math.random() * 90 + 70,
    size: Math.random() * 9 + 11,
    rot: (Math.random() - 0.5) * 360,
    kind: (i % 3 === 0 ? "star" : "petal") as BurstParticle["kind"],
    hue: HUES[i % 3],
    flip: Math.random() > 0.5,
    duration: Math.random() * 0.4 + 0.8,
  }));
  // Particle 0 carries the longest flight so onAnimationComplete on it means
  // the whole burst is done and can be unmounted.
  particles[0].duration = 1.25;
  return { id: Math.floor(Date.now() + Math.random() * 1000), particles };
}

/**
 * Petals + stars exploding radially from the center of whatever positioned
 * element this is rendered inside (the hero medallion).
 */
export default function PetalBurst({
  bursts,
  onDone,
}: {
  bursts: Burst[];
  onDone: (id: number) => void;
}) {
  return (
    <>
      {bursts.map((b) => (
        <div
          key={b.id}
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          {b.particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 0.4, opacity: 1, rotate: 0 }}
              animate={{
                x: Math.cos(p.angle) * p.dist,
                y: Math.sin(p.angle) * p.dist,
                scale: 1,
                opacity: 0,
                rotate: p.rot,
              }}
              transition={{ duration: p.duration, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={p.id === 0 ? () => onDone(b.id) : undefined}
              style={{
                position: "absolute",
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
              }}
            >
              {p.kind === "petal" ? (
                <PetalShape id={`${b.id}-${p.id}`} hue={p.hue} size={p.size} flip={p.flip} />
              ) : (
                <Star size={p.size} hue={p.hue === "gold" ? "gold" : "rose"} />
              )}
            </motion.div>
          ))}
        </div>
      ))}
    </>
  );
}
