"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const SPRING = { stiffness: 140, damping: 18, mass: 0.6 };
const MAX_TILT = 16;

/**
 * Tarjeta 3D con el QR de acceso.
 * - Escritorio: se inclina siguiendo el cursor en toda la ventana.
 * - Táctil (sin hover): se mueve sola con un vaivén suave.
 * - Respeta prefers-reduced-motion (queda quieta).
 */
export default function PassCard({
  token,
  celebrant,
  guestName,
  dateLine,
}: {
  token: string;
  celebrant: string;
  guestName: string;
  dateLine?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const auto = useRef(false);

  // -1..1 normalizados
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const sx = useSpring(nx, SPRING);
  const sy = useSpring(ny, SPRING);

  const rotateY = useTransform(sx, [-1, 1], [-MAX_TILT, MAX_TILT]);
  const rotateX = useTransform(sy, [-1, 1], [MAX_TILT, -MAX_TILT]);

  // Brillo holográfico que se desplaza con la inclinación
  const sheenX = useTransform(sx, [-1, 1], [10, 90]);
  const sheenY = useTransform(sy, [-1, 1], [10, 90]);
  const sheen = useMotionTemplate`radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.65) 0%, rgba(255,236,200,0.25) 28%, transparent 60%)`;
  const shadowX = useTransform(sx, [-1, 1], [24, -24]);
  const shadowY = useTransform(sy, [-1, 1], [-8, 36]);
  const boxShadow = useMotionTemplate`${shadowX}px ${shadowY}px 48px rgba(43,33,28,0.28), 0 2px 0 rgba(198,162,94,0.6) inset`;

  useEffect(() => {
    auto.current = window.matchMedia("(hover: none)").matches;
    if (reduced) return;

    const onMove = (e: PointerEvent) => {
      if (auto.current || e.pointerType === "touch" || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      nx.set(clamp((e.clientX - cx) / 380));
      ny.set(clamp((e.clientY - cy) / 380));
    };
    const onLeave = () => {
      nx.set(0);
      ny.set(0);
    };
    window.addEventListener("pointermove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [nx, ny, reduced]);

  // Móvil: movimiento automático
  useAnimationFrame((t) => {
    if (reduced || !auto.current) return;
    const s = t / 1000;
    nx.set(Math.sin(s * 0.9) * 0.85);
    ny.set(Math.cos(s * 0.7) * 0.7);
  });

  return (
    <div style={{ perspective: "1100px" }} className="w-full flex justify-center">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          rotateX,
          rotateY,
          boxShadow,
          transformStyle: "preserve-3d",
          background: "linear-gradient(160deg, #FFFBF2 0%, #F6E9D6 55%, #EAD3B4 100%)",
          border: "1px solid rgba(198,162,94,0.7)",
        }}
        className="relative w-full max-w-[290px] rounded-[28px] px-7 py-8 flex flex-col items-center text-center"
      >
        {/* marco interior dorado */}
        <div
          aria-hidden
          className="absolute inset-2 rounded-[22px] pointer-events-none"
          style={{ border: "1px solid rgba(198,162,94,0.45)", transform: "translateZ(6px)" }}
        />
        {/* esquinas */}
        {["top-4 left-5", "top-4 right-5", "bottom-4 left-5", "bottom-4 right-5"].map((pos) => (
          <span
            key={pos}
            aria-hidden
            className={`absolute ${pos} text-[10px]`}
            style={{ color: "#C6A25E", transform: "translateZ(10px)" }}
          >
            ✦
          </span>
        ))}

        <div style={{ transform: "translateZ(28px)" }} className="flex flex-col items-center">
          <p className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "#96702E" }}>
            XV años
          </p>
          <p
            className="mt-1 text-3xl leading-none"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#B4707C" }}
          >
            {celebrant}
          </p>
          <div className="mt-3 h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #C6A25E, transparent)" }} />
        </div>

        <div
          style={{ transform: "translateZ(46px)", background: "#FFFFFF", boxShadow: "0 8px 24px rgba(43,33,28,0.18)" }}
          className="mt-5 rounded-2xl p-3"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/qr?token=${token}`} alt="Código QR de acceso" width={200} height={200} className="block" />
        </div>

        <div style={{ transform: "translateZ(30px)" }} className="mt-5 flex flex-col items-center">
          <p
            className="text-lg leading-tight"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#4A372E" }}
          >
            {guestName}
          </p>
          {dateLine && (
            <p className="mt-1 text-[10px] tracking-[0.25em] uppercase" style={{ color: "#7A6355" }}>
              {dateLine}
            </p>
          )}
        </div>

        {/* brillo */}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-[28px] pointer-events-none mix-blend-soft-light"
          style={{ background: sheen, transform: "translateZ(60px)" }}
        />
      </motion.div>
    </div>
  );
}
