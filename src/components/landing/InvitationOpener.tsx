"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
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
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotX = useSpring(tiltX, { stiffness: 120, damping: 16 });
  const rotY = useSpring(tiltY, { stiffness: 120, damping: 16 });

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
    setTimeout(() => setPhase("open"), reducedMotion ? 300 : 1700);
  };

  const initial = celebrant.trim().charAt(0).toUpperCase() || "XV";
  const firstName = celebrant.trim().split(/\s+/)[0] || "XV Años";
  const opening = phase === "opening";
  const sealed = phase === "sealed";
  const anim = !reducedMotion;
  const serif = "var(--font-playfair), Georgia, serif";

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "touch" || !sealed || reducedMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 18);
    tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 14);
  };
  const onPointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const pocket = (clip: string, bg: string) => (
    <div aria-hidden style={{ position: "absolute", inset: 0, clipPath: clip, background: bg }} />
  );

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
                : { opacity: 0, scale: 1.06, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
            }
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 300,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(28px, 6vh, 52px)",
              textAlign: "center",
              padding: 24,
              overflow: "hidden",
            }}
          >
            {/* Resplandor de fondo */}
            <motion.div
              aria-hidden
              animate={sealed && anim ? { opacity: [0.55, 0.9, 0.55], scale: [1, 1.08, 1] } : { opacity: 0.6 }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                width: "min(120vw, 720px)",
                height: "min(120vw, 720px)",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(var(--gold-rgb),0.30) 0%, rgba(var(--accent-rgb),0.12) 40%, transparent 70%)",
                filter: "blur(24px)",
                pointerEvents: "none",
              }}
            />
            {/* Motas doradas flotando */}
            {anim &&
              Array.from({ length: 14 }, (_, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={sealed ? { y: [0, -40, 0], opacity: [0, 0.8, 0] } : { opacity: 0 }}
                  transition={{ duration: 5 + (i % 5), repeat: Infinity, delay: (i * 0.45) % 4, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    left: `${(i * 37 + 8) % 96}%`,
                    top: `${(i * 53 + 12) % 88}%`,
                    width: 3 + (i % 3),
                    height: 3 + (i % 3),
                    borderRadius: "50%",
                    background: "var(--gold)",
                    pointerEvents: "none",
                  }}
                />
              ))}

            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={sealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: reducedMotion ? 0.2 : 0.6, ease: "easeOut" }}
              style={{
                position: "relative",
                zIndex: 1,
                fontFamily: serif,
                fontSize: "clamp(1.5rem, 5.5vw, 2.3rem)",
                fontStyle: "italic",
                color: "var(--accent-ink)",
                margin: 0,
              }}
            >
              Tienes una invitación
            </motion.p>

            <motion.button
              onClick={open}
              onPointerMove={onPointerMove}
              onPointerLeave={onPointerLeave}
              aria-label="Abrir la invitación"
              initial={{ opacity: 0, y: 30, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileTap={sealed ? { scale: 0.97 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{
                position: "relative",
                zIndex: 1,
                width: "clamp(270px, 80vw, 380px)",
                aspectRatio: "10 / 7",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: sealed ? "pointer" : "default",
                perspective: 1000,
                containerType: "inline-size",
                marginTop: "clamp(40px, 8vh, 80px)",
              }}
            >
              <motion.div
                animate={sealed && anim ? { y: [0, -9, 0], rotateZ: [-0.8, 0.8, -0.8] } : {}}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  rotateX: rotX,
                  rotateY: rotY,
                  transformStyle: "preserve-3d",
                  filter: "drop-shadow(0 18px 24px rgba(43,33,28,0.25))",
                }}
              >
                {/* Fondo / interior del sobre */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 6,
                    background: "linear-gradient(160deg, #E9D2C0 0%, #D9B8A3 100%)",
                  }}
                />

                {/* Carta */}
                <motion.div
                  initial={false}
                  animate={opening ? { y: "-58%" } : { y: 0 }}
                  transition={{ duration: 0.9, delay: opening ? 0.55 : 0, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute",
                    left: "7%",
                    right: "7%",
                    top: "9%",
                    bottom: "7%",
                    zIndex: 2,
                    borderRadius: 4,
                    background: "linear-gradient(180deg, #FFFCF6 0%, #F7ECDC 100%)",
                    boxShadow: "0 2px 8px rgba(43,33,28,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingTop: "6cqw",
                    gap: "1.5cqw",
                  }}
                >
                  <div
                    aria-hidden
                    style={{ position: "absolute", inset: "2.2cqw", border: "1px solid rgba(198,162,94,0.55)", borderRadius: 2 }}
                  />
                  <span style={{ fontSize: "3cqw", letterSpacing: "0.45em", color: "var(--gold-solid)", marginLeft: "0.45em" }}>
                    ✦ XV AÑOS ✦
                  </span>
                  <span style={{ fontFamily: serif, fontSize: "11cqw", lineHeight: 1, color: "var(--accent)" }}>
                    {firstName}
                  </span>
                  <span style={{ width: "16cqw", height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
                  <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: "4.2cqw", color: "var(--text-muted)" }}>
                    te invita a celebrar
                  </span>
                </motion.div>

                {/* Bolsillo frontal */}
                <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}>
                  {pocket("polygon(0 0, 52% 54%, 0 100%)", "linear-gradient(120deg, #F4E8D8 0%, #EAD6BF 100%)")}
                  {pocket("polygon(100% 0, 48% 54%, 100% 100%)", "linear-gradient(240deg, #F4E8D8 0%, #E6CFB6 100%)")}
                  {pocket("polygon(0 100%, 50% 46%, 100% 100%)", "linear-gradient(0deg, #F8EEDF 0%, #EFDDC6 100%)")}
                </div>

                {/* Solapa (se abre hacia atrás) */}
                <motion.div
                  initial={false}
                  animate={opening ? { rotateX: 180, zIndex: 1 } : { rotateX: 0, zIndex: 6 }}
                  transition={{ duration: 0.7, ease: [0.5, 0, 0.2, 1], zIndex: { delay: opening ? 0.25 : 0, duration: 0 } }}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    height: "58%",
                    transformOrigin: "top center",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      background: "linear-gradient(180deg, #FBF3E6 0%, #F0DEC8 100%)",
                      backfaceVisibility: "hidden",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      background: "linear-gradient(0deg, #D9B8A3 0%, #E9D2C0 100%)",
                      transform: "rotateX(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  />
                </motion.div>

                {/* Destello */}
                {sealed && anim && (
                  <motion.div
                    aria-hidden
                    animate={{ x: ["-120%", "120%"], opacity: [0, 0.5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 7,
                      pointerEvents: "none",
                      background: "linear-gradient(100deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)",
                      mixBlendMode: "soft-light",
                    }}
                  />
                )}

                {/* Sello de lacre */}
                <motion.div
                  initial={false}
                  animate={opening ? { scale: 1.25, opacity: 0, y: 6 } : { scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "58%",
                    width: "23%",
                    aspectRatio: "1",
                    x: "-50%",
                    marginTop: "-11.5%",
                    zIndex: 10,
                  }}
                >
                  <motion.div
                    aria-hidden
                    animate={sealed && anim ? { opacity: [0.4, 0.9, 0.4], scale: [0.95, 1.2, 0.95] } : {}}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      position: "absolute",
                      inset: "-30%",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(var(--accent-rgb),0.5) 0%, transparent 65%)",
                      filter: "blur(10px)",
                    }}
                  />
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle at 32% 28%, #D58A98 0%, #B4707C 40%, #8F4E5F 75%, #6E3947 100%)",
                      boxShadow:
                        "0 5px 12px rgba(43,33,28,0.4), inset 0 2px 3px rgba(255,255,255,0.35), inset 0 -3px 5px rgba(0,0,0,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "78%",
                        height: "78%",
                        borderRadius: "50%",
                        border: "1.5px solid rgba(255,236,200,0.65)",
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: serif,
                          fontSize: "6.4cqw",
                          lineHeight: 1,
                          color: "#F8E3B8",
                          textShadow: "0 1px 2px rgba(0,0,0,0.45)",
                        }}
                      >
                        {initial}
                      </span>
                      <span
                        style={{
                          fontSize: "1.9cqw",
                          letterSpacing: "0.3em",
                          marginLeft: "0.3em",
                          color: "rgba(248,227,184,0.85)",
                        }}
                      >
                        XV
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Pétalos: fuera del sello, que se desvanece al abrir y los taparía */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "58%",
                    width: "23%",
                    aspectRatio: "1",
                    transform: "translate(-50%, -50%)",
                    zIndex: 11,
                    pointerEvents: "none",
                  }}
                >
                  <PetalBurst bursts={bursts} onDone={(id) => setBursts((p) => p.filter((b) => b.id !== id))} />
                </div>
              </motion.div>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={sealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: reducedMotion ? 0.2 : 0.5, ease: "easeOut", delay: sealed ? 0.4 : 0 }}
              style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 14 }}
            >
              <span aria-hidden style={{ width: 36, height: 1, background: "linear-gradient(90deg, transparent, var(--gold))" }} />
              <motion.p
                animate={sealed && anim ? { opacity: [0.6, 1, 0.6] } : {}}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                Toca el sello para abrir
              </motion.p>
              <span aria-hidden style={{ width: 36, height: 1, background: "linear-gradient(90deg, var(--gold), transparent)" }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
