"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { IconButton } from "./Button";

const INITIAL_VISIBLE = 18;
const SWIPE_THRESHOLD = 60;

export default function PhotoGrid({ photos }: { photos: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const visible = expanded ? photos : photos.slice(0, INITIAL_VISIBLE);
  const hasMore = photos.length > INITIAL_VISIBLE;

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: number) => {
      setLightbox((current) =>
        current === null ? null : (current + dir + photos.length) % photos.length
      );
    },
    [photos.length]
  );

  // Teclado + bloqueo de scroll mientras el lightbox está abierto
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, close, step]);

  if (photos.length === 0) return null;

  return (
    <section style={{ padding: "0 16px 120px", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", width: "100%" }}>
        <SectionHeading eyebrow="todos los momentos" title="Álbum de recuerdos" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 10,
          }}
        >
          {visible.map((src, i) => (
            <button
              key={src}
              onClick={() => setLightbox(i)}
              aria-label={`Ampliar foto ${i + 1}`}
              style={{
                position: "relative",
                aspectRatio: "1",
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                cursor: "zoom-in",
                padding: 0,
                background: "var(--surface)",
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1.06)";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1)";
              }}
            >
              <Image
                src={src}
                alt={`Recuerdo ${i + 1}`}
                fill
                sizes="(max-width: 768px) 45vw, 190px"
                style={{
                  objectFit: "cover",
                  pointerEvents: "none",
                  transition: "transform 0.45s ease",
                }}
              />
            </button>
          ))}
        </motion.div>

        {hasMore && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
            <button
              onClick={() => setExpanded((v) => !v)}
              style={{
                padding: "10px 24px",
                borderRadius: 999,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--accent-ink)",
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background 0.25s",
              }}
            >
              {expanded ? "Ver menos" : `Ver todas las fotos (${photos.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(var(--ink-rgb), 0.94)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -SWIPE_THRESHOLD) step(1);
                else if (info.offset.x > SWIPE_THRESHOLD) step(-1);
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "min(92vw, 1000px)",
                height: "min(82vh, 760px)",
              }}
            >
              <Image
                src={photos[lightbox]}
                alt={`Recuerdo ${lightbox + 1}`}
                fill
                sizes="92vw"
                style={{ objectFit: "contain", pointerEvents: "none" }}
                priority
              />
            </motion.div>

            <IconButton
              label="Cerrar"
              onClick={close}
              style={{ position: "absolute", top: 18, right: 18, fontSize: 20, zIndex: 2 }}
            >
              ✕
            </IconButton>

            {[
              { dir: -1, label: "Foto anterior", char: "‹", side: { left: 10 } },
              { dir: 1, label: "Foto siguiente", char: "›", side: { right: 10 } },
            ].map(({ dir, label, char, side }) => (
              <IconButton
                key={label}
                label={label}
                onClick={() => step(dir)}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  ...side,
                  fontSize: 24,
                  zIndex: 2,
                }}
              >
                {char}
              </IconButton>
            ))}

            <span
              style={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 11,
                letterSpacing: "0.2em",
                color: "var(--on-ink)",
                background: "rgba(var(--ink-rgb), 0.55)",
                padding: "5px 14px",
                borderRadius: 999,
                pointerEvents: "none",
              }}
            >
              {lightbox + 1} / {photos.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
