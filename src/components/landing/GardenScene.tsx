"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { usePointerParallax } from "@/lib/usePointerParallax";
import { Rose, Leaf, Bud } from "./CornerFlorals";

// Posiciones (vw/vh) de las flores de las ramas laterales — Hummingbirds las
// usa como waypoints para "libar". Mantener en sincronía con las ramas de abajo.
export const FLOWER_ANCHORS: { x: number; y: number }[] = [
  { x: 7, y: 36 },
  { x: 13, y: 46 },
  { x: 92, y: 15 },
  { x: 87, y: 26 },
  { x: 16, y: 79 },
];

const SAGE = "#A3B08F";
const SAGE_DEEP = "#83926F";
const BRANCH = "#96702E";

/** Banda de follaje acuarela: montículos superpuestos con opacidades distintas. */
function FoliageBand() {
  return (
    <svg
      viewBox="0 0 1440 300"
      preserveAspectRatio="none"
      style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "26vh", display: "block" }}
    >
      <path
        d="M0 300 L0 210 Q120 150 280 195 Q430 235 560 185 Q700 130 860 190 Q1010 240 1150 195 Q1300 150 1440 205 L1440 300 Z"
        fill={SAGE}
        opacity="0.22"
      />
      <path
        d="M0 300 L0 245 Q160 190 330 230 Q490 265 640 225 Q800 180 950 230 Q1110 275 1250 235 Q1360 205 1440 240 L1440 300 Z"
        fill={SAGE}
        opacity="0.34"
      />
      <path
        d="M0 300 L0 272 Q200 235 400 262 Q600 288 800 260 Q1000 233 1200 264 Q1330 282 1440 268 L1440 300 Z"
        fill={SAGE_DEEP}
        opacity="0.24"
      />
    </svg>
  );
}

/** Rama con hojas y flores; las flores coinciden con FLOWER_ANCHORS. */
function Branch({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      style={{
        position: "absolute",
        top: isLeft ? "30vh" : "9vh",
        [isLeft ? "left" : "right"]: "-2vw",
        width: "clamp(150px, 20vw, 280px)",
        transform: isLeft ? undefined : "scaleX(-1)",
      }}
    >
      <svg viewBox="0 0 200 160" style={{ display: "block", width: "100%" }}>
        <path
          d="M-10 30 Q60 38 110 70 Q150 96 165 140"
          stroke={BRANCH}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M50 41 Q80 20 118 22 M108 68 Q140 58 168 66"
          stroke={BRANCH}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.32"
        />
      </svg>
      <div style={{ position: "absolute", top: "2%", left: "52%" }}>
        <Leaf size={44} angle={isLeft ? -24 : 24} />
      </div>
      <div style={{ position: "absolute", top: "48%", left: "72%" }}>
        <Leaf size={38} angle={isLeft ? 40 : -40} />
      </div>
      <div style={{ position: "absolute", top: "8%", left: "20%" }}>
        <Rose size={46} />
      </div>
      <div style={{ position: "absolute", top: "52%", left: "44%" }}>
        <Rose size={34} />
      </div>
      <div style={{ position: "absolute", top: "80%", left: "74%" }}>
        <Bud size={14} />
      </div>
    </div>
  );
}

