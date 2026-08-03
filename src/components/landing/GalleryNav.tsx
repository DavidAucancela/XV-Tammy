"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAccordion } from "./RecuerdosAccordionProvider";

const NAV_LINKS = [
  { label: "Galería", id: "galeria" },
  { label: "Álbum", id: "galeria-grid" },
  { label: "Familia", id: "familia" },
  { label: "Evento", id: "evento" },
  { label: "Compartir", id: "recuerdos-compartidos" },
  { label: "Invitación", id: "invitacion" },
];

export default function GalleryNav() {
  const { isOpen, openPanel } = useAccordion();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  const handleNavClick = (id: string) => {
    openPanel(id);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 350);
  };

  return (
    <nav
      className="gallery-nav"
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "var(--ink)",
        borderBottom: "1px solid rgba(var(--accent-rgb), 0.18)",
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      {/* Always-available way back to the landing hero */}
      <Link
        href="/"
        className="gallery-nav-back"
        style={{
          display: "inline-flex",
          alignItems: "center",
          textTransform: "uppercase",
          color: "var(--on-ink)",
          textDecoration: "none",
          border: "1px solid var(--accent-soft)",
          borderRadius: "var(--radius-pill)",
          whiteSpace: "nowrap",
          transition: "border-color 0.25s, background 0.25s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--accent)";
          e.currentTarget.style.background = "rgba(var(--accent-rgb), 0.14)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--accent-soft)";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <svg
          aria-hidden
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.5 3 5.5 8l5 5" />
        </svg>
        Volver al inicio
      </Link>

      <div className="gallery-nav-links" style={{ display: "flex", alignItems: "center" }}>
        {NAV_LINKS.map(({ label, id }) => {
          const isActive = isOpen(id);
          return (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              aria-current={isActive ? "true" : undefined}
              className="gallery-nav-link"
              style={{
                position: "relative",
                background: "none",
                border: "none",
                padding: "4px 0",
                cursor: "pointer",
                textTransform: "uppercase",
                color: isActive ? "var(--accent)" : "var(--on-ink-muted)",
                fontFamily: "var(--font-lato), system-ui, sans-serif",
                transition: "color 0.25s",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "var(--on-ink)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "var(--on-ink-muted)"; }}
            >
              {label}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -6,
                  height: 1.5,
                  borderRadius: 1,
                  background: "var(--accent)",
                  transform: isActive ? "scaleX(1)" : "scaleX(0)",
                  opacity: isActive ? 1 : 0,
                  transition: "transform 0.25s ease, opacity 0.25s ease",
                }}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
