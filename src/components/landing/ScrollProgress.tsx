"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin fixed bar reflecting how far down /recuerdos the visitor has
 * scrolled — a quiet cue that there's more content below the fold.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 60,
        transformOrigin: "0% 50%",
        background: "linear-gradient(90deg, var(--gold), var(--accent))",
        scaleX,
      }}
    />
  );
}
