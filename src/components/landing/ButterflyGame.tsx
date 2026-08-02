"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ButterflyShape, WING_FILLS, type ButterflyHue } from "./Butterflies";
import PetalBurst, { makeBurst, type Burst } from "./PetalBurst";
import Confetti, { makeConfettiParticles, type Particle } from "./Confetti";

const OPENED_KEY = "xv-invite-opened";
const SCORE_KEY = "xv-game-score";
const REWARD_EVERY = 10;

const HUES = Object.keys(WING_FILLS) as ButterflyHue[];

type CatchableFlight = {
  id: number;
  baseX: number; // vw — punto de partida dentro del viewport
  baseY: number; // vh
  dx1: number;
  dx2: number;
  dy1: number;
  dy2: number;
  duration: number;
  size: number;
  hue: ButterflyHue;
  caught: boolean;
};

type TapBurst = { id: number; x: number; y: number; burst: Burst };

let nextId = 1;

function makeFlight(): CatchableFlight {
  return {
    id: nextId++,
    // Deambulan dentro del viewport (visibles también con reduced-motion)
    baseX: Math.random() * 68 + 6,
    baseY: Math.random() * 62 + 12,
    dx1: (Math.random() - 0.5) * 50,
    dx2: (Math.random() - 0.5) * 50,
    dy1: (Math.random() - 0.5) * 30,
    dy2: (Math.random() - 0.5) * 30,
    duration: Math.random() * 8 + 12,
    size: Math.random() * 12 + 26,
    hue: HUES[Math.floor(Math.random() * HUES.length)],
    caught: false,
  };
}

/**
 * Mini-juego "atrapa mariposas": mariposas que deambulan por la pantalla y se
 * atrapan con un toque — burst de pétalos, contador discreto y sorpresa cada
 * 10. Solo los sprites capturan taps (pointerEvents:auto en el botón); el
 * resto de la capa deja pasar todo al contenido.
 */
