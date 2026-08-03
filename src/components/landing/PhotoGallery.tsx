"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { IconButton } from "./Button";
import { useMusicContext } from "@/context/MusicContext";

export type GalleryGroup = { title: string; photos: string[] };

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

export default function PhotoGallery({ groups }: { groups: GalleryGroup[] }) {
  const { musicRequested, requestMusic } = useMusicContext();
  const photos = useMemo(() => groups.flatMap((g) => g.photos), [groups]);
  // Índice de la primera foto de cada grupo (para saltar y marcar la etapa)
  const groupStarts = useMemo(() => {
    let acc = 0;
    return groups.map((g) => {
      const start = acc;
      acc += g.photos.length;
      return start;
    });
  }, [groups]);
  const hasPhotos = photos.length > 0;
  const count = hasPhotos ? photos.length : PLACEHOLDER_COUNT;

  const [[index, direction], setSlide] = useState([0, 0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const reducedMotion = useRef(false);
  const slideshowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(slideshowRef, { amount: 0.4 });
  const playing = inView && !reducedMotion.current;

  const toggleFullscreen = async () => {
    if (!slideshowRef.current) return;
    try {
      if (!isFullscreen) {
        if (slideshowRef.current.requestFullscreen) {
          await slideshowRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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


  // Etapa a la que pertenece la foto actual
  const currentGroup = useMemo(() => {
    let g = 0;
    for (let i = 0; i < groupStarts.length; i++) {
      if (index >= groupStarts[i]) g = i;
    }
    return g;
  }, [index, groupStarts]);

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
    <div>
      <div style={{ maxWidth: "100%", margin: "0 auto", width: "100%" }}>

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
              <motion.div
                whileHover={{
                  boxShadow: "0 20px 50px rgba(180, 112, 124, 0.3), 0 0 30px rgba(198, 162, 94, 0.15)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
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

                {/* Etapa actual */}
                {hasPhotos && groups[currentGroup] && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 14,
                      left: 18,
                      fontSize: 10,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--on-ink)",
                      background: "rgba(var(--ink-rgb),0.55)",
                      backdropFilter: "blur(6px)",
                      padding: "4px 12px",
                      borderRadius: 999,
                      zIndex: 2,
                      pointerEvents: "none",
                      maxWidth: "60%",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {groups[currentGroup].title}
                  </span>
                )}

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
              </motion.div>

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

              {/* Fullscreen button — top right corner */}
              <IconButton
                label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                onClick={toggleFullscreen}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  fontSize: 18,
                  zIndex: 5,
                }}
              >
                {isFullscreen ? "⛶" : "⛶"}
              </IconButton>

              {/* Music button — only visible in fullscreen, top right below fullscreen button */}
              {isFullscreen && (
                <IconButton
                  label={musicRequested ? "Música sonando" : "Reproducir música"}
                  onClick={requestMusic}
                  style={{
                    position: "absolute",
                    top: 60,
                    right: 12,
                    fontSize: 18,
                    zIndex: 5,
                    opacity: musicRequested ? 0.8 : 1,
                  }}
                >
                  ♪
                </IconButton>
              )}
            </div>

          </div>

        </motion.div>
      </div>
    </div>
  );
}
