"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Icon = {
  id: number;
  symbol: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

export default function FloatingIcons() {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const symbols = ["✦", "◇", "✦", "✧", "◇", "✧"];
    setIcons(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        symbol: symbols[i % symbols.length],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 12 + 8,
        duration: Math.random() * 6 + 8,
        delay: Math.random() * 2,
        opacity: Math.random() * 0.3 + 0.1,
      }))
    );
  }, []);

  if (!mounted) return null;

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
      {icons.map((icon) => (
        <motion.div
          key={icon.id}
          style={{
            position: "absolute",
            left: `${icon.x}%`,
            top: `${icon.y}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [icon.opacity * 0.5, icon.opacity, icon.opacity * 0.5],
          }}
          transition={{
            duration: icon.duration,
            delay: icon.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span
            style={{
              fontSize: icon.size,
              color: icon.symbol === "◇" ? "#C6A25E" : "#B4707C",
              display: "block",
              lineHeight: 1,
              textShadow: "0 0 8px rgba(180,112,124,0.2)",
            }}
          >
            {icon.symbol}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
