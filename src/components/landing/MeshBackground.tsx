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
      {/* Rose blob — top center, primary accent */}
      <div
        className="mesh-blob"
        style={{
          position: "absolute",
          width: "min(700px, 80vw)",
          height: "min(700px, 80vw)",
          top: "-15%",
          left: "15%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,105,154,0.22) 0%, transparent 65%)",
          filter: "blur(70px)",
          animationName: "mesh-blob-1",
          animationDuration: "20s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}
      />
      {/* Golden blob — bottom right */}
      <div
        className="mesh-blob"
        style={{
          position: "absolute",
          width: "min(580px, 65vw)",
          height: "min(580px, 65vw)",
          bottom: "5%",
          right: "-8%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(210,155,55,0.13) 0%, transparent 65%)",
          filter: "blur(90px)",
          animationName: "mesh-blob-2",
          animationDuration: "27s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}
      />
      {/* Deep magenta blob — mid left */}
      <div
        className="mesh-blob"
        style={{
          position: "absolute",
          width: "min(480px, 55vw)",
          height: "min(480px, 55vw)",
          top: "38%",
          left: "-8%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(160,55,118,0.14) 0%, transparent 65%)",
          filter: "blur(80px)",
          animationName: "mesh-blob-3",
          animationDuration: "32s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}
      />
    </div>
  );
}
