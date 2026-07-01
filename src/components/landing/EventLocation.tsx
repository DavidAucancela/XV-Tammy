"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RevealText from "./RevealText";

type Venue = { name: string; address: string };

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
          <div
            style={{
              width: 52,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, #e8699a, transparent)",
              margin: "0 auto",
            }}
          />
        </motion.div>

        {/* Details card — scroll-linked parallax */}
        <motion.div
          style={{
            background: "rgba(22, 13, 30, 0.95)",
            border: "1px solid #251535",
            borderRadius: 22,
            padding: "38px 32px",
            marginBottom: 28,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 28,
            boxShadow: "0 0 60px rgba(232,105,154,0.06)",
            y: cardY,
          }}
        >
          {[
            { icon: "📅", label: "Fecha", value: dateLabel },
            { icon: "⏰", label: "Hora", value: timeLabel },
            { icon: "🏛️", label: "Salón", value: venue.name },
            { icon: "📍", label: "Dirección", value: venue.address },
          ].map(({ icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ textAlign: "center" }}
            >
              <span style={{ fontSize: 28 }}>{icon}</span>
              <p
                style={{
                  fontSize: 8,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#7a5870",
                  margin: "10px 0 7px",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "#c9a0b8",
                  textTransform: "capitalize",
                  lineHeight: 1.5,
                  fontWeight: 300,
                }}
              >
                {value}
              </p>
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
            <div
              style={{
                borderRadius: 22,
                overflow: "hidden",
                border: "1px solid #251535",
                height: 340,
                boxShadow: "0 0 50px rgba(232,105,154,0.05)",
              }}
            >
              <iframe
                src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                title="Ubicación del evento"
                style={{ width: "100%", height: "100%", border: "none" }}
                loading="lazy"
              />
            </div>
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
                style={{ display: "inline-block", fontSize: 36, opacity: 0.2 }}
              >
                🗺️
              </motion.span>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "#3a1a30",
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
