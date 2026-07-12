"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function FlipCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      onClick={() => setIsFlipped(!isFlipped)}
      style={{
        perspective: 1000,
        cursor: "pointer",
        width: "100%",
        height: "220px",
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Frente */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, var(--accent-soft) 0%, var(--gold-soft) 100%)",
            border: "1px solid var(--accent)",
            borderRadius: "12px",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: "clamp(16px, 4vw, 18px)",
              fontStyle: "italic",
              color: "var(--text)",
              fontFamily: "var(--font-playfair)",
              fontWeight: 500,
            }}
          >
            Gracias por tu apoyo en este día tan especial
          </motion.p>
        </div>

        {/* Atrás */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, var(--gold) 0%, var(--accent) 100%)",
            border: "1px solid var(--gold-solid)",
            borderRadius: "12px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <p style={{ fontSize: "12px", color: "var(--ivory)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>
              Detalles de la cuenta
            </p>
            <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--ivory)", marginBottom: "8px" }}>
              {process.env.NEXT_PUBLIC_CELEBRANT_NAME}
            </p>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
              Haz clic para voltear
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
