"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion";
import { CSSProperties, ReactNode } from "react";

export default function TiltCard({
  children,
  style,
  glowColor = "rgba(232,105,154,0.22)",
  maxTilt = 6,
}: {
  children: ReactNode;
  style?: CSSProperties;
  glowColor?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const rawGlowOpacity = useMotionValue(0);

  const rotateY = useSpring(
    useTransform(rawX, [-0.5, 0.5], [-maxTilt, maxTilt]),
    { stiffness: 160, damping: 24 }
  );
  const rotateX = useSpring(
    useTransform(rawY, [-0.5, 0.5], [maxTilt, -maxTilt]),
    { stiffness: 160, damping: 24 }
  );
  const glowOpacity = useSpring(rawGlowOpacity, { stiffness: 200, damping: 28 });

  const glowBackground = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, ${glowColor} 0%, transparent 65%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    glowX.set(((e.clientX - rect.left) / rect.width) * 100);
    glowY.set(((e.clientY - rect.top) / rect.height) * 100);
    rawGlowOpacity.set(1);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    rawGlowOpacity.set(0);
  };

  return (
    <div style={{ perspective: "900px" }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          ...style,
          rotateX,
          rotateY,
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Cursor-following glow */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: glowBackground,
            opacity: glowOpacity,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
        {children}
      </motion.div>
    </div>
  );
}
