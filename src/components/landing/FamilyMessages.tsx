"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import TiltCard from "./TiltCard";
import SectionHeading from "./SectionHeading";
import type { FamilyItem } from "@/data/landingContent";

export default function FamilyMessages({ items }: { items: FamilyItem[] }) {
  return (
    <section
      id="familia"
      style={{ padding: "100px 24px", background: "rgba(9, 4, 13, 0.90)" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <SectionHeading title="Mensajes de la Familia" marginBottom={60} />

        {/* Mixed text / video masonry grid */}
        <div className="family-masonry">
          {items.map((item, i) => {
            const isVideo = item.type === "video";
            const frameColor = isVideo ? "var(--accent-secondary-soft)" : "var(--gold-soft, rgba(210,155,55,0.35))";
            const frameFaint = isVideo ? "rgba(122,58,94,0.25)" : "var(--gold-faint, rgba(210,155,55,0.14))";
            return (
              <motion.div
                key={`${item.author}-${i}`}
                className="family-masonry-item"
                initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? -1.4 : 1.4 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 170, damping: 20, delay: (i % 6) * 0.08 }}
              >
                <TiltCard
                  maxTilt={7}
                  glowColor={isVideo ? "rgba(122,58,94,0.28)" : "rgba(232,105,154,0.18)"}
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(30,16,38,0.96) 0%, rgba(22,13,30,0.96) 55%, rgba(26,12,28,0.96) 100%)",
                    border: `1px solid ${frameColor}`,
                    borderRadius: "var(--radius-lg)",
                    padding: isVideo ? "20px 20px 26px" : "40px 32px 30px",
                    position: "relative",
                    boxShadow:
                      "inset 0 0 0 1px rgba(13,6,16,0.9), 0 0 40px rgba(232,105,154,0.06)",
                  }}
                >
                  {/* Inner hairline frame */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 7,
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${frameFaint}`,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Corner ornaments */}
                  {[
                    { top: 12, left: 16 },
                    { top: 12, right: 16 },
                    { bottom: 12, left: 16 },
                    { bottom: 12, right: 16 },
                  ].map((pos, j) => (
                    <span
                      key={j}
                      style={{
                        position: "absolute",
                        ...pos,
                        fontSize: 8,
                        color: frameColor,
                        pointerEvents: "none",
                        lineHeight: 1,
                      }}
                    >
                      ✦
                    </span>
                  ))}

                  {isVideo ? <VideoBody item={item} /> : <TextBody item={item} />}
                  <AuthorFooter author={item.author} role={item.role} accent={isVideo ? "secondary" : "gold"} />
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TextBody({ item }: { item: Extract<FamilyItem, { type: "text" }> }) {
  return (
    <>
      <span
        aria-hidden
        style={{
          display: "block",
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: 52,
          lineHeight: 0.6,
          color: "var(--gold, rgba(210,155,55,0.55))",
          userSelect: "none",
          marginBottom: 18,
        }}
      >
        &ldquo;
      </span>

      <p
        style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: 16.5,
          lineHeight: 1.9,
          color: "#ecd2df",
          fontStyle: "italic",
          marginBottom: 26,
          position: "relative",
          zIndex: 1,
        }}
      >
        {item.text}
      </p>

      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg, var(--gold-soft, rgba(210,155,55,0.35)), transparent)",
          marginBottom: 18,
        }}
      />
    </>
  );
}

function VideoBody({ item }: { item: Extract<FamilyItem, { type: "video" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 1, marginBottom: 18, marginTop: 8 }}>
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          background: "var(--bg)",
          border: "1px solid var(--accent-secondary-soft)",
        }}
      >
        {inView && (
          <iframe
            src={item.videoUrl}
            title={`Video de ${item.author}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        )}
        {/* Recognizable at a glance as a video, even before the iframe paints */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 9px 4px 7px",
            borderRadius: "var(--radius-pill)",
            background: "rgba(13,6,16,0.7)",
            border: "1px solid var(--accent-secondary-soft)",
            backdropFilter: "blur(6px)",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#e0b8d0",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 1.5v13l11-6.5-11-6.5z" />
          </svg>
          Video
        </span>
      </div>
    </div>
  );
}

function AuthorFooter({
  author,
  role,
  accent = "gold",
}: {
  author: string;
  role: string;
  accent?: "gold" | "secondary";
}) {
  const isSecondary = accent === "secondary";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        position: "relative",
        zIndex: 1,
      }}
    >
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: `1px solid ${isSecondary ? "var(--accent-secondary-soft)" : "var(--gold-soft, rgba(210,155,55,0.35))"}`,
          background: isSecondary ? "rgba(122,58,94,0.15)" : "rgba(210,155,55,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: 17,
          color: isSecondary ? "#d9a8c4" : "var(--gold, rgba(210,155,55,0.55))",
          flexShrink: 0,
        }}
      >
        {author.charAt(0)}
      </span>
      <div>
        <p
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: 15,
            color: "#fdf0f8",
            marginBottom: 3,
          }}
        >
          {author}
        </p>
        <p
          style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#b0798f",
          }}
        >
          {role}
        </p>
      </div>
    </div>
  );
}
