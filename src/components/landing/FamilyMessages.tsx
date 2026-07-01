"use client";

import { motion } from "framer-motion";
import TiltCard from "./TiltCard";
import RevealText from "./RevealText";

type Message = { author: string; role: string; text: string };

export default function FamilyMessages({ messages }: { messages: Message[] }) {
  return (
    <section
      id="familia"
      style={{ padding: "100px 24px", background: "rgba(9, 4, 13, 0.90)" }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <p
            style={{
              fontSize: 9,
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "#e8699a",
              marginBottom: 16,
            }}
          >
            ✦ &nbsp; con amor &nbsp; ✦
          </p>
          <RevealText
            tag="h2"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(1.9rem, 5.5vw, 3rem)",
              fontWeight: 400,
              color: "#fdf0f8",
              marginBottom: 20,
              justifyContent: "center",
            }}
          >
            Mensajes de la Familia
          </RevealText>
          <div
            style={{
              width: 52,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, #e8699a, transparent)",
              margin: "0 auto",
            }}
          />
        </motion.div>

        {/* Message cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? -0.8 : 0.8 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard
                maxTilt={7}
                glowColor="rgba(232,105,154,0.18)"
                style={{
                  background: "rgba(22, 13, 30, 0.95)",
                  border: "1px solid #251535",
                  borderRadius: 22,
                  padding: "36px 30px 28px",
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                {/* Decorative radial behind quote mark */}
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(232,105,154,0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                />

                {/* Opening quote */}
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 20,
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: 80,
                    lineHeight: 1,
                    color: "#e8699a",
                    opacity: 0.10,
                    userSelect: "none",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                >
                  "
                </span>

                <p
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: 15,
                    lineHeight: 1.85,
                    color: "#e0c0d0",
                    fontStyle: "italic",
                    marginBottom: 24,
                    marginTop: 14,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {msg.text}
                </p>

                <div
                  style={{
                    borderTop: "1px solid rgba(37,21,53,0.8)",
                    paddingTop: 18,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      color: "#e8699a",
                      fontWeight: 600,
                      marginBottom: 3,
                    }}
                  >
                    — {msg.author}
                  </p>
                  <p
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#7a5870",
                    }}
                  >
                    {msg.role}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
