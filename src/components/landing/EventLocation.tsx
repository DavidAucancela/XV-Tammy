"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RevealText from "./RevealText";

type Venue = { name: string; address: string };

const ICON_STROKE = "rgba(210,155,55,0.85)";

const icons: Record<string, React.ReactNode> = {
  calendar: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ICON_STROKE} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  clock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ICON_STROKE} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
  venue: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ICON_STROKE} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V8l7-5 7 5v13" />
      <path d="M10 21v-5a2 2 0 0 1 4 0v5" />
    </svg>
  ),
  pin: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ICON_STROKE} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
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
  const cardY = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -20]);

  const details = [
    { icon: icons.calendar, label: "Fecha", value: dateLabel },
    { icon: icons.clock, label: "Hora", value: timeLabel },
    { icon: icons.venue, label: "Salón", value: venue.name },
    { icon: icons.pin, label: "Dirección", value: venue.address },
  ];

  return (
    <section
      ref={ref}
      id="evento"
      style={{ padding: "100px 24px 48px", background: "rgba(9, 4, 13, 0.90)" }}
    >
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 52 }}
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
            ✦ &nbsp; te esperamos &nbsp; ✦
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
            El Evento
          </RevealText>
          <div className="ornament-divider">
            <span>✦</span>
          </div>
        </motion.div>

        {/* Detail cards — scroll-linked parallax */}
        <motion.div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
            marginBottom: 32,
            y: cardY,
          }}
        >
          {details.map(({ icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background:
                  "linear-gradient(160deg, rgba(30,16,38,0.95) 0%, rgba(22,13,30,0.95) 100%)",
                border: "1px solid #251535",
                borderRadius: 20,
                padding: "30px 26px",
                display: "flex",
                alignItems: "center",
                gap: 18,
                boxShadow: "0 0 40px rgba(232,105,154,0.05)",
              }}
            >
              <span
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--gold-soft, rgba(210,155,55,0.35))",
                  background:
                    "radial-gradient(circle, rgba(210,155,55,0.10) 0%, transparent 75%)",
                }}
              >
                {icon}
              </span>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 8,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "#b0798f",
                    marginBottom: 7,
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: 16,
                    color: "#fdf0f8",
                    textTransform: "capitalize",
                    lineHeight: 1.45,
                  }}
                >
                  {value}
                </p>
              </div>
            </motion.div>
          ))}
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
                    "linear-gradient(135deg, rgba(210,155,55,0.45), rgba(232,105,154,0.35), rgba(210,155,55,0.2))",
                  boxShadow: "0 0 50px rgba(232,105,154,0.07)",
                }}
              >
                <div
                  style={{
                    borderRadius: 21,
                    overflow: "hidden",
                    height: 340,
                    background: "#0d0610",
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
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <a
                  href={`https://maps.google.com/?q=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 30px",
                    borderRadius: 999,
                    border: "1px solid rgba(232,105,154,0.45)",
                    color: "#e8699a",
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    transition: "background 0.25s, color 0.25s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(232,105,154,0.12)";
                    e.currentTarget.style.color = "#fdf0f8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#e8699a";
                  }}
                >
                  {icons.pin}
                  Cómo llegar
                </a>
              </div>
            </>
          ) : (
            <div
              style={{
                borderRadius: 22,
                border: "1px solid rgba(24,13,34,0.6)",
                background: "rgba(14,7,22,0.80)",
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
                  color: "#6a4560",
                  marginTop: 14,
                }}
              >
                ubicación próximamente
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
