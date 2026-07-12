"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Fades the incoming route in, keyed by pathname, so the jump between `/`
 * and `/recuerdos` reads as a soft crossfade instead of an instant cut.
 *
 * Deliberately NOT AnimatePresence: wrapping the whole app in
 * `AnimatePresence mode="wait"` freezes every descendant's looping
 * animation (petals, butterflies, sparkles all complete instantly and
 * never repeat). Enter-only fade gives 90% of the effect with none of
 * the breakage.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
