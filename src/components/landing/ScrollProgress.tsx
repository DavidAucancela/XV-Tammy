"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.3,
  });

  const backgroundColor = useTransform(scrollYProgress, [0, 0.5, 1], [
    "var(--gold)",
    "var(--accent)",
    "var(--accent-ink)",
  ]);

  const boxShadow = useTransform(scrollYProgress, [0, 1], [
    "0 0 8px rgba(198, 162, 94, 0)",
    "0 0 12px rgba(180, 112, 124, 0.4)",
  ]);

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 60,
        transformOrigin: "0% 50%",
        background: backgroundColor,
        boxShadow,
        scaleX,
      }}
    />
  );
}
