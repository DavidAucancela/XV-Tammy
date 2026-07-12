"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Star } from "./Sparkles";

type TrailSpark = {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: "gold" | "rose";
  drift: number;
};

/**
 * Little stars trail behind the pointer (mouse move or touch drag) and fade
 * out — throttled by time + distance so a fast swipe leaves an even trail
 * instead of flooding the DOM. Capped at ~24 live sparks.
 */
export default function SparkleTrail() {
  const [sparks, setSparks] = useState<TrailSpark[]>([]);
  const last = useRef({ x: -100, y: -100, t: 0 });
  const counter = useRef(0);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const now = performance.now();
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      if (now - last.current.t < 40 || dx * dx + dy * dy < 480) return;
      last.current = { x: e.clientX, y: e.clientY, t: now };
      const spark: TrailSpark = {
        id: counter.current++,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 8 + 7,
        hue: Math.random() > 0.4 ? "gold" : "rose",
        drift: (Math.random() - 0.5) * 26,
      };
      setSparks((prev) => [...prev.slice(-23), spark]);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const remove = (id: number) => setSparks((prev) => prev.filter((s) => s.id !== id));

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {sparks.map((s) => (
        <motion.div
          key={s.id}
          animate={{
            scale: [0, 1, 0],
            opacity: [0.95, 0.9, 0],
            rotate: 45,
            y: [0, 15],
            x: [0, s.drift],
          }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          onAnimationComplete={() => remove(s.id)}
          style={{
            position: "absolute",
            left: s.x - s.size / 2,
            top: s.y - s.size / 2,
          }}
        >
          <Star size={s.size} hue={s.hue} />
        </motion.div>
      ))}
    </div>
  );
}
