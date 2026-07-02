"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type Sparkle = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.4 },
  },
};

const wordSlide = {
  hidden: { y: 60, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const } },
};

const fadeSub = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

export default function HeroSection({ celebrant }: { celebrant: string }) {
  const ref = useRef<HTMLElement>(null);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  // Scroll-linked: section scrolls out from top
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax layers at different speeds
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const sparkleY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  useEffect(() => {
    setSparkles(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 13 + 6,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 3.5,
      }))
    );
  }, []);

  return (
    <section
      ref={ref}
      id="inicio"
      style={{
        position: "relative",
        height: "100dvh",
        minHeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "rgba(13, 6, 16, 0.88)",
      }}
    >
      {/* Parallax blob 1 — faster */}
      <motion.div
        style={{
          position: "absolute",
          top: "-18%",
          left: "10%",
          width: "min(680px, 80vw)",
          height: "min(680px, 80vw)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,105,154,0.16) 0%, transparent 65%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          y: blob1Y,
        }}
      />
      {/* Parallax blob 2 — slower */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "8%",
          right: "-5%",
          width: "min(420px, 55vw)",
          height: "min(420px, 55vw)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(210,155,55,0.10) 0%, transparent 65%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          y: blob2Y,
        }}
      />

      {/* Floating sparkles layer */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          y: sparkleY,
        }}
      >
        {sparkles.map((s) => (
          <motion.span
            key={s.id}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              fontSize: s.size,
              color: "#e8699a",
              userSelect: "none",
            }}
            animate={{ y: [-10, 10, -10], opacity: [0.12, 0.40, 0.12] }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ✦
          </motion.span>
        ))}
      </motion.div>

      {/* Content — moves slowly on scroll + fades out */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "0 28px",
          maxWidth: 600,
          width: "100%",
          y: contentY,
          opacity: contentOpacity,
        }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={fadeSub}
            style={{
              fontSize: 9,
              letterSpacing: "0.48em",
              textTransform: "uppercase",
              color: "#e8699a",
              marginBottom: 36,
            }}
          >
            ✦ &nbsp; una celebración especial &nbsp; ✦
          </motion.p>

          {/* Kinetic title — word by word */}
          <div style={{ overflow: "hidden", marginBottom: 6 }}>
            <motion.h1
              variants={wordSlide}
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(3rem, 12vw, 6rem)",
                fontWeight: 400,
                lineHeight: 1.0,
                color: "#fdf0f8",
                margin: 0,
              }}
            >
              Los XV Años
            </motion.h1>
          </div>

          <div style={{ overflow: "hidden", marginBottom: 36 }}>
            <motion.p
              variants={wordSlide}
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(1.5rem, 6vw, 3.2rem)",
                fontStyle: "italic",
                color: "#e8699a",
                margin: 0,
              }}
            >
              de {celebrant}
            </motion.p>
          </div>

          <motion.div
            variants={fadeSub}
            style={{
              width: 70,
              height: 1,
              background: "linear-gradient(90deg, transparent, #e8699a, transparent)",
              margin: "0 auto 32px",
            }}
          />

          <motion.p
            variants={fadeSub}
            style={{
              fontSize: 14,
              color: "#c9a0b8",
              letterSpacing: "0.04em",
              lineHeight: 1.85,
              maxWidth: 400,
              margin: "0 auto",
              fontWeight: 300,
            }}
          >
            Te invitamos a ser parte de este momento único lleno de amor, alegría y recuerdos que durarán para siempre.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Scroll arrow */}
      <motion.button
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 8,
          zIndex: 2,
        }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        onClick={() =>
          document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <span
          style={{
            fontSize: 8,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#3a1a30",
          }}
        >
          scroll
        </span>
        <span style={{ color: "#3a1a30", fontSize: 16 }}>↓</span>
      </motion.button>
    </section>
  );
}
