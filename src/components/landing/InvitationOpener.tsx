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
    // Múltiples bursts para más drama
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
              background:
                "radial-gradient(circle at 50% 38%, rgba(var(--gold-rgb), 0.14) 0%, transparent 55%), var(--bg)",
              textAlign: "center",
              padding: 24,
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
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
              whileTap={phase === "sealed" ? { scale: 0.92 } : {}}
              animate={
                phase === "opening"
                  ? { scale: 1.25, opacity: 0, rotate: 12 }
                  : reducedMotion
                    ? undefined
                    : { scale: [1, 1.045, 1] }
              }
              transition={
                phase === "opening"
                  ? { duration: 0.6, ease: "easeOut" }
                  : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
              }
              style={{
                position: "relative",
                width: "clamp(140px, 22vh, 190px)",
                height: "clamp(140px, 22vh, 190px)",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              {/* Glow background mejorado */}
              <motion.div
                aria-hidden
                animate={
                  phase === "sealed" && !reducedMotion
                    ? { opacity: [0.6, 0.9, 0.6] }
                    : {}
                }
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  inset: -26,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(var(--gold-rgb),0.4) 0%, rgba(var(--accent-rgb),0.28) 45%, transparent 72%)",
                  filter: "blur(14px)",
                }}
              />

              {/* Seal circle */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  padding: 3,
                  background:
                    "conic-gradient(from 200deg, var(--gold-solid), var(--accent), var(--gold-solid))",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    padding: 6,
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
                      gap: 2,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontSize: "clamp(3rem, 8vh, 4.2rem)",
                        lineHeight: 1,
                        color: "var(--accent-ink)",
                      }}
                    >
                      {initial}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.34em",
                        textTransform: "uppercase",
                        color: "var(--gold-solid)",
                        marginLeft: "0.34em",
                      }}
                    >
                      XV
                    </span>
                  </motion.div>
                </div>
              </div>

              <PetalBurst bursts={bursts} onDone={(id) => setBursts((p) => p.filter((b) => b.id !== id))} />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              style={{ display: "flex", alignItems: "center", gap: 14 }}
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
