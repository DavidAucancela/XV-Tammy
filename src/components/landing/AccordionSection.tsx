"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useAccordion } from "./RecuerdosAccordionProvider";

interface AccordionSectionProps {
  id: string;
  title: string;
  eyebrow?: string;
  index?: number;
  children: ReactNode;
}

export default function AccordionSection({ id, title, eyebrow, index, children }: AccordionSectionProps) {
  const { isOpen, togglePanel } = useAccordion();
  const open = isOpen(id);

  const borderGradientClosed = "linear-gradient(135deg, var(--border) 0%, var(--border) 100%)";
  const borderGradientOpen = "linear-gradient(120deg, rgba(var(--gold-rgb),0.5), rgba(var(--accent-rgb),0.35), rgba(var(--gold-rgb),0.25))";

  return (
    <section
      id={id}
      style={{
        background: "transparent",
        padding: "0 24px",
        marginBottom: "clamp(16px, 3vw, 24px)",
      }}
    >
      {/* Outer gradient border container */}
      <motion.div
        animate={{
          background: open ? borderGradientOpen : borderGradientClosed,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          borderRadius: 24,
          padding: 1,
        }}
      >
        {/* Inner surface */}
        <motion.div
          animate={{
            background: open ? "linear-gradient(160deg, var(--surface-elevated) 0%, var(--surface) 100%)" : "var(--surface)",
            boxShadow: open ? "var(--shadow-md)" : "var(--shadow-sm)",
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: 23,
            overflow: "hidden",
          }}
        >
          {/* Header button */}
          <motion.button
            onClick={() => togglePanel(id)}
            whileHover={!open ? { y: -2 } : {}}
            transition={{ duration: 0.2 }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "clamp(16px, 4vw, 24px)",
              padding: "28px clamp(20px, 4vw, 32px)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {/* Badge numerado */}
            {index !== undefined && (
              <motion.div
                animate={{
                  background: open ? "var(--accent)" : "transparent",
                  borderColor: open ? "var(--accent)" : "var(--text-muted)",
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "1.5px solid",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  color: open ? "var(--ivory)" : "var(--text-muted)",
                }}
              >
                {String(index).padStart(2, "0")}
              </motion.div>
            )}

            {/* Eyebrow + Title */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {eyebrow && (
                <motion.p
                  animate={{ color: open ? "var(--accent-ink)" : "var(--text-muted)" }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
                    marginBottom: eyebrow ? 8 : 0,
                    margin: 0,
                  }}
                >
                  ✦ &nbsp; {eyebrow} &nbsp; ✦
                </motion.p>
              )}
              <motion.h2
                animate={{ color: open ? "var(--accent-ink)" : "var(--text)" }}
                transition={{ duration: 0.3 }}
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "clamp(1.5rem, 4.5vw, 2.2rem)",
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {title}
              </motion.h2>
            </div>

            {/* Chevron en círculo */}
            <motion.div
              animate={{
                background: open ? "var(--accent)" : "transparent",
                borderColor: open ? "var(--accent)" : "var(--border)",
              }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "1.5px solid",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={open ? "var(--ivory)" : "var(--accent)"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <polyline points="6 9 12 15 18 9" />
              </motion.svg>
            </motion.div>
          </motion.button>

          {/* Divider line between header and content (visible when open) */}
          <motion.div
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, var(--border), transparent)",
            }}
          />

          {/* Content container with grid-template-rows animation */}
          <motion.div
            animate={{
              maxHeight: open ? 9999 : 0,
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "grid",
              gridTemplateRows: open ? "1fr" : "0fr",
              overflow: "hidden",
              maxHeight: open ? 9999 : 0,
              minHeight: 0,
            }}
          >
            <div style={{ overflow: "hidden", padding: "0 clamp(20px, 4vw, 32px) clamp(20px, 4vw, 32px)" }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
