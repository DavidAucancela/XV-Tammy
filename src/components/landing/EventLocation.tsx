"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./Button";

type Venue = { name: string; address: string };

const ICON_STROKE = "var(--gold-solid)";

const icons: Record<string, React.ReactNode> = {
  calendar: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ICON_STROKE} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  clock: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ICON_STROKE} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
  venue: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ICON_STROKE} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V8l7-5 7 5v13" />
      <path d="M10 21v-5a2 2 0 0 1 4 0v5" />
    </svg>
  ),
  pin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ICON_STROKE} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
};

export default function EventLocation({
  dateLabel,
  timeLabel,
  venue,
  lat,
  lng,
}: {
  dateLabel: string;
  timeLabel: string;
  venue: Venue;
  lat: string;
  lng: string;
}) {
  const hasMap = Boolean(lat.trim() && lng.trim());
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const cardY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -16]);

  const details = [
    { icon: icons.calendar, label: "Fecha", value: dateLabel, sub: null, capitalize: true },
    { icon: icons.clock, label: "Hora", value: timeLabel, sub: null, capitalize: false },
    { icon: icons.pin, label: "Lugar", value: venue.name, sub: venue.address, capitalize: false },
  ];

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Invitation ticket — a single unified row, never wraps.
            Entrance reads like a stamp being pressed onto the invitation. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2.5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          style={{
            position: "relative",
            borderRadius: 24,
            padding: 1,
            marginBottom: 40,
            background:
              "linear-gradient(120deg, rgba(var(--gold-rgb),0.5), rgba(var(--accent-rgb),0.35), rgba(var(--gold-rgb),0.25))",
            boxShadow: "var(--shadow-md)",
            y: cardY,
          }}
        >
          <div
            className="event-ticket-row"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${details.length}, 1fr)`,
              borderRadius: 23,
              background:
                "linear-gradient(160deg, var(--surface-elevated) 0%, var(--surface) 100%)",
            }}
          >
            {details.map(({ icon, label, value, sub, capitalize }, i) => (
              <div
                key={label}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {i > 0 && <div aria-hidden className="event-ticket-divider" />}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    width: "100%",
                    padding: "30px 18px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 13,
                  }}
                >
                  <span
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid var(--accent-soft)",
                      background:
                        "radial-gradient(circle, rgba(var(--accent-rgb),0.2) 0%, transparent 75%)",
                    }}
                  >
                    {icon}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: "var(--accent-ink)",
                        marginBottom: 8,
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontSize: 15.5,
                        color: "var(--text)",
                        textTransform: capitalize ? "capitalize" : "none",
                        lineHeight: 1.45,
                      }}
                    >
                      {value}
                    </p>
                    {sub && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          marginTop: 6,
                          lineHeight: 1.4,
                        }}
                      >
                        {sub}
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          id="ubicacion"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {hasMap ? (
            <>
              <div
                style={{
                  borderRadius: 22,
                  padding: 1,
                  background:
                    "linear-gradient(135deg, rgba(var(--gold-rgb),0.5), rgba(var(--accent-rgb),0.4), rgba(var(--gold-rgb),0.25))",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <div
                  style={{
                    borderRadius: 21,
                    overflow: "hidden",
                    height: 360,
                    background: "var(--surface)",
                  }}
                >
                  <iframe
                    src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                    title="Ubicación del evento"
                    style={{ width: "100%", height: "100%", border: "none" }}
                    loading="lazy"
                  />
                </div>
              </div>
              <motion.div
                style={{ textAlign: "center", marginTop: 40 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.a
                  href={`https://maps.google.com/?q=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "16px 40px",
                    borderRadius: 28,
                    background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-ink) 100%)",
                    color: "var(--ivory)",
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    boxShadow: "0 8px 24px rgba(var(--accent-rgb), 0.3)",
                    border: "1px solid rgba(var(--ivory), 0.2)",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(var(--accent-rgb), 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(var(--accent-rgb), 0.3)";
                  }}
                >
                  <motion.svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </motion.svg>
                  Cómo llegar
                </motion.a>
              </motion.div>
            </>
          ) : (
            <div
              style={{
                borderRadius: 22,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                padding: "44px",
                textAlign: "center",
              }}
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: "inline-block", opacity: 0.4 }}
              >
                {icons.pin}
              </motion.span>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginTop: 14,
                }}
              >
                ubicación próximamente
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
