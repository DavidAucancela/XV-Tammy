"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";
import RevealText from "./RevealText";

const PLACEHOLDER_COUNT = 6;

const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg, #1e0a1a 0%, #3d1535 100%)",
  "linear-gradient(135deg, #0d0618 0%, #2a1040 100%)",
  "linear-gradient(135deg, #1a0a18 0%, #4a1530 100%)",
  "linear-gradient(135deg, #0e0814 0%, #251535 100%)",
  "linear-gradient(135deg, #180a16 0%, #3a1038 100%)",
  "linear-gradient(135deg, #0c0612 0%, #2a1030 100%)",
];

export default function PhotoGallery({ photos }: { photos: string[] }) {
  const hasPhotos = photos.length > 0;

  return (
    <section id="galeria" style={{ padding: "100px 24px", background: "rgba(13, 6, 16, 0.88)" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 56 }}
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
            ✦ &nbsp; recuerdos &nbsp; ✦
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
            Galería de Fotos
          </RevealText>
          <div
            style={{
              width: 52,
              height: 1,
              background: "linear-gradient(90deg, transparent, #e8699a, transparent)",
              margin: "0 auto",
            }}
          />
        </motion.div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            gap: 18,
          }}
        >
          {hasPhotos
            ? photos.map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.07 }}
                >
                  <TiltCard
                    maxTilt={5}
                    glowColor="rgba(232,105,154,0.20)"
                    style={{
                      position: "relative",
                      aspectRatio: "4/3",
                      borderRadius: 18,
                      overflow: "hidden",
                      border: "1px solid #251535",
                    }}
                  >
                    <Image
                      src={src}
                      alt={`Foto ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(13,6,16,0.45) 0%, transparent 55%)",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />
                  </TiltCard>
                </motion.div>
              ))
            : Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.07 }}
                >
                  <TiltCard
                    maxTilt={5}
                    glowColor="rgba(232,105,154,0.15)"
                    style={{
                      aspectRatio: "4/3",
                      borderRadius: 18,
                      border: "1px solid #251535",
                      background: PLACEHOLDER_GRADIENTS[i],
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 30, opacity: 0.22 }}>📷</span>
                    <span
                      style={{
                        fontSize: 8,
                        letterSpacing: "0.22em",
                        color: "#3a1a30",
                        textTransform: "uppercase",
                      }}
                    >
                      foto próximamente
                    </span>
                  </TiltCard>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
