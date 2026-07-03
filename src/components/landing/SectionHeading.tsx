"use client";

import { motion } from "framer-motion";
import RevealText from "./RevealText";

export default function SectionHeading({
  eyebrow,
  title,
  marginBottom = 56,
}: {
  eyebrow: string;
  title: string;
  marginBottom?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      style={{ textAlign: "center", marginBottom, position: "relative" }}
    >
      {/* Soft glow spotlighting the title, matching the site's mesh-gradient look */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 320,
          height: 160,
          background:
            "radial-gradient(ellipse at center, rgba(232,105,154,0.14) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <p
        style={{
          position: "relative",
          fontSize: 9,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "#e8699a",
          marginBottom: 18,
        }}
      >
        ✦ &nbsp; {eyebrow} &nbsp; ✦
      </p>
      <RevealText
        tag="h2"
        style={{
          position: "relative",
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: "clamp(2rem, 5.5vw, 3.2rem)",
          fontWeight: 400,
          letterSpacing: "0.01em",
          color: "#fdf0f8",
          textShadow: "0 0 44px rgba(232,105,154,0.28)",
          marginBottom: 22,
          justifyContent: "center",
        }}
      >
        {title}
      </RevealText>
      <div className="ornament-divider">
        <span>✦</span>
      </div>
    </motion.div>
  );
}
