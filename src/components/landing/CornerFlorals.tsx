"use client";

import { motion, useTransform } from "framer-motion";
import { usePointerParallax } from "@/lib/usePointerParallax";

const ROSE = { outer: "#F0C3CE", mid: "#DE9AA9", inner: "#C4788A", heart: "#C6A25E", core: "#96702E" };
const LEAF = { fill: "#A3B08F", vein: "#83926F" };

/** Stylized blush rose seen from above — three rings of petals + gold heart. */
function Rose({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={`o${a}`} cx="50" cy="27" rx="15" ry="23" fill={ROSE.outer} transform={`rotate(${a} 50 50)`} />
      ))}
      {[30, 102, 174, 246, 318].map((a) => (
        <ellipse key={`m${a}`} cx="50" cy="33" rx="12" ry="18" fill={ROSE.mid} transform={`rotate(${a} 50 50)`} />
      ))}
      {[0, 90, 180, 270].map((a) => (
        <ellipse key={`i${a}`} cx="50" cy="39" rx="8.5" ry="13" fill={ROSE.inner} transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="8" fill={ROSE.heart} />
      <circle cx="50" cy="50" r="4" fill={ROSE.core} />
    </svg>
  );
}

function Leaf({ size, angle }: { size: number; angle: number }) {
  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox="0 0 60 30"
      style={{ display: "block", transform: `rotate(${angle}deg)` }}
    >
      <path d="M2 15 Q18 -4 58 10 Q34 30 2 15 Z" fill={LEAF.fill} opacity="0.9" />
      <path d="M6 15 Q30 8 54 11" stroke={LEAF.vein} strokeWidth="1.2" fill="none" />
    </svg>
  );
}

/** Tiny gold bud dots that fill out the arrangement. */
function Bud({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: "block" }}>
      <circle cx="10" cy="10" r="7" fill={ROSE.heart} opacity="0.9" />
      <circle cx="10" cy="10" r="3.5" fill={ROSE.core} />
    </svg>
  );
}

const bloomContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.5 } },
};

const bloomItem = {
  hidden: { opacity: 0, scale: 0, rotate: -30 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring" as const, stiffness: 160, damping: 14 },
  },
};

type Piece = {
  kind: "rose" | "leaf" | "bud";
  size: number;
  x: number; // % within cluster box
  y: number;
  angle?: number;
};

/** Layout mirrors the venue's floral arch clusters: one hero bloom, satellites, greenery. */
const CLUSTER: Piece[] = [
  { kind: "leaf", size: 74, x: 30, y: 12, angle: -35 },
  { kind: "leaf", size: 66, x: 6, y: 42, angle: 15 },
  { kind: "leaf", size: 58, x: 48, y: 40, angle: -70 },
  { kind: "rose", size: 92, x: 8, y: 6 },
  { kind: "rose", size: 58, x: 52, y: 20 },
  { kind: "rose", size: 46, x: 26, y: 52 },
  { kind: "bud", size: 18, x: 66, y: 52 },
  { kind: "bud", size: 14, x: 52, y: 64 },
];

function Cluster({ flip }: { flip?: boolean }) {
  return (
    <motion.div
      variants={bloomContainer}
      initial="hidden"
      animate="show"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        transform: flip ? "rotate(180deg)" : undefined,
      }}
    >
      {CLUSTER.map((piece, i) => (
        <motion.div
          key={i}
          variants={bloomItem}
          style={{ position: "absolute", left: `${piece.x}%`, top: `${piece.y}%` }}
        >
          {piece.kind === "rose" ? (
            <Rose size={piece.size} />
          ) : piece.kind === "leaf" ? (
            <Leaf size={piece.size} angle={piece.angle ?? 0} />
          ) : (
            <Bud size={piece.size} />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * Floral arrangements pinned to opposite corners of the hero — they bloom in
 * piece by piece on load, then sway gently forever. Pointer parallax gives
 * them a touch of depth on desktop.
 */
export default function CornerFlorals() {
  const { x: pointerX, y: pointerY } = usePointerParallax();
  const fx = useTransform(pointerX, [-1, 1], [-7, 7]);
  const fy = useTransform(pointerY, [-1, 1], [-7, 7]);

  const corner = (
    styles: React.CSSProperties,
    sway: number,
    options?: { flip?: boolean; size?: string }
  ) => (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        width: options?.size ?? "clamp(170px, 26vw, 300px)",
        height: options?.size ?? "clamp(170px, 26vw, 300px)",
        zIndex: 0,
        pointerEvents: "none",
        x: fx,
        y: fy,
        ...styles,
      }}
    >
      <motion.div
        animate={{ rotate: [-sway, sway, -sway] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: "100%", height: "100%" }}
      >
        <Cluster flip={options?.flip} />
      </motion.div>
    </motion.div>
  );

  return (
    <>
      {corner({ top: "-44px", left: "-48px" }, 1.6)}
      {corner({ bottom: "-44px", right: "-48px" }, 2.2, { flip: true })}
      {corner({ bottom: "-36px", left: "-40px" }, 2.6, {
        size: "clamp(110px, 15vw, 180px)",
      })}
    </>
  );
}
