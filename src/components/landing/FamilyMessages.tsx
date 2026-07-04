"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SectionHeading from "./SectionHeading";
import { useMusicContext } from "@/context/MusicContext";
import type { FamilyItem } from "@/data/landingContent";

type TextItem = Extract<FamilyItem, { type: "text" }>;
type VideoItem = Extract<FamilyItem, { type: "video" }>;

export default function FamilyMessages({ items }: { items: FamilyItem[] }) {
  const { setIsVideoPlaying } = useMusicContext();
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeItem = items.find((item) => `${item.author}-${item.type}` === activeId) ?? null;

  const handleOpen = (item: FamilyItem) => {
    const id = `${item.author}-${item.type}`;
    setActiveId(id);
    if (item.type === "video") {
      setIsVideoPlaying(true);
    }
  };

  const handleClose = () => {
    setActiveId(null);
    setIsVideoPlaying(false);
  };

  return (
    <section
      id="familia"
      style={{ padding: "100px 24px", background: "var(--bg)" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <SectionHeading title="Mensajes de tu familia" marginBottom={60} />

        {/* Buttons for all people */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 10,
            marginBottom: 40,
          }}
        >
          {items.map((item) => {
            const isActive = activeId === `${item.author}-${item.type}`;
            const isVideo = item.type === "video";
            return (
              <button
                key={`${item.author}-${item.type}`}
                onClick={() => (isActive ? handleClose() : handleOpen(item))}
                aria-pressed={isActive}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  borderRadius: "var(--radius-pill)",
                  border: `1px solid ${
                    isActive ? (isVideo ? "var(--gold-solid)" : "var(--accent)") : isVideo ? "var(--gold-soft)" : "var(--accent-soft)"
                  }`,
                  background: isActive ? (isVideo ? "var(--gold-faint)" : "var(--accent-faint)") : "var(--surface)",
                  color: isActive ? (isVideo ? "var(--gold-solid)" : "var(--accent)") : "var(--text)",
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard)",
                }}
              >
                {isVideo ? (
                  <svg width="9" height="9" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                    <path d="M3 1.5v13l11-6.5-11-6.5z" />
                  </svg>
                ) : (
                  <span style={{ fontSize: 11, opacity: 0.7 }}>♦</span>
                )}
                {item.author}
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          {activeItem && (
            <motion.div
              key={`${activeItem.author}-${activeItem.type}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden", maxWidth: 720, margin: "0 auto" }}
            >
              {activeItem.type === "text" ? (
                <MessagePanel item={activeItem} />
              ) : (
                <VideoPanel item={activeItem} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function MessagePanel({ item }: { item: TextItem }) {
  return (
    <div
      style={{
        background: "linear-gradient(160deg, var(--surface-elevated) 0%, var(--surface) 100%)",
        border: "1px solid var(--accent-soft)",
        borderRadius: "var(--radius-lg)",
        padding: "40px 32px 30px",
        marginTop: 28,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <span
        aria-hidden
        style={{
          display: "block",
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: 52,
          lineHeight: 0.6,
          color: "var(--accent)",
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
          color: "var(--text)",
          fontStyle: "italic",
          marginBottom: 26,
        }}
      >
        {item.text}
      </p>

      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg, var(--accent-soft), transparent)",
          marginBottom: 18,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid var(--accent-soft)",
            background: "var(--accent-faint)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: 17,
            color: "var(--accent-ink)",
            flexShrink: 0,
          }}
        >
          {item.author.charAt(0)}
        </span>
        <div>
          <p
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: 15,
              color: "var(--text)",
              marginBottom: 3,
            }}
          >
            {item.author}
          </p>
          <p
            style={{
              fontSize: 9,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            {item.role}
          </p>
        </div>
      </div>
    </div>
  );
}

function VideoPanel({ item }: { item: VideoItem }) {
  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        marginTop: 28,
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        background: "var(--ink)",
        border: "1px solid var(--gold-soft)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <iframe
        src={item.videoUrl}
        title={`Video de ${item.author}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
