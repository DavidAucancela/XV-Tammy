"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────
type CamState = "idle" | "starting" | "active" | "cam-error";
type ScanResult =
  | { status: "ready" }
  | { status: "processing" }
  | { status: "success"; nombre: string; pases: number }
  | { status: "already_in"; nombre: string }
  | { status: "invalid" }
  | { status: "offline" }
  | { status: "error"; message: string };

const RESET_DELAY = 3500;
const OFFLINE_KEY = "checkin_offline_queue";

// ── Audio ──────────────────────────────────────────────────────────────────
function playBeep(type: "success" | "duplicate" | "error") {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === "success") {
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(); osc.stop(ctx.currentTime + 0.35);
    } else if (type === "duplicate") {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(); osc.stop(ctx.currentTime + 0.25);
    } else {
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    }
  } catch { /* blocked until user gesture */ }
}

// ── Helpers ────────────────────────────────────────────────────────────────
function extractToken(text: string): string | null {
  try {
    const url = new URL(text);
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0] === "i" && parts[1]) return parts[1];
  } catch { /* not a URL */ }
  if (text && !text.includes("/") && text.trim().length > 0) return text.trim();
  return null;
}

function getQueue(): string[] {
  try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) ?? "[]"); } catch { return []; }
}
function saveQueue(q: string[]) { localStorage.setItem(OFFLINE_KEY, JSON.stringify(q)); }

// ── Status display config ──────────────────────────────────────────────────
const STATUS_CFG = {
  ready:       { bg: "rgba(8,8,8,0.82)",   accent: "#c9a96e", label: "Apuntá la cámara al QR" },
  processing:  { bg: "rgba(8,8,8,0.92)",   accent: "#6b9fc9", label: "Verificando…" },
  success:     { bg: "rgba(4,22,12,0.96)", accent: "#4caf7d", label: "✓ Acceso permitido" },
  already_in:  { bg: "rgba(22,17,0,0.96)", accent: "#c9a000", label: "⚠ Ya había ingresado" },
  invalid:     { bg: "rgba(22,6,6,0.96)",  accent: "#e07070", label: "✗ QR inválido" },
  offline:     { bg: "rgba(22,12,4,0.96)", accent: "#e09050", label: "Sin señal — guardado en cola" },
  error:       { bg: "rgba(22,12,4,0.96)", accent: "#e09050", label: "Error" },
};

