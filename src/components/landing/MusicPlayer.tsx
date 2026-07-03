"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function MusicPlayer({ songUrl = "" }: { songUrl?: string }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [expanded, setExpanded] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Autoplay as soon as the page loads. Browsers usually block unmuted
  // autoplay without a prior user gesture, so we fall back to muted
  // autoplay and unmute on the visitor's first tap/click/keypress anywhere.
  // Actual play/pause UI state is always synced from the <audio> element's
  // own events, never guessed — that's what keeps the button reliable.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !songUrl) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    audio.volume = volume;
    let cancelled = false;

    // Only needed when autoplay was actually blocked — attaching it
    // unconditionally would make it fire on the visitor's very first
    // click anywhere, including the button's own play/pause click,
    // silently re-triggering play() right after a manual pause.
    const unlock = () => {
      if (cancelled) return;
      audio.muted = false;
      audio.volume = volume;
      setMuted(false);
      setNeedsTap(false);
      audio.play().catch(() => {});
    };
    const attachUnlock = () => {
      document.addEventListener("click", unlock, { once: true });
      document.addEventListener("touchstart", unlock, { once: true });
      document.addEventListener("keydown", unlock, { once: true });
    };
    const detachUnlock = () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("keydown", unlock);
    };

    const attemptAutoplay = async () => {
      try {
        await audio.play();
      } catch {
        if (cancelled) return;
        try {
          audio.muted = true;
          await audio.play();
          if (!cancelled) {
            setMuted(true);
            setNeedsTap(true);
            attachUnlock();
          }
        } catch {
          // Fully blocked — visitor can still start it manually from the
          // widget, or the first tap anywhere will kick it off.
          if (!cancelled) setNeedsTap(true);
          attachUnlock();
        }
      }
    };
    attemptAutoplay();

    return () => {
      cancelled = true;
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      detachUnlock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songUrl]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setNeedsTap(false);
    if (audio.paused) {
      audio.volume = muted ? 0 : volume;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [muted, volume]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.volume = next ? 0 : volume;
      return next;
    });
  }, [volume]);

  const handleVolumeChange = useCallback((newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    setMuted(newVol === 0);
  }, []);

  if (!songUrl) return null;

  const effectiveVolume = muted ? 0 : volume;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 10,
      }}
    >
      <AnimatePresence>
        {needsTap && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            style={{
              margin: 0,
              padding: "6px 12px",
              borderRadius: 999,
              fontSize: 11,
              letterSpacing: "0.04em",
              color: "var(--text)",
              background: "rgba(13,6,16,0.75)",
              border: "1px solid var(--accent-soft)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            ♪ toca la pantalla para activar el sonido
          </motion.p>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 12 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(13,6,16,0.78)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderRadius: 999,
                padding: "10px 16px",
                border: "1px solid var(--accent-soft)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "#f4b8d0",
                  fontFamily: "var(--font-playfair, Georgia, serif)",
                  whiteSpace: "nowrap",
                  maxWidth: 120,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Mi Princesa
              </span>
              <ControlButton label={muted ? "Activar sonido" : "Silenciar"} onClick={toggleMute} small>
                <VolumeIcon muted={effectiveVolume === 0} />
              </ControlButton>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={effectiveVolume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                aria-label="Volumen"
                style={{
                  width: 84,
                  height: 4,
                  cursor: "pointer",
                  accentColor: "var(--accent)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <ControlButton
          label={expanded ? "Ocultar volumen" : "Mostrar volumen"}
          onClick={() => setExpanded((e) => !e)}
          small
        >
          <VolumeIcon muted={effectiveVolume === 0} />
        </ControlButton>

        <ControlButton label={playing ? "Pausar música" : "Reproducir música"} onClick={togglePlay} accent playing={playing}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </ControlButton>
      </div>

      <audio ref={audioRef} src={songUrl} loop preload="auto" />
    </div>
  );
}

function ControlButton({
  children,
  label,
  onClick,
  small = false,
  accent = false,
  playing = false,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  small?: boolean;
  accent?: boolean;
  playing?: boolean;
}) {
  const size = small ? 34 : 50;
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        border: accent ? "1px solid var(--accent)" : "1px solid var(--accent-soft)",
        background: accent
          ? "linear-gradient(145deg, var(--accent), #c94a7c)"
          : "rgba(13,6,16,0.7)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        color: accent ? "var(--bg)" : "var(--text)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: accent ? "0 4px 16px rgba(232,105,154,0.4)" : "0 2px 10px rgba(0,0,0,0.25)",
        transition: `transform var(--duration-fast) ease, box-shadow var(--duration-fast) ease`,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {accent && playing && (
        <span
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            border: "1px solid rgba(232,105,154,0.5)",
            animation: "musicPlayerPulse 1.8s ease-out infinite",
          }}
        />
      )}
      {children}
      <style>{`
        @keyframes musicPlayerPulse {
          0% { transform: scale(0.85); opacity: 0.8; }
          100% { transform: scale(1.35); opacity: 0; }
        }
      `}</style>
    </button>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginLeft: 2 }}>
      <path d="M3 1.5v13l11-6.5-11-6.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="1" y="0.5" width="4" height="13" rx="1" />
      <rect x="9" y="0.5" width="4" height="13" rx="1" />
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
      <path d="M3 8v4h3.5L11 16V4L6.5 8H3z" />
      {muted ? (
        <path
          d="M13.5 7l4 4m0-4l-4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <path
          d="M14 6.5a5 5 0 010 7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}
