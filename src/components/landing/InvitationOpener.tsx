"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PetalBurst, { makeBurst, type Burst } from "./PetalBurst";

const SESSION_KEY = "xv-invite-opened";

export default function InvitationOpener({
  celebrant,
  children,
}: {
  celebrant: string;
  children: ReactNode;
}) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "open">("sealed");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (sessionStorage.getItem(SESSION_KEY)) setPhase("open");
  }, []);

  const open = () => {
    if (phase !== "sealed") return;
    sessionStorage.setItem(SESSION_KEY, "1");
    window.dispatchEvent(new CustomEvent("xv:invite-opened"));
    setBursts([makeBurst(), makeBurst()]);
    setPhase("opening");
    setTimeout(() => setPhase("open"), reducedMotion ? 300 : 1000);
  };

  const initial = celebrant.trim().charAt(0).toUpperCase() || "XV";

  return (
    <>
      {phase !== "sealed" && children}
      <AnimatePresence>
        {phase !== "open" && (
          <motion.div
            initial={false}
            exit={
              reducedMotion
                ? { opacity: 0, transition: { duration: 0.3 } }
                : {
                    opacity: 0,
                    y: "-8%",
                    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                  }
            }
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 300,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(22px, 5vh, 40px)",
              textAlign: "center",
              padding: 24,
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={phase === "sealed" ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: reducedMotion ? 0.2 : 0.4, ease: "easeOut" }}
              style={{
                position: "relative",
                zIndex: 1,
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(1.3rem, 4.5vw, 2rem)",
                fontStyle: "italic",
                color: "var(--accent-ink)",
                margin: 0,
              }}
            >
              Tienes una invitación
            </motion.p>

            <motion.button
              onClick={open}
              aria-label="Abrir la invitación"
              whileTap={phase === "sealed" ? { scale: 0.94 } : {}}
              animate={
                phase === "opening"
                  ? { scale: 0.88, opacity: 0, y: 20 }
                  : reducedMotion
                    ? undefined
                    : { scale: [1, 1.02, 1], y: [0, -3, 0] }
              }
              transition={
                phase === "opening"
                  ? { duration: 0.9, ease: "easeOut" }
                  : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
              }
              style={{
                position: "relative",
                width: "clamp(220px, 40vh, 300px)",
                height: "clamp(260px, 46vh, 360px)",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              {/* Cuerpo del sobre (rectángulo pergamino) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, #FAF8F3 0%, #F4EDE3 50%, #EBE0D5 100%)",
                  borderRadius: "1px",
                  border: "1.5px solid rgba(198,162,94,0.35)",
                  boxShadow: "0 10px 28px rgba(43,33,28,0.14), inset 0 1px 2px rgba(255,255,255,0.7)",
                }}
              >
                {/* Decoración sutil: flores pequeñas en las esquinas */}
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    fontSize: "11px",
                    opacity: 0.45,
                    color: "rgba(180,112,124,0.6)",
                  }}
                >
                  ✿
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    fontSize: "9px",
                    opacity: 0.35,
                    color: "rgba(198,162,94,0.5)",
                  }}
                >
                  ✤
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 14,
                    left: 14,
                    fontSize: "9px",
                    opacity: 0.35,
                    color: "rgba(198,162,94,0.5)",
                  }}
                >
                  ✤
                </div>
              </div>

              {/* Sello en la esquina inferior derecha */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  right: "-20px",
                  zIndex: 10,
                }}
              >
                {/* Glow background del sello */}
                <motion.div
                  aria-hidden
                  animate={
                    phase === "sealed" && !reducedMotion
                      ? { opacity: [0.5, 0.8, 0.5] }
                      : {}
                  }
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    inset: -20,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(var(--accent-rgb),0.35) 0%, transparent 65%)",
                    filter: "blur(12px)",
                  }}
                />

                {/* Seal circle */}
                <div
                  style={{
                    position: "relative",
                    width: "clamp(90px, 16vh, 130px)",
                    height: "clamp(90px, 16vh, 130px)",
                    borderRadius: "50%",
                    padding: 3,
                    background:
                      "conic-gradient(from 200deg, var(--gold-solid), var(--accent), var(--gold-solid))",
                    boxShadow: "0 6px 18px rgba(43,33,28,0.2)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      padding: 5,
                      background: "var(--ivory)",
                    }}
                  >
                    <motion.div
                      animate={
                        phase === "sealed" && !reducedMotion ? { rotate: 360 } : {}
                      }
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        border: "1px solid rgba(var(--gold-rgb), 0.5)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-playfair), Georgia, serif",
                          fontSize: "clamp(2rem, 5vh, 2.6rem)",
                          lineHeight: 1,
                          color: "var(--accent-ink)",
                        }}
                      >
                        {initial}
                      </span>
                      <span
                        style={{
                          fontSize: 8,
                          letterSpacing: "0.32em",
                          textTransform: "uppercase",
                          color: "var(--gold-solid)",
                          marginLeft: "0.32em",
                        }}
                      >
                        XV
                      </span>
                    </motion.div>
                  </div>
                </div>

                <PetalBurst bursts={bursts} onDone={(id) => setBursts((p) => p.filter((b) => b.id !== id))} />
              </div>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={phase === "sealed" ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: reducedMotion ? 0.2 : 0.4, ease: "easeOut", delay: phase === "sealed" ? 0.2 : 0 }}
              style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 14 }}
            >
              <span
                aria-hidden
                style={{
                  width: 36,
                  height: 1,
                  background: "linear-gradient(90deg, transparent, var(--gold))",
                }}
              />
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                Toca el sello para abrir
              </p>
              <span
                aria-hidden
                style={{
                  width: 36,
                  height: 1,
                  background: "linear-gradient(90deg, var(--gold), transparent)",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
