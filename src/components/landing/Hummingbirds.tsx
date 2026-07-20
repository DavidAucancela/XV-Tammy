"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FLOWER_ANCHORS } from "./GardenScene";

export function HummingbirdShape({ size, mirror }: { size: number; mirror?: boolean }) {
  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 48 40"
      style={{ display: "block", transform: mirror ? "scaleX(-1)" : undefined }}
    >
      {/* cola */}
      <path d="M34 24 Q42 30 46 38 Q38 34 32 28 Z" fill="#83926F" opacity="0.85" />
      {/* cuerpo */}
      <path d="M14 18 Q22 10 30 16 Q36 21 34 27 Q28 32 20 28 Q13 24 14 18 Z" fill="#83926F" />
      {/* pecho ivory */}
      <path d="M15 20 Q19 27 26 29 Q19 30 15 25 Z" fill="#FCF6EC" opacity="0.9" />
      {/* cabeza + ojo */}
      <circle cx="14" cy="16" r="5.5" fill="#83926F" />
      <circle cx="12.5" cy="14.8" r="1" fill="#2B211C" />
      {/* pico largo */}
      <path d="M9.5 15.5 L0 13.5" stroke="#4A372E" strokeWidth="1.4" strokeLinecap="round" />
      {/* ala — se anima con rotate rápido desde el wrapper */}
      <ellipse cx="24" cy="14" rx="10" ry="4.5" fill="#A3B08F" opacity="0.9" />
    </svg>
  );
}

type Route = {
  id: number;
  anchors: { x: number; y: number }[];
  cycle: number; // s
  size: number;
  delay: number;
};

// Ciclo entre 3 waypoints con pausas "libando": pares de keyframes repetidos.
const TIMES = [0, 0.18, 0.34, 0.55, 0.72, 1];

/**
 * 1–2 colibríes que recorren las flores de GardenScene (FLOWER_ANCHORS),
 * deteniéndose a libar en cada una. Aleteo rápido en un wrapper anidado.
 */
export default function Hummingbirds() {
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const base: Route[] = [
      {
        id: 0,
        anchors: [FLOWER_ANCHORS[0], FLOWER_ANCHORS[1], FLOWER_ANCHORS[4]],
        cycle: 26,
        size: 34,
        delay: 2,
      },
      {
        id: 1,
        anchors: [FLOWER_ANCHORS[2], FLOWER_ANCHORS[3], FLOWER_ANCHORS[0]],
        cycle: 31,
        size: 30,
        delay: 9,
      },
    ];
    setRoutes(desktop ? base : base.slice(0, 1));
  }, []);

  if (!routes.length) return null;

  return (
    <div
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}
    >
      {routes.map((r) => {
        const [a, b, c] = r.anchors;
        // El ave se posa un poco arriba-izquierda de la flor (pico hacia ella)
        const xs = [a.x, b.x, b.x, c.x, c.x, a.x].map((v) => `${v - 3}vw`);
        const ys = [a.y, b.y, b.y, c.y, c.y, a.y].map((v) => `${v - 6}vh`);
        // Mirar hacia el siguiente destino en cada tramo (pico apunta a -x ⇒
        // mirror cuando viaja hacia +x)
        const dirs = [
          b.x > a.x, b.x > a.x, c.x > b.x, c.x > b.x, a.x > c.x, a.x > c.x,
        ].map((m) => (m ? -1 : 1));
        return (
          <motion.div
            key={r.id}
            style={{ position: "absolute", left: 0, top: 0 }}
            initial={{ x: xs[0], y: ys[0], opacity: 0 }}
            animate={{ x: xs, y: ys, scaleX: dirs, opacity: 1 }}
            transition={{
              x: { duration: r.cycle, times: TIMES, repeat: Infinity, ease: "easeInOut", delay: r.delay },
              y: { duration: r.cycle, times: TIMES, repeat: Infinity, ease: "easeInOut", delay: r.delay },
              scaleX: { duration: r.cycle, times: TIMES, repeat: Infinity, ease: "linear", delay: r.delay },
              opacity: { duration: 1.2, delay: r.delay },
            }}
          >
            {/* hover: leve oscilación vertical continua (libando) */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* aleteo rápido */}
              <motion.div
                animate={{ rotate: [10, -14, 10] }}
                transition={{ duration: 0.14, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "55% 40%" }}
              >
                <HummingbirdShape size={r.size} />
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
