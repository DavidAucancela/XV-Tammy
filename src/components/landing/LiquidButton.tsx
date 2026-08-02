"use client";

import { useEffect, useRef, useState } from "react";
import Liquid, { type LiquidInstance } from "@/components/canvasui/Liquid";

/**
 * Botón con efecto líquido interactivo (Canvas UI Liquid).
 * El fluido responde al movimiento del mouse y clicks.
 */
export default function LiquidButton({
  label = "Click me",
  onClick,
}: {
  label?: string;
  onClick?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const liquidRef = useRef<LiquidInstance | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || isInitialized || hasError) return;

    try {
      liquidRef.current = new (Liquid as any)(
        {
          simResolution: 128,
          dyeResolution: 512,
          densityDissipation: 0.96,
          velocityDissipation: 0.99,
          pressure: 0.8,
          pressureIterations: 24,
          curl: 2,
          radius: 0.25,
          force: 4,
          intensity: 2,
          distortion: 1,
          blend: 2,
          color: [0.569, 0.278, 0.485], // Rose gold
          rainbow: false,
        },
        containerRef.current
      );
      setIsInitialized(true);
    } catch (err) {
      console.warn("Liquid initialization failed:", err);
      setHasError(true);
    }

    return () => {
      try {
        liquidRef.current?.destroy();
      } catch (err) {
        console.warn("Liquid cleanup failed:", err);
      }
    };
  }, [isInitialized, hasError]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !liquidRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Clamp values to 0-1 range
    if (x < 0 || x > 1 || y < 0 || y > 1) return;

    const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;

    try {
      liquidRef.current.splat(x, y, dx, dy);
    } catch (err) {
      console.warn("Splat error:", err);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !liquidRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Clamp values
    if (x < 0 || x > 1 || y < 0 || y > 1) return;

    try {
      liquidRef.current.splat(x, y, 0, 0);
      liquidRef.current.splat(x, y, Math.random() - 0.5, Math.random() - 0.5);
    } catch (err) {
      console.warn("Splat error:", err);
    }

    if (typeof onClick === "function") {
      onClick();
    }
  };

  if (hasError) {
    // Fallback: render como botón normal si Liquid falla
    return (
      <button
        onClick={onClick}
        style={{
          width: "100%",
          maxWidth: "100%",
          minHeight: 56,
          borderRadius: "var(--radius-pill)",
          border: "none",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--ivory)",
          backgroundColor: "var(--accent-ink)",
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      style={{
        width: "100%",
        maxWidth: "100%",
        aspectRatio: "auto",
        minHeight: 56,
        borderRadius: "var(--radius-pill)",
        overflow: "hidden",
        cursor: "pointer",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--ivory)",
        backgroundColor: "var(--accent-ink)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
          pointerEvents: "none",
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
}
