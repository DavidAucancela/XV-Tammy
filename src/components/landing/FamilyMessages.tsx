"use client";

import { motion } from "framer-motion";
import type { FamilyItem } from "@/data/landingContent";

export default function FamilyMessages({ items }: { items: FamilyItem[] }) {
  return (
    <div>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          style={{
            position: "relative",
            borderRadius: 24,
            padding: 1,
            background:
              "linear-gradient(120deg, rgba(255, 193, 7, 0.6), rgba(255, 152, 0, 0.5), rgba(255, 193, 7, 0.4))",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div
            style={{
              borderRadius: 23,
              background:
                "linear-gradient(160deg, rgba(255, 250, 205, 0.95) 0%, rgba(255, 245, 157, 0.9) 100%)",
              padding: "60px 40px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F57C00"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>

            <div>
              <h3
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
                  fontWeight: 400,
                  color: "#F57C00",
                  margin: "0 0 12px",
                }}
              >
                ¡Proximamente!
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: "#E65100",
                  lineHeight: 1.7,
                  margin: 0,
                  maxWidth: 450,
                }}
              >
                Estamos preparando los mensajes especiales de tu familia. Pronto podrás leer y ver los videos con mucho amor.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
