"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Cerrar el menú móvil si la barra se oculta al hacer scroll hacia abajo
  useEffect(() => {
    if (!isVisible) setMenuOpen(false);
  }, [isVisible]);

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
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

      <div className="gallery-nav-links gallery-nav-links--desktop" style={{ display: "flex", alignItems: "center" }}>
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

      {/* Hamburger — only shown on mobile via CSS (.gallery-nav-hamburger) */}
      <button
        className="gallery-nav-hamburger"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
        style={{
          display: "none",
          background: "none",
          border: "1px solid var(--accent-soft)",
          borderRadius: "var(--radius-sm)",
          width: 36,
          height: 36,
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <motion.line
            x1="2" x2="16" stroke="var(--on-ink)" strokeWidth="1.6" strokeLinecap="round"
            animate={menuOpen ? { y1: 9, y2: 9, rotate: 45 } : { y1: 4, y2: 4, rotate: 0 }}
            style={{ transformOrigin: "9px 9px" }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.line
            x1="2" x2="16" stroke="var(--on-ink)" strokeWidth="1.6" strokeLinecap="round"
            animate={{ opacity: menuOpen ? 0 : 1 }}
            y1="9" y2="9"
            transition={{ duration: 0.15 }}
          />
          <motion.line
            x1="2" x2="16" stroke="var(--on-ink)" strokeWidth="1.6" strokeLinecap="round"
            animate={menuOpen ? { y1: 9, y2: 9, rotate: -45 } : { y1: 14, y2: 14, rotate: 0 }}
            style={{ transformOrigin: "9px 9px" }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      </button>

      {/* Mobile dropdown panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="gallery-nav-mobile-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "var(--ink)",
              borderBottom: "1px solid rgba(var(--accent-rgb), 0.18)",
              overflow: "hidden",
              display: "none",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", padding: "8px 20px 16px" }}>
              {NAV_LINKS.map(({ label, id }) => {
                const isActive = isOpen(id);
                return (
                  <button
                    key={id}
                    onClick={() => handleNavClick(id)}
                    aria-current={isActive ? "true" : undefined}
                    style={{
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid rgba(var(--accent-rgb), 0.1)",
                      padding: "14px 4px",
                      textAlign: "left",
                      cursor: "pointer",
                      textTransform: "uppercase",
                      fontSize: 12,
                      letterSpacing: "0.14em",
                      color: isActive ? "var(--accent)" : "var(--on-ink-muted)",
                      fontFamily: "var(--font-lato), system-ui, sans-serif",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
