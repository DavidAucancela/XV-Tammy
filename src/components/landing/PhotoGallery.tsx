"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { IconButton } from "./Button";
import { useMusicContext } from "@/context/MusicContext";

const PLACEHOLDER_COUNT = 6;

const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg, #f7ece0 0%, #ecd9c4 100%)",
  "linear-gradient(135deg, #f5e8db 0%, #e8cfc7 100%)",
  "linear-gradient(135deg, #f6ebd9 0%, #e3cfa0 100%)",
  "linear-gradient(135deg, #f3e6d6 0%, #dcc7ae 100%)",
  "linear-gradient(135deg, #f7e9e6 0%, #d9b8bd 100%)",
  "linear-gradient(135deg, #f4ece2 0%, #e0d0b8 100%)",
];

const SLIDE_MS = 3500;
const SWIPE_THRESHOLD = 60;

export default function PhotoGallery({ photos }: { photos: string[] }) {
  const { musicRequested, requestMusic } = useMusicContext();
  const hasPhotos = photos.length > 0;
  const count = hasPhotos ? photos.length : PLACEHOLDER_COUNT;

  const [[index, direction], setSlide] = useState([0, 0]);
  const reducedMotion = useRef(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const thumbnailsMounted = useRef(false);
  const slideshowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(slideshowRef, { amount: 0.4 });
  const playing = inView && !reducedMotion.current;

  const goTo = useCallback(
    (target: number, dir?: number) => {
      const next = ((target % count) + count) % count;
      setSlide(([current]) => [next, dir ?? (next > current ? 1 : -1)]);
    },
    [count]
  );

  const advance = useCallback(
    (dir: number) => {
      setSlide(([current]) => [(((current + dir) % count) + count) % count, dir]);
    },
    [count]
  );

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Autoplay while in view — the interval is keyed to `index`, so any manual
  // navigation naturally resets the timer.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") advance(1);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [playing, index, advance]);

  // Auto-scroll thumbnail strip to keep the active thumbnail visible
  // (skip on initial mount to avoid an unwanted scroll jump on load).
  useEffect(() => {
    if (!thumbnailsMounted.current) {
      thumbnailsMounted.current = true;
      return;
    }
    if (thumbnailsRef.current) {
      const child = thumbnailsRef.current.children[index] as HTMLElement | undefined;
      child?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [index]);

  // Deterministic Ken Burns direction per slide.
  const kb = index % 4;
  const kenBurns = reducedMotion.current
    ? { scale: 1 }
    : {
        scale: 1.09,
        x: kb === 0 ? "2%" : kb === 2 ? "-2%" : "0%",
        y: kb === 1 ? "-2%" : kb === 3 ? "2%" : "0%",
      };

  return (
    <section id="galeria" style={{ padding: "120px 8px 100px", background: "var(--bg)" }}>
      <div style={{ maxWidth: "100%", margin: "0 auto", width: "100%" }}>
        <SectionHeading eyebrow="de niña a señorita" title="Mi crecimiento" />

        <div style={{ display: "flex", justifyContent: "center", margin: "-8px 0 28px" }}>
          <button
            onClick={requestMusic}
            disabled={musicRequested}
            aria-label={musicRequested ? "Música sonando" : "Reproducir música"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              background: musicRequested ? "rgba(180,112,124,0.12)" : "var(--surface)",
              color: "var(--accent-ink)",
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: musicRequested ? "default" : "pointer",
              transition: "background 0.25s, opacity 0.25s",
              opacity: musicRequested ? 0.75 : 1,
            }}
          >
            <span aria-hidden>♪</span>
            {musicRequested ? "Música sonando" : "Reproducir música"}
          </button>
        </div>

        {/* Slideshow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "relative", width: "100%", maxWidth: "1140px", margin: "0 auto" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ position: "relative" }} ref={slideshowRef}>
              <div
                style={{
                  position: "relative",
                  aspectRatio: "4/3",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-lg)",
                  background: "var(--ink)",
                }}
              >
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={index}
                    custom={direction}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.1, ease: "easeInOut" }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -SWIPE_THRESHOLD) advance(1);
                      else if (info.offset.x > SWIPE_THRESHOLD) advance(-1);
                    }}
                    style={{ position: "absolute", inset: 0, cursor: "grab" }}
                  >
                    {hasPhotos ? (
                      <>
                        {/* Blurred backdrop — fills the frame for any orientation */}
                        <div
                          aria-hidden
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: `url(${photos[index]})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(28px) brightness(0.5)",
                            transform: "scale(1.2)",
                            pointerEvents: "none",
                          }}
                        />
                        {/* Sharp, fully-visible photo with Ken Burns */}
                        <motion.div
                          initial={{ scale: 1, x: "0%", y: "0%" }}
                          animate={kenBurns}
                          transition={{ duration: SLIDE_MS / 1000 + 1.5, ease: "linear" }}
                          style={{ position: "absolute", inset: 0 }}
                        >
                          <Image
                            src={photos[index]}
                            alt={`Recuerdo ${index + 1}`}
                            fill
                            sizes="(max-width: 900px) 100vw, 860px"
                            style={{ objectFit: "contain", pointerEvents: "none" }}
                            priority={index === 0}
                          />
                        </motion.div>
                      </>
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length],
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 14,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-playfair), Georgia, serif",
                            fontSize: 44,
                            color: "var(--accent)",
                            opacity: 0.25,
                          }}
                        >
                          ✦
                        </span>
                        <span
                          style={{
                            fontSize: 9,
                            letterSpacing: "0.3em",
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                          }}
                        >
                          foto próximamente
                        </span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Bottom vignette for legibility of controls */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(var(--ink-rgb),0.55) 0%, transparent 30%)",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />

                {/* Counter */}
                <span
                  style={{
                    position: "absolute",
                    bottom: 14,
                    right: 18,
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: "var(--on-ink)",
                    background: "rgba(var(--ink-rgb),0.55)",
                    backdropFilter: "blur(6px)",
                    padding: "4px 10px",
                    borderRadius: 999,
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                >
                  {index + 1} / {count}
                </span>
              </div>

              {/* Arrows — positioned relative to photo-area wrapper */}
              {[
                { dir: -1, label: "Foto anterior", char: "‹", side: { left: -8 } },
                { dir: 1, label: "Foto siguiente", char: "›", side: { right: -8 } },
              ].map(({ dir, label, char, side }) => (
                <IconButton
                  key={label}
                  label={label}
                  onClick={() => advance(dir)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    ...side,
                    fontSize: 22,
                    zIndex: 5,
                  }}
                >
                  {char}
                </IconButton>
              ))}
            </div>

            {/* Thumbnail filmstrip — horizontal, centered, clipped to the section width */}
            {hasPhotos && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <div
                  ref={thumbnailsRef}
                  className="thumbnail-filmstrip"
                  style={{
                    display: "flex",
                    gap: 8,
                    overflowX: "auto",
                    justifyContent: count <= 6 ? "center" : "flex-start",
                    padding: "2px 4px",
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {photos.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Ir a la foto ${i + 1}`}
                      style={{
                        flex: "0 0 auto",
                        width: 84,
                        aspectRatio: "4/3",
                        borderRadius: 8,
                        overflow: "hidden",
                        border: i === index ? "2px solid var(--accent)" : "2px solid transparent",
                        opacity: i === index ? 1 : 0.45,
                        transition: "opacity 0.3s, border-color 0.3s",
                        cursor: "pointer",
                        padding: 0,
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        if (i !== index) e.currentTarget.style.opacity = "0.8";
                      }}
                      onMouseLeave={(e) => {
                        if (i !== index) e.currentTarget.style.opacity = "0.45";
                      }}
                    >
                      <Image
                        src={src}
                        alt={`Miniatura ${i + 1}`}
                        fill
                        sizes="84px"
                        style={{ objectFit: "cover", pointerEvents: "none" }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dots */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 8,
              marginTop: 24,
            }}
          >
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                aria-label={`Ir a la foto ${i + 1}`}
                onClick={() => goTo(i)}
                style={{
                  width: i === index ? 24 : 7,
                  height: 7,
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  background: i === index ? "var(--accent)" : "rgba(var(--accent-rgb),0.25)",
                  transition: "width 0.35s ease, background 0.35s ease",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
