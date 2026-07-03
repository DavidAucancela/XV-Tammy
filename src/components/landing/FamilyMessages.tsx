"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import TiltCard from "./TiltCard";
import RevealText from "./RevealText";
import type { FamilyItem } from "@/data/landingContent";

export default function FamilyMessages({ items }: { items: FamilyItem[] }) {
  return (
    <section
      id="familia"
      style={{ padding: "100px 24px", background: "rgba(9, 4, 13, 0.90)" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 60 }}
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
            ✦ &nbsp; con amor &nbsp; ✦
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
            Mensajes de la Familia
          </RevealText>
          <div className="ornament-divider">
            <span>✦</span>
          </div>
        </motion.div>

        {/* Mixed text / video masonry grid */}
        <div className="family-masonry">
          {items.map((item, i) => (
            <motion.div
              key={`${item.author}-${i}`}
              className="family-masonry-item"
              initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? -0.8 : 0.8 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: (i % 6) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard
                maxTilt={7}
                glowColor="rgba(232,105,154,0.18)"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(30,16,38,0.96) 0%, rgba(22,13,30,0.96) 55%, rgba(26,12,28,0.96) 100%)",
                  border: "1px solid var(--gold-soft, rgba(210,155,55,0.35))",
                  borderRadius: 22,
                  padding: item.type === "video" ? "20px 20px 26px" : "40px 32px 30px",
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
                    borderRadius: 16,
                    border: "1px solid var(--gold-faint, rgba(210,155,55,0.14))",
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
                      color: "var(--gold-soft, rgba(210,155,55,0.35))",
                      pointerEvents: "none",
                      lineHeight: 1,
                    }}
                  >
                    ✦
                  </span>
                ))}

                {item.type === "video" ? <VideoBody item={item} /> : <TextBody item={item} />}
                <AuthorFooter author={item.author} role={item.role} />
              </TiltCard>
            </motion.div>
          ))}
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
          borderRadius: 14,
          overflow: "hidden",
          background: "#0d0610",
          border: "1px solid #251535",
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
      </div>
    </div>
  );
}

function AuthorFooter({ author, role }: { author: string; role: string }) {
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
          border: "1px solid var(--gold-soft, rgba(210,155,55,0.35))",
          background: "rgba(210,155,55,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: 17,
          color: "var(--gold, rgba(210,155,55,0.55))",
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
