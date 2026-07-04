"use client";

import Image from "next/image";
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

const medallion = {
  hidden: { opacity: 0, scale: 0.8, y: -16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function HeroSection({ celebrant, photo }: { celebrant: string; photo?: string }) {
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
        background: "var(--bg)",
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
            "radial-gradient(circle, rgba(var(--accent-rgb),0.14) 0%, transparent 65%)",
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
            "radial-gradient(circle, rgba(var(--gold-rgb),0.16) 0%, transparent 65%)",
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
              color: "var(--accent)",
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
          {/* Portrait medallion — anchors the invitation to Tammy specifically */}
          {photo && (
            <motion.div
              variants={medallion}
              style={{
                position: "relative",
                width: 132,
                height: 132,
                margin: "0 auto 28px",
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: -22,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(var(--accent-rgb),0.30) 0%, transparent 70%)",
                  filter: "blur(10px)",
                }}
              />
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
                    padding: 4,
                    background: "var(--bg)",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={photo}
                      alt={celebrant}
                      fill
                      sizes="132px"
                      priority
                      style={{ objectFit: "cover", objectPosition: "50% 50%" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Kinetic title — word by word */}
          <div style={{ overflow: "hidden", marginBottom: 6 }}>
            <motion.h1
              variants={wordSlide}
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(3rem, 12vw, 6rem)",
                fontWeight: 400,
                lineHeight: 1.0,
                color: "var(--text)",
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
                color: "var(--accent)",
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
              background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
              margin: "0 auto 32px",
            }}
          />

          <motion.p
            variants={fadeSub}
            style={{
              fontSize: 14,
              color: "var(--text-muted)",
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
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
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
            color: "rgba(var(--ink-rgb), 0.4)",
          }}
        >
          scroll
        </span>
        <span style={{ color: "rgba(var(--ink-rgb), 0.4)", fontSize: 16 }}>↓</span>
      </motion.button>
    </section>
  );
}
