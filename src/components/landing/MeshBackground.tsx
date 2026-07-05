"use client";

export default function MeshBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Rose blob — top center, primary accent (enhanced) */}
      <div
        className="mesh-blob"
        style={{
          position: "absolute",
          width: "min(800px, 85vw)",
          height: "min(800px, 85vw)",
          top: "-20%",
          left: "10%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(var(--accent-rgb),0.22) 0%, transparent 68%)",
          filter: "blur(75px)",
          animationName: "mesh-blob-1",
          animationDuration: "24s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}
      />
      {/* Golden blob — bottom right (enhanced) */}
      <div
        className="mesh-blob"
        style={{
          position: "absolute",
          width: "min(650px, 70vw)",
          height: "min(650px, 70vw)",
          bottom: "-5%",
          right: "-12%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(var(--gold-rgb),0.20) 0%, transparent 68%)",
          filter: "blur(95px)",
          animationName: "mesh-blob-2",
          animationDuration: "32s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}
      />
      {/* Deep rose blob — mid left (enhanced) */}
      <div
        className="mesh-blob"
        style={{
          position: "absolute",
          width: "min(550px, 60vw)",
          height: "min(550px, 60vw)",
          top: "35%",
          left: "-10%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(var(--accent-ink-rgb),0.16) 0%, transparent 68%)",
          filter: "blur(85px)",
          animationName: "mesh-blob-3",
          animationDuration: "28s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}
      />
      {/* Soft rose blob — top right, subtle accent */}
      <div
        className="mesh-blob"
        style={{
          position: "absolute",
          width: "min(500px, 55vw)",
          height: "min(500px, 55vw)",
          top: "15%",
          right: "5%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(var(--accent-rgb),0.14) 0%, transparent 65%)",
          filter: "blur(75px)",
          animationName: "mesh-blob-4",
          animationDuration: "35s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}
      />
      {/* Gold-soft blob — center, delicate glow */}
      <div
        className="mesh-blob"
        style={{
          position: "absolute",
          width: "min(420px, 50vw)",
          height: "min(420px, 50vw)",
          top: "50%",
          right: "20%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(var(--gold-rgb),0.14) 0%, transparent 70%)",
          filter: "blur(80px)",
          animationName: "mesh-blob-5",
          animationDuration: "30s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}
      />
    </div>
  );
}
