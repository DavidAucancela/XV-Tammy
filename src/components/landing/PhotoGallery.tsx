"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

const SLIDE_MS = 3500;
const SWIPE_THRESHOLD = 60;

export default function PhotoGallery({
  photos,
  songUrl = "",
}: {
  photos: string[];
  songUrl?: string;
}) {
  const hasPhotos = photos.length > 0;
  const count = hasPhotos ? photos.length : PLACEHOLDER_COUNT;

  const [[index, direction], setSlide] = useState([0, 0]);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const reducedMotion = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const autoplayAttempted = useRef(false);

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

  // Try autoplay music when component mounts (if songUrl exists)
  useEffect(() => {
    if (songUrl && audioRef.current && !autoplayAttempted.current && hasPhotos) {
      autoplayAttempted.current = true;
      const attemptAutoplay = async () => {
        try {
          audioRef.current!.volume = volume;
          await audioRef.current!.play();
          setPlaying(true);
          setStarted(true);
        } catch {
          // Autoplay policy blocked — wait for user interaction
          // (user can still click play button)
        }
      };
      // Delay slightly to allow audio element to be in DOM
      setTimeout(attemptAutoplay, 200);
    }
  }, [songUrl, hasPhotos, volume]);

  // Autoplay while playing — the interval is keyed to `index`, so any manual
  // navigation naturally resets the timer.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") advance(1);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [playing, index, advance]);

  const startShow = useCallback(() => {
    setStarted(true);
    setPlaying(true);
    if (songUrl && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay policy or missing file — keep the slideshow, drop the audio.
        setMuted(true);
      });
    }
  }, [songUrl]);

  const togglePlay = useCallback(() => {
    setPlaying((p) => {
      const next = !p;
      const audio = audioRef.current;
      if (audio && songUrl) {
        if (next && !muted) audio.play().catch(() => {});
        else audio.pause();
      }
      return next;
    });
  }, [songUrl, muted]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      const audio = audioRef.current;
      if (audio && songUrl) {
        audio.volume = next ? 0 : volume;
      }
      return next;
    });
  }, [songUrl, volume]);

  const handleVolumeChange = useCallback(
    (newVol: number) => {
      setVolume(newVol);
      if (audioRef.current) {
        audioRef.current.volume = newVol;
        if (muted && newVol > 0) {
          setMuted(false);
        }
      }
    },
    [muted]
  );

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
    <section id="galeria" style={{ padding: "120px 16px 100px", background: "rgba(13, 6, 16, 0.88)" }}>
      <div style={{ maxWidth: "100%", margin: "0 auto" }}>
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
            ✦ &nbsp; de niña a señorita &nbsp; ✦
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
            Mi Historia
          </RevealText>
          <div className="ornament-divider">
            <span>✦</span>
          </div>
        </motion.div>

        {/* Slideshow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "relative", width: "100%", maxWidth: "1080px", margin: "0 auto" }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "4/3",
              borderRadius: 22,
              overflow: "hidden",
              border: "1px solid #251535",
              boxShadow: "0 0 60px rgba(232,105,154,0.10)",
              background: "#0d0610",
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
                        color: "#e8699a",
                        opacity: 0.25,
                      }}
                    >
                      ✦
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.3em",
                        color: "#6a4560",
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
                  "linear-gradient(to top, rgba(13,6,16,0.55) 0%, transparent 30%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />

            {/* Play overlay — before the show starts */}
            {hasPhotos && !started && (
              <button
                onClick={startShow}
                aria-label={songUrl ? "Reproducir con música" : "Reproducir slideshow"}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 4,
                  border: "none",
                  cursor: "pointer",
                  background: "rgba(13,6,16,0.35)",
                  backdropFilter: "blur(2px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 18,
                  color: "#fdf0f8",
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: "50%",
                    border: "1px solid rgba(232,105,154,0.5)",
                    background: "rgba(232,105,154,0.14)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    paddingLeft: 6,
                  }}
                >
                  ▶
                </motion.span>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "#e8dce6",
                  }}
                >
                  {songUrl ? "Reproducir con música" : "Reproducir"}
                </span>
              </button>
            )}

            {/* Music / pause controls — while the show runs */}
            {hasPhotos && started && (
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  zIndex: 4,
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                {songUrl && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "rgba(13,6,16,0.6)",
                        backdropFilter: "blur(8px)",
                        borderRadius: "50px",
                        padding: "6px 10px",
                        border: "1px solid rgba(232,105,154,0.35)",
                      }}
                    >
                      <span style={{ fontSize: 12, color: "#fdf0f8" }}>
                        {muted ? "🔇" : "🔊"}
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={muted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(Number(e.target.value))}
                        aria-label="Volumen"
                        style={{
                          width: 80,
                          height: 4,
                          cursor: "pointer",
                          accentColor: "#e8699a",
                        }}
                      />
                    </div>
                    <ControlButton
                      label={muted ? "Activar música" : "Silenciar música"}
                      onClick={toggleMute}
                    >
                      {muted ? "🔇" : "🔊"}
                    </ControlButton>
                  </>
                )}
                <ControlButton
                  label={playing ? "Pausar" : "Reproducir"}
                  onClick={togglePlay}
                >
                  {playing ? "❚❚" : "▶"}
                </ControlButton>
              </div>
            )}

            {/* Counter */}
            <span
              style={{
                position: "absolute",
                bottom: 14,
                right: 18,
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "rgba(253,240,248,0.65)",
                background: "rgba(13,6,16,0.5)",
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

          {/* Arrows */}
          {[
            { dir: -1, label: "Foto anterior", char: "‹", side: { left: -8 } },
            { dir: 1, label: "Foto siguiente", char: "›", side: { right: -8 } },
          ].map(({ dir, label, char, side }) => (
            <button
              key={label}
              aria-label={label}
              onClick={() => advance(dir)}
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                ...side,
                width: 42,
                height: 42,
                borderRadius: "50%",
                border: "1px solid rgba(232,105,154,0.35)",
                background: "rgba(13,6,16,0.65)",
                backdropFilter: "blur(8px)",
                color: "#fdf0f8",
                fontSize: 22,
                lineHeight: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 5,
                transition: "border-color 0.25s, background 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#e8699a";
                e.currentTarget.style.background = "rgba(232,105,154,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(232,105,154,0.35)";
                e.currentTarget.style.background = "rgba(13,6,16,0.65)";
              }}
            >
              {char}
            </button>
          ))}

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
                  background: i === index ? "#e8699a" : "rgba(232,105,154,0.25)",
                  transition: "width 0.35s ease, background 0.35s ease",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {songUrl && (
        <audio ref={audioRef} src={songUrl} loop preload="none" />
      )}
    </section>
  );
}

function ControlButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        border: "1px solid rgba(232,105,154,0.35)",
        background: "rgba(13,6,16,0.6)",
        backdropFilter: "blur(8px)",
        color: "#fdf0f8",
        fontSize: 13,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}