// ── Component ──────────────────────────────────────────────────────────────
export default function ScannerClient() {
  const [camState, setCamState] = useState<CamState>("idle");
  const [camError, setCamError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult>({ status: "ready" });
  const [isOnline, setIsOnline] = useState(true);
  const [queueCount, setQueueCount] = useState(0);

  const processingRef = useRef(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null);

  const scheduleReset = useCallback(() => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setResult({ status: "ready" });
      processingRef.current = false;
    }, RESET_DELAY);
  }, []);

  const syncQueue = useCallback(async () => {
    const queue = getQueue();
    if (!queue.length) return;
    const remaining: string[] = [];
    for (const token of queue) {
      try {
        const res = await fetch("/api/checkin", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (!res.ok) remaining.push(token);
      } catch { remaining.push(token); }
    }
    saveQueue(remaining);
    setQueueCount(remaining.length);
  }, []);

  const handleScan = useCallback(async (text: string) => {
    if (processingRef.current) return;
    const token = extractToken(text);
    if (!token) return;

    processingRef.current = true;
    setResult({ status: "processing" });

    if (!navigator.onLine) {
      const q = getQueue();
      if (!q.includes(token)) { q.push(token); saveQueue(q); setQueueCount(q.length); }
      playBeep("duplicate");
      setResult({ status: "offline" });
      scheduleReset();
      return;
    }

    try {
      const res = await fetch("/api/checkin", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.status === 404) {
        playBeep("error"); setResult({ status: "invalid" });
      } else if (!res.ok) {
        playBeep("error"); setResult({ status: "error", message: data.error ?? "Error" });
      } else if (data.already_checked_in) {
        playBeep("duplicate"); setResult({ status: "already_in", nombre: data.guest.nombre });
      } else {
        playBeep("success"); setResult({ status: "success", nombre: data.guest.nombre, pases: data.guest.pases });
      }
    } catch {
      playBeep("error"); setResult({ status: "error", message: "Sin conexión" });
    }
    scheduleReset();
  }, [scheduleReset]);

  // Online/offline
  useEffect(() => {
    const up = () => { setIsOnline(true); syncQueue(); };
    const down = () => setIsOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    setIsOnline(navigator.onLine);
    setQueueCount(getQueue().length);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, [syncQueue]);

  // Start camera on user tap
  const startCamera = useCallback(async () => {
    setCamState("starting");
    setCamError(null);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const qr = new Html5Qrcode("qr-reader");
      scannerRef.current = qr;
      await qr.start(
        { facingMode: "environment" },
        { fps: 12, qrbox: { width: 220, height: 220 }, aspectRatio: 1 },
        handleScan,
        () => {}
      );
      setCamState("active");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo acceder a la cámara";
      setCamError(msg);
      setCamState("cam-error");
    }
  }, [handleScan]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
      scannerRef.current?.stop().catch(() => {});
    };
  }, []);

  const cfg = STATUS_CFG[result.status];

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "#080808",
        display: "flex", flexDirection: "column",
        fontFamily: "var(--font-lato), system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Top bar ── */}
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "14px 20px",
        background: "rgba(8,8,8,0.88)", backdropFilter: "blur(8px)",
        zIndex: 10,
      }}>
        <span style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "#c9a96e" }}>
          ✦ Control de acceso
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!isOnline && (
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "#2b1a0d", color: "#e09050" }}>
              offline
            </span>
          )}
          {queueCount > 0 && (
            <button
              onClick={syncQueue}
              style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "#2b2200", color: "#c9a000", cursor: "pointer", border: "none" }}
            >
              {queueCount} en cola ↑
            </button>
          )}
        </div>
      </div>

      {/* ── Camera area ── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>

        {/* html5-qrcode renders here */}
        <div
          id="qr-reader"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />

        {/* ── Idle: start button ── */}
        {camState === "idle" && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24,
          }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6b5e57", marginBottom: 8 }}>
                Escáner de QR
              </p>
              <p style={{ fontSize: 12, color: "#3a3330" }}>
                Se pedirá permiso de cámara
              </p>
            </div>
            <button
              onClick={startCamera}
              style={{
                padding: "14px 36px", borderRadius: 14, border: "none", cursor: "pointer",
                background: "#c9a96e", color: "#080808",
                fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase",
              }}
            >
              Iniciar cámara
            </button>
          </div>
        )}

        {/* ── Starting spinner ── */}
        {camState === "starting" && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase", color: "#c9a96e" }}
            >
              Iniciando…
            </motion.div>
          </div>
        )}

        {/* ── Camera error ── */}
        {camState === "cam-error" && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32,
          }}>
            <p style={{ color: "#e07070", fontSize: 13, textAlign: "center" }}>{camError}</p>
            <button
              onClick={startCamera}
              style={{
                padding: "12px 28px", borderRadius: 12, border: "1px solid #3a2020", cursor: "pointer",
                background: "transparent", color: "#e07070",
                fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
              }}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* ── Viewfinder corners (only when active) ── */}
        {camState === "active" && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 220, height: 220 }}>
              {/* TL */ }
              <div style={{ position: "absolute", top: 0, left: 0, width: 28, height: 28, borderTop: "2px solid #c9a96e", borderLeft: "2px solid #c9a96e" }} />
              {/* TR */}
              <div style={{ position: "absolute", top: 0, right: 0, width: 28, height: 28, borderTop: "2px solid #c9a96e", borderRight: "2px solid #c9a96e" }} />
              {/* BL */}
              <div style={{ position: "absolute", bottom: 0, left: 0, width: 28, height: 28, borderBottom: "2px solid #c9a96e", borderLeft: "2px solid #c9a96e" }} />
              {/* BR */}
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderBottom: "2px solid #c9a96e", borderRight: "2px solid #c9a96e" }} />

              {result.status === "processing" && (
                <motion.div
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ position: "absolute", inset: 0, border: "1px solid #6b9fc9", borderRadius: 2 }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Result panel ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={result.status}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" as const }}
          style={{
            flexShrink: 0,
            padding: "20px 24px 36px",
            background: cfg.bg,
            backdropFilter: "blur(14px)",
          }}
        >
          {result.status === "success" && (
            <div style={{ marginBottom: 6 }}>
              <p style={{ fontSize: 20, color: cfg.accent, fontFamily: "var(--font-playfair), Georgia, serif", marginBottom: 4 }}>
                {result.nombre}
              </p>
              <p style={{ fontSize: 13, color: "#6b7a70" }}>
                {result.pases === 1 ? "1 persona" : `${result.pases} personas`}
              </p>
            </div>
          )}

          {result.status === "already_in" && (
            <p style={{ fontSize: 20, color: cfg.accent, fontFamily: "var(--font-playfair), Georgia, serif", marginBottom: 6 }}>
              {result.nombre}
            </p>
          )}

          {result.status === "error" && (
            <p style={{ fontSize: 13, color: cfg.accent, marginBottom: 6 }}>
              {(result as { status: "error"; message: string }).message}
            </p>
          )}

          <p style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: cfg.accent, opacity: 0.65 }}>
            {cfg.label}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