/** Enredadera de esquina: vid curva con hojitas — nodos baratos (solo strokes). */
function Vine({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const flip = {
    tl: undefined,
    tr: "scaleX(-1)",
    bl: "scaleY(-1)",
    br: "scale(-1,-1)",
  }[corner];
  const anchor: React.CSSProperties = {
    tl: { top: -8, left: -8 },
    tr: { top: -8, right: -8 },
    bl: { bottom: -8, left: -8 },
    br: { bottom: -8, right: -8 },
  }[corner];
  return (
    <svg
      viewBox="0 0 220 220"
      style={{
        position: "absolute",
        width: "clamp(120px, 17vw, 210px)",
        transform: flip,
        ...anchor,
        display: "block",
      }}
    >
      <path
        d="M4 4 Q30 90 100 120 Q160 145 210 150"
        stroke={SAGE_DEEP}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
      <path
        d="M14 40 Q40 44 52 66 M40 92 Q66 90 82 108 M110 124 Q128 116 150 122 M160 136 Q176 128 196 134"
        stroke={SAGE}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {[
        { cx: 52, cy: 66, r: 8, rot: 35 },
        { cx: 82, cy: 108, r: 7, rot: 15 },
        { cx: 150, cy: 122, r: 6.5, rot: -8 },
        { cx: 196, cy: 134, r: 6, rot: -20 },
      ].map((l, i) => (
        <ellipse
          key={i}
          cx={l.cx}
          cy={l.cy}
          rx={l.r * 1.7}
          ry={l.r}
          fill={SAGE}
          opacity="0.55"
          transform={`rotate(${l.rot} ${l.cx} ${l.cy})`}
        />
      ))}
    </svg>
  );
}

/** Briznas de primer plano en el borde inferior. */
function GrassBlades({ side }: { side: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 160 120"
      style={{
        position: "absolute",
        bottom: -4,
        [side]: "4vw",
        width: "clamp(90px, 12vw, 150px)",
        display: "block",
        transform: side === "right" ? "scaleX(-1)" : undefined,
      }}
    >
      {[
        "M20 120 Q14 60 34 18",
        "M52 120 Q56 66 44 30",
        "M84 120 Q94 70 82 40",
        "M118 120 Q112 78 128 52",
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={i % 2 ? SAGE : SAGE_DEEP}
          strokeWidth={3.4 - i * 0.4}
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      ))}
    </svg>
  );
}

/** Capa con parallax: amplitud = profundidad (px). */
function Layer({
  px,
  py,
  depth,
  children,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  depth: number;
  children: React.ReactNode;
}) {
  const x = useTransform(px, [-1, 1], [-depth, depth]);
  const y = useTransform(py, [-1, 1], [-depth * 0.7, depth * 0.7]);
  return (
    <motion.div style={{ position: "absolute", inset: 0, x, y }}>{children}</motion.div>
  );
}

/**
 * Escena de jardín ilustrada por capas (estilo acuarela en la paleta
 * champagne). Independiente del cursor por defecto — el movimiento vivo lo
 * ponen FallingPetals, Fireflies, Hummingbirds y las mariposas. Pasa
 * `parallax` para activar el desplazamiento sutil por puntero en páginas
 * donde tenga sentido (p. ej. /recuerdos).
 */
export default function GardenScene({ parallax = false }: { parallax?: boolean }) {
  const { x, y } = usePointerParallax(parallax);

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* 1 — lavado atmosférico */}
      <Layer px={x} py={y} depth={3}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id="wash-gold" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(198,162,94,0.10)" />
              <stop offset="100%" stopColor="rgba(198,162,94,0)" />
            </radialGradient>
            <radialGradient id="wash-rose" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(180,112,124,0.07)" />
              <stop offset="100%" stopColor="rgba(180,112,124,0)" />
            </radialGradient>
          </defs>
          <ellipse cx="30" cy="78" rx="45" ry="30" fill="url(#wash-gold)" />
          <ellipse cx="76" cy="22" rx="40" ry="28" fill="url(#wash-rose)" />
        </svg>
      </Layer>

      {/* 2 — follaje trasero */}
      <Layer px={x} py={y} depth={6}>
        <FoliageBand />
      </Layer>

      {/* 3 — ramas laterales con flores (waypoints de colibríes) */}
      <Layer px={x} py={y} depth={10}>
        <Branch side="left" />
        <Branch side="right" />
      </Layer>

      {/* 4 — enredaderas de esquinas (la tr no tiene CornerFlorals) */}
      <Layer px={x} py={y} depth={12}>
        <Vine corner="tr" />
        <Vine corner="bl" />
      </Layer>

      {/* 5 — briznas de primer plano */}
      <Layer px={x} py={y} depth={16}>
        <GrassBlades side="left" />
        <GrassBlades side="right" />
      </Layer>
    </motion.div>
  );
}
