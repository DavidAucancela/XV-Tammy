"use client";

import { useEffect, useRef, useState } from "react";
import Liquid, { type LiquidInstance } from "@/components/canvasui/Liquid";

/**
 * Botón con efecto líquido interactivo (Canvas UI Liquid).
 * El fluido responde al movimiento del mouse y clicks.
 */
export default function LiquidButton({ label = "Click me" }: { label?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const liquidRef = useRef<LiquidInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Liquid requiere un elemento padre específico
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

    return () => {
      liquidRef.current?.destroy();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !liquidRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;

    liquidRef.current.splat(x, y, dx, dy);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !liquidRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Strong splat on click
    liquidRef.current.splat(x, y, 0, 0);
    liquidRef.current.splat(x, y, Math.random() - 0.5, Math.random() - 0.5);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      style={{
        width: "100%",
        maxWidth: "300px",
        aspectRatio: "1",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        cursor: "pointer",
        border: "2px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        fontWeight: 600,
        color: "var(--text)",
        backgroundColor: "var(--surface)",
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