export default function ButterflyGame() {
  const [started, setStarted] = useState(false);
  const [flights, setFlights] = useState<CatchableFlight[]>([]);
  const [bursts, setBursts] = useState<TapBurst[]>([]);
  const [confetti, setConfetti] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [reward, setReward] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Ids ya atrapados — fuera del estado para que taps repetidos (o el doble
  // render de StrictMode) no cuenten dos veces.
  const caughtIds = useRef<Set<number>>(new Set());

  // Arranca cuando el sello ya se abrió (esta sesión o ahora mismo)
  useEffect(() => {
    const begin = () => {
      const count = window.matchMedia("(min-width: 768px)").matches ? 5 : 4;
      setFlights(Array.from({ length: count }, makeFlight));
      setScore(Number(sessionStorage.getItem(SCORE_KEY)) || 0);
      setStarted(true);
    };
    if (sessionStorage.getItem(OPENED_KEY)) {
      begin();
      return;
    }
    const onOpen = () => {
      const t = setTimeout(begin, 1200); // coincide con el exit del overlay
      timers.current.push(t);
    };
    window.addEventListener("xv:invite-opened", onOpen);
    return () => window.removeEventListener("xv:invite-opened", onOpen);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const catchFly = useCallback(
    (id: number, e: React.PointerEvent) => {
      if (caughtIds.current.has(id)) return;
      caughtIds.current.add(id);
      setFlights((prev) => prev.map((f) => (f.id === id ? { ...f, caught: true } : f)));

      const { clientX, clientY } = e;
      setBursts((prev) => [...prev, { id: nextId++, x: clientX, y: clientY, burst: makeBurst() }]);

      // Agregar confetti en el punto del tap
      setConfetti((prev) => [...prev, ...makeConfettiParticles(clientX, clientY, 8)]);

      setScore((s) => {
        const next = s + 1;
        sessionStorage.setItem(SCORE_KEY, String(next));
        if (next % REWARD_EVERY === 0) {
          setReward(next);
          // celebración central con más confetti
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          setBursts((prev) => [
            ...prev,
            { id: nextId++, x: cx - 70, y: cy - 40, burst: makeBurst() },
            { id: nextId++, x: cx + 70, y: cy - 60, burst: makeBurst() },
            { id: nextId++, x: cx, y: cy + 50, burst: makeBurst() },
          ]);
          // Más confetti en milestone
          setConfetti((prev) => [
            ...prev,
            ...makeConfettiParticles(cx, cy, 30),
          ]);
          const t = setTimeout(() => setReward(null), 3000);
          timers.current.push(t);
        }
        return next;
      });
      // respawn con nueva mariposa
      const t = setTimeout(() => {
        setFlights((prev) => prev.map((f) => (f.id === id ? makeFlight() : f)));
      }, Math.random() * 1500 + 1500);
      timers.current.push(t);
    },
    []
  );

  const endBurst = useCallback((tapId: number) => {
    setBursts((prev) => prev.filter((b) => b.id !== tapId));
  }, []);

  const endConfetti = useCallback((particleId: number) => {
    setConfetti((prev) => prev.filter((p) => p.id !== particleId));
  }, []);

  if (!started) return null;

  return (
    <>
      {/* Capa de mariposas atrapables */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 5,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {flights.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              x: [`0vw`, `${f.dx1}vw`, `${f.dx2}vw`, `0vw`],
              y: [`0vh`, `${f.dy1}vh`, `${f.dy2}vh`, `0vh`],
              rotate: [6, -8, 8, 6],
            }}
            transition={{
              opacity: { duration: 0.8 },
              x: { duration: f.duration, repeat: Infinity, ease: "easeInOut" },
              y: { duration: f.duration * 1.15, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: f.duration * 0.9, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{ position: "absolute", left: `${f.baseX}vw`, top: `${f.baseY}vh` }}
          >
            <motion.div
              animate={
                f.caught
                  ? { scale: [1, 1.3, 0], opacity: [1, 1, 0], rotate: 40 }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <button
                onPointerDown={(e) => catchFly(f.id, e)}
                aria-label="Atrapar mariposa"
                disabled={f.caught}
                style={{
                  pointerEvents: f.caught ? "none" : "auto",
                  background: "transparent",
                  border: "none",
                  padding: 10,
                  minWidth: 44,
                  minHeight: 44,
                  cursor: "pointer",
                  display: "block",
                  touchAction: "manipulation",
                }}
              >
                <motion.div
                  animate={{ scaleX: [1, 0.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ pointerEvents: "none" }}
                >
                  <ButterflyShape size={f.size} hue={f.hue} />
                </motion.div>
              </button>
            </motion.div>
          </motion.div>
        ))}

        {/* Bursts en el punto del toque */}
        {bursts.map((b) => (
          <div
            key={b.id}
            aria-hidden
            style={{ position: "fixed", left: b.x, top: b.y, width: 0, height: 0 }}
          >
            <PetalBurst bursts={[b.burst]} onDone={() => endBurst(b.id)} />
          </div>
        ))}

        {/* Confetti particles */}
        <Confetti particles={confetti} onDone={endConfetti} />
      </div>

      {/* Contador + reward */}
      <div
        style={{
          position: "fixed",
          bottom: 18,
          left: 18,
          zIndex: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        <AnimatePresence>
          {reward !== null && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontStyle: "italic",
                fontSize: 15,
                color: "var(--accent-ink)",
                margin: 0,
              }}
            >
              ¡{reward} mariposas! ✨
            </motion.p>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {score > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              aria-live="polite"
              aria-label={`${score} mariposas atrapadas`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 14px",
                borderRadius: 999,
                border: "1px solid rgba(var(--gold-rgb), 0.5)",
                background: "rgba(252, 246, 236, 0.82)",
                backdropFilter: "blur(6px)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <ButterflyShape size={15} hue="gold" />
              <span
                style={{
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  color: "var(--gold-solid)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {score}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
