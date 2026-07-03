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
          <div className="ornament-divider">
            <span>✦</span>
          </div>
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
              key={msg.author}
              initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? -0.8 : 0.8 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard
                maxTilt={7}
                glowColor="rgba(232,105,154,0.18)"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(30,16,38,0.96) 0%, rgba(22,13,30,0.96) 55%, rgba(26,12,28,0.96) 100%)",
                  border: "1px solid var(--gold-soft, rgba(210,155,55,0.35))",
                  borderRadius: 22,
                  padding: "40px 32px 30px",
                  position: "relative",
                  height: "100%",
                  boxShadow:
                    "inset 0 0 0 1px rgba(13,6,16,0.9), 0 0 40px rgba(232,105,154,0.06)",
                }}
              >
                {/* Inner hairline frame */}
                <div
                  style={{
                    position: "absolute",
                    inset: 7,
                    borderRadius: 16,
                    border: "1px solid var(--gold-faint, rgba(210,155,55,0.14))",
                    pointerEvents: "none",
                  }}
                />

                {/* Corner ornaments */}
                {[
                  { top: 12, left: 16 },
                  { top: 12, right: 16 },
                  { bottom: 12, left: 16 },
                  { bottom: 12, right: 16 },
                ].map((pos, j) => (
                  <span
                    key={j}
                    style={{
                      position: "absolute",
                      ...pos,
                      fontSize: 8,
                      color: "var(--gold-soft, rgba(210,155,55,0.35))",
                      pointerEvents: "none",
                      lineHeight: 1,
                    }}
                  >
                    ✦
                  </span>
                ))}

                {/* Opening quote */}
                <span
                  aria-hidden
                  style={{
                    display: "block",
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: 52,
                    lineHeight: 0.6,
                    color: "var(--gold, rgba(210,155,55,0.55))",
                    userSelect: "none",
                    marginBottom: 18,
                  }}
                >
                  &ldquo;
                </span>

                <p
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: 16.5,
                    lineHeight: 1.9,
                    color: "#ecd2df",
                    fontStyle: "italic",
                    marginBottom: 26,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {msg.text}
                </p>

                {/* Gradient separator */}
                <div
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, var(--gold-soft, rgba(210,155,55,0.35)), transparent)",
                    marginBottom: 18,
                  }}
                />

                {/* Author with monogram */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <span
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: "1px solid var(--gold-soft, rgba(210,155,55,0.35))",
                      background: "rgba(210,155,55,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      fontSize: 17,
                      color: "var(--gold, rgba(210,155,55,0.55))",
                      flexShrink: 0,
                    }}
                  >
                    {msg.author.charAt(0)}
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontSize: 15,
                        color: "#fdf0f8",
                        marginBottom: 3,
                      }}
                    >
                      {msg.author}
                    </p>
                    <p
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "#b0798f",
                      }}
                    >
                      {msg.role}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
