"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function MusicPlayer({ songUrl = "" }: { songUrl?: string }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const autoplayAttempted = useRef(false);

  // Try to autoplay as soon as the page loads. If the browser blocks
  // unmuted autoplay, fall back to a muted autoplay and unmute on the
  // user's first interaction anywhere on the page.
  useEffect(() => {
    if (!songUrl || autoplayAttempted.current) return;
    autoplayAttempted.current = true;
    const audio = audioRef.current;
    if (!audio) return;

    let cancelled = false;

    const unmuteOnInteraction = () => {
      if (cancelled) return;
      audio.muted = false;
      audio.volume = volume;
      setMuted(false);
      audio.play().catch(() => {});
    };

    const attemptAutoplay = async () => {
      audio.volume = volume;
      try {
        await audio.play();
        if (!cancelled) setPlaying(true);
      } catch {
        try {
          audio.muted = true;
          await audio.play();
          if (!cancelled) {
            setPlaying(true);
            setMuted(true);
            document.addEventListener("click", unmuteOnInteraction, { once: true });
            document.addEventListener("touchstart", unmuteOnInteraction, { once: true });
            document.addEventListener("keydown", unmuteOnInteraction, { once: true });
          }
        } catch {
          // Playback fully blocked — user can start it manually from the widget.
        }
      }
    };

    const timer = setTimeout(attemptAutoplay, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("click", unmuteOnInteraction);
      document.removeEventListener("touchstart", unmuteOnInteraction);
      document.removeEventListener("keydown", unmuteOnInteraction);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songUrl]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setPlaying((p) => {
      const next = !p;
      if (next) {
        audio.volume = muted ? 0 : volume;
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
      return next;
    });
  }, [muted, volume]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.volume = next ? 0 : volume;
      return next;
    });
  }, [volume]);

  const handleVolumeChange = useCallback(
    (newVol: number) => {
      setVolume(newVol);
      if (audioRef.current) {
        audioRef.current.volume = newVol;
        if (muted && newVol > 0) setMuted(false);
      }
    },
    [muted]
  );

  if (!songUrl) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {expanded && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(13,6,16,0.7)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "50px",
            padding: "8px 14px",
            border: "1px solid rgba(232,105,154,0.35)",
          }}
        >
          <ControlButton label={muted ? "Activar sonido" : "Silenciar"} onClick={toggleMute} small>
            {muted ? "🔇" : "🔊"}
          </ControlButton>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            aria-label="Volumen"
            style={{ width: 90, height: 4, cursor: "pointer", accentColor: "#e8699a" }}
          />
        </div>
      )}
      <ControlButton label={playing ? "Pausar música" : "Reproducir música"} onClick={togglePlay}>
        {playing && !muted ? "❚❚" : playing ? "🔇" : "▶"}
      </ControlButton>
      <audio ref={audioRef} src={songUrl} loop preload="none" />
    </div>
  );
}

function ControlButton({
  children,
  label,
  onClick,
  small = false,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  small?: boolean;
}) {
  const size = small ? 30 : 46;
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "1px solid rgba(232,105,154,0.35)",
        background: "rgba(13,6,16,0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        color: "#fdf0f8",
        fontSize: small ? 12 : 16,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}
