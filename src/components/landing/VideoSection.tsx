"use client";

import { motion } from "framer-motion";
import RevealText from "./RevealText";

export default function VideoSection({ videoUrl }: { videoUrl: string }) {
  return (
    <section id="video" style={{ padding: "100px 24px", background: "rgba(13, 6, 16, 0.88)" }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: 780, margin: "0 auto" }}
      >
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p
            style={{
              fontSize: 9,
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "#e8699a",
              marginBottom: 16,
            }}
          >
            ✦ &nbsp; momentos especiales &nbsp; ✦
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
            Video
          </RevealText>
          <div
            style={{
              width: 52,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, #e8699a, transparent)",
              margin: "0 auto",
            }}
          />
        </div>

        {/* Video container — 16:9 */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            paddingBottom: "56.25%",
            borderRadius: 22,
            overflow: "hidden",
            border: "1px solid #251535",
            background: "rgba(22, 13, 30, 0.92)",
            boxShadow:
              "0 0 80px rgba(232,105,154,0.08), inset 0 0 40px rgba(0,0,0,0.4)",
          }}
        >
          {videoUrl ? (
            <iframe
              src={videoUrl}
              title="Video de los XV Años"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  border: "2px solid #251535",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 30, paddingLeft: 5 }}>▶</span>
              </motion.div>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#3a1a30",
                }}
              >
                video próximamente
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
