"use client";

/**
 * Fondo animado exclusivo de la pantalla del sobre (InvitationOpener).
 * Reutiliza las keyframes mesh-blob-* (respiración vía CSS, sin JS) pero es
 * un set de blobs propio — no depende del cursor ni de MeshBackground/
 * GardenScene, que siguen montados detrás y no deben influir aquí.
 */
export default function EnvelopeBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        className="mesh-blob"
        style={{
          position: "absolute",
          width: "min(620px, 80vw)",
          height: "min(620px, 80vw)",
          top: "-15%",
          left: "-10%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(var(--gold-rgb),0.20) 0%, transparent 68%)",
          filter: "blur(70px)",
          animationName: "mesh-blob-1",
          animationDuration: "20s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}
      />
      <div
        className="mesh-blob"
        style={{
          position: "absolute",
          width: "min(560px, 75vw)",
          height: "min(560px, 75vw)",
          bottom: "-18%",
          right: "-8%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(var(--accent-rgb),0.18) 0%, transparent 68%)",
          filter: "blur(80px)",
          animationName: "mesh-blob-2",
          animationDuration: "26s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}
      />
    </div>
  );
}
