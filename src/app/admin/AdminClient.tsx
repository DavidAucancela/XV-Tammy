"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Guest } from "./page";

// ── Helpers ────────────────────────────────────────────────────────────────
function fmtTime(iso: string) {
  return new Intl.DateTimeFormat("es", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(new Date(iso));
}

function computeStats(guests: Guest[]) {
  return {
    total:       guests.length,
    ingresados:  guests.filter(g => !!g.checked_in_at).length,
    confirmados: guests.filter(g => g.rsvp_estado === "confirmado" && !g.checked_in_at).length,
    pendientes:  guests.filter(g => !g.rsvp_estado || g.rsvp_estado === "pendiente").length,
  };
}

function sortGuests(guests: Guest[]): Guest[] {
  return [...guests].sort((a, b) => {
    // checked-in first, most recent on top
    if (a.checked_in_at && b.checked_in_at)
      return new Date(b.checked_in_at).getTime() - new Date(a.checked_in_at).getTime();
    if (a.checked_in_at) return -1;
    if (b.checked_in_at) return 1;
    // then confirmed
    const ac = a.rsvp_estado === "confirmado" ? 0 : 1;
    const bc = b.rsvp_estado === "confirmado" ? 0 : 1;
    return ac - bc;
  });
}

// ── Sub-components ─────────────────────────────────────────────────────────
function StatCard({ value, label, accent }: { value: number; label: string; accent: string }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
      padding: "16px 8px", background: "#160d1e", borderRadius: 14,
      border: "1px solid #251535",
    }}>
      <motion.span
        key={value}
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ fontSize: 28, color: accent, fontFamily: "var(--font-playfair), Georgia, serif", lineHeight: 1 }}
      >
        {value}
      </motion.span>
      <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7a5870", marginTop: 4 }}>
        {label}
      </span>
    </div>
  );
}

function GuestRow({ guest, isNew }: { guest: Guest; isNew: boolean }) {
  const isIn = !!guest.checked_in_at;
  const isConf = guest.rsvp_estado === "confirmado";
  const dotColor = isIn ? "#4caf7d" : isConf ? "#e8699a" : "#3a1e48";
  const nameColor = isIn ? "#fdf0f8" : isConf ? "#e8c8d8" : "#7a5870";
  const pases = guest.pases_confirmados ?? guest.pases;

  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, x: -16 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "13px 20px", borderBottom: "1px solid #1a1028",
      }}
    >
      {/* status dot */}
      <div style={{
        width: 8, height: 8, borderRadius: "50%",
        background: dotColor, flexShrink: 0,
        boxShadow: isIn ? `0 0 6px ${dotColor}` : undefined,
      }} />

      {/* name + passes */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, color: nameColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {guest.nombre}
        </p>
        <p style={{ fontSize: 10, color: "#4a2a3e", marginTop: 1 }}>
          {pases} {pases === 1 ? "pase" : "pases"}
        </p>
      </div>

      {/* status label */}
      <span style={{ fontSize: 11, color: dotColor, flexShrink: 0 }}>
        {isIn ? fmtTime(guest.checked_in_at!) : isConf ? "confirmado" : "pendiente"}
      </span>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AdminClient({ initialGuests }: { initialGuests: Guest[] }) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [isLive, setIsLive] = useState(false);
  const flashTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }, [router]);

  const stats = useMemo(() => computeStats(guests), [guests]);
  const sorted = useMemo(() => sortGuests(guests), [guests]);
  const progress = stats.total > 0 ? (stats.ingresados / stats.total) * 100 : 0;

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("admin-guests-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "guests" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const updated = payload.new as Guest;
            setGuests(prev => prev.map(g => g.id === updated.id ? updated : g));
            // flash highlight if just checked in
            if (updated.checked_in_at) {
              setNewIds(prev => new Set(prev).add(updated.id));
              const existing = flashTimers.current.get(updated.id);
              if (existing) clearTimeout(existing);
              flashTimers.current.set(updated.id, setTimeout(() => {
                setNewIds(prev => { const s = new Set(prev); s.delete(updated.id); return s; });
                flashTimers.current.delete(updated.id);
              }, 2000));
            }
          } else if (payload.eventType === "INSERT") {
            const inserted = payload.new as Guest;
            setGuests(prev => [...prev, inserted]);
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as { id: string };
            setGuests(prev => prev.filter(g => g.id !== deleted.id));
          }
        }
      )
      .subscribe(status => setIsLive(status === "SUBSCRIBED"));

    return () => {
      supabase.removeChannel(channel);
      flashTimers.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#0d0610",
      color: "#fdf0f8", fontFamily: "var(--font-lato), system-ui",
      display: "flex", flexDirection: "column",
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: "18px 20px 14px",
        borderBottom: "1px solid #1a1028",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "#e8699a" }}>
          ✦ Panel de acceso
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <motion.div
              animate={isLive ? { opacity: [1, 0.3, 1] } : { opacity: 0.3 }}
              transition={isLive ? { duration: 2, repeat: Infinity } : {}}
              style={{ width: 6, height: 6, borderRadius: "50%", background: isLive ? "#4caf7d" : "#3a1e48" }}
            />
            <span style={{ fontSize: 10, color: isLive ? "#4caf7d" : "#3a1e48", letterSpacing: "0.15em" }}>
              {isLive ? "en vivo" : "conectando…"}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
              color: "#4a2a3e", background: "none", border: "none", cursor: "pointer",
            }}
          >
            salir
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* ── Stat cards ── */}
        <div style={{ display: "flex", gap: 8 }}>
          <StatCard value={stats.ingresados}  label="ingresados"  accent="#4caf7d" />
          <StatCard value={stats.confirmados} label="confirmados" accent="#e8699a" />
          <StatCard value={stats.pendientes}  label="pendientes"  accent="#7a5870" />
          <StatCard value={stats.total}       label="total"       accent="#fdf0f8" />
        </div>

        {/* ── Progress bar ── */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: "#7a5870", letterSpacing: "0.15em" }}>
              INGRESO
            </span>
            <span style={{ fontSize: 10, color: "#4caf7d" }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{ height: 4, background: "#1e1228", borderRadius: 99, overflow: "hidden" }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6 }}
              style={{ height: "100%", background: "#4caf7d", borderRadius: 99 }}
            />
          </div>
        </div>
      </div>

      {/* ── Guest list ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* legend */}
        <div style={{
          display: "flex", gap: 16, padding: "8px 20px 10px",
          borderBottom: "1px solid #1a1028",
        }}>
          {[["#4caf7d", "ingresado"], ["#e8699a", "confirmado"], ["#3a1e48", "pendiente"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
              <span style={{ fontSize: 9, color: "#7a5870", letterSpacing: "0.15em", textTransform: "uppercase" }}>{l}</span>
            </div>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {sorted.map(guest => (
            <GuestRow key={guest.id} guest={guest} isNew={newIds.has(guest.id)} />
          ))}
        </AnimatePresence>

        {guests.length === 0 && (
          <p style={{ textAlign: "center", color: "#4a2a3e", fontSize: 13, padding: 40 }}>
            Sin invitados aún
          </p>
        )}
      </div>
    </div>
  );
}
