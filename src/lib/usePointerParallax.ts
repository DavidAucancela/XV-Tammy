"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

/**
 * Normalized pointer position (-1..1 per axis), spring-smoothed. Only tracks
 * the pointer on devices with a precise pointer (desktop mouse) — touch
 * devices get no listener at all, so mobile stays untouched.
 */
export function usePointerParallax(): { x: MotionValue<number>; y: MotionValue<number> } {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.4 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    // Motion values no pasan por MotionConfig — gate manual de reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function handleMove(e: PointerEvent) {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    }

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [rawX, rawY]);

  return { x, y };
}
