"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Flight = {
  id: number;
  y: number; // vh
  reverse: boolean;
  duration: number;
  size: number;
};

function BirdShape({ size, mirror }: { size: number; mirror?: boolean }) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 40 24"
      style={{ display: "block", transform: mirror ? "scaleX(-1)" : undefined }}
    >
      {/* silueta tipo golondrina: cuerpo + cola bífida */}
      <path
        d="M4 12 Q14 8 22 11 L37 7 L26 13 L34 19 L21 14 Q13 16 4 12 Z"
        fill="var(--text)"
        opacity="0.55"
      />
    </svg>
  );
}

/**
 * Un ave pequeña cruza la franja alta de la pantalla de vez en cuando
 * (25–45s). Un solo sprite reciclado; con reduced-motion no vuela.
 */
export default function PassingBirds() {
  const [flight, setFlight] = useState<Flight | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const schedule = (delayMs: number) => {
      timer.current = setTimeout(() => {
        if (cancelled) return;
        const f: Flight = {
          id: Date.now(),
          y: Math.random() * 12 + 6,
          reverse: Math.random() > 0.5,
          duration: Math.random() * 2 + 7,
          size: Math.random() * 4 + 18,
        };
        setFlight(f);
        // Al terminar el vuelo, limpiar y reprogramar el siguiente
        timer.current = setTimeout(() => {
          if (cancelled) return;
          setFlight(null);
          schedule(Math.random() * 20_000 + 25_000);
        }, f.duration * 1000 + 300);
      }, delayMs);
    };

    schedule(Math.random() * 8_000 + 12_000); // primer avistamiento más pronto

    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (!flight) return null;

  return (
    <div
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}
    >
      <motion.div
        key={flight.id}
        style={{ position: "absolute", top: `${flight.y}vh`, left: 0 }}
        initial={{ x: flight.reverse ? "106vw" : "-6vw" }}
        animate={{
          x: flight.reverse ? "-6vw" : "106vw",
          y: ["0vh", "-2.5vh", "1vh", "-1.5vh", "0vh"],
        }}
        transition={{ duration: flight.duration, ease: "linear" }}
      >
        {/* aleteo: compresión vertical rápida */}
        <motion.div
          animate={{ scaleY: [1, 0.55, 1] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        >
          <BirdShape size={flight.size} mirror={flight.reverse} />
        </motion.div>
      </motion.div>
    </div>
  );
}
