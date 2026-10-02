"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAccordion } from "./RecuerdosAccordionProvider";

type Item = { id: string; tipo: "foto" | "video"; url: string; autor: string };
type Progress = { name: string; pct: number; error?: string };

export const SESSION_EVENT = "xv-guest-session";
const UPLOAD_ID = "recuerdos-compartidos";
const MAX_BYTES = 50 * 1024 * 1024;

async function readError(res: Response, fallback: string) {
  try {
    return (await res.json()).error ?? fallback;
  } catch {
    return fallback;
  }
}

function putWithProgress(url: string, file: File, onPct: (n: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => e.lengthComputable && onPct(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error("Falló la subida")));
    xhr.onerror = () => reject(new Error("Falló la subida"));
    xhr.send(file);
  });
}

export default function UploadRecuerdos() {
  const [dragActive, setDragActive] = useState(false);
  const [session, setSession] = useState<"loading" | "guest" | "anon">("loading");
  const [nombre, setNombre] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const { openPanel } = useAccordion();
  const enabled = session === "guest";

  const load = useCallback(async () => {
    const res = await fetch("/api/recuerdos");
    if (res.status === 401) return setSession("anon");
    if (res.ok) setItems((await res.json()).items);
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/recuerdos/sesion");
      if (!res.ok) return setSession("anon");
      setNombre((await res.json()).nombre);
      setSession("guest");
      load();
    } catch {
      setSession("anon");
    }
  }, [load]);

  useEffect(() => {
    checkSession();
    const onSession = () => checkSession();
    window.addEventListener(SESSION_EVENT, onSession);
    return () => window.removeEventListener(SESSION_EVENT, onSession);
  }, [checkSession]);

  // Llegada por link (/api/recuerdos/entrar redirige con #recuerdos-compartidos): abrir y mostrar la sección.
  useEffect(() => {
    if (window.location.hash !== `#${UPLOAD_ID}`) return;
    openPanel(UPLOAD_ID);
    const t = setTimeout(() => document.getElementById(UPLOAD_ID)?.scrollIntoView({ behavior: "smooth", block: "start" }), 400);
    return () => clearTimeout(t);
  }, [openPanel]);

  const goValidate = () => {
    openPanel("invitacion");
    setTimeout(() => document.getElementById("invitacion")?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
  };

  const uploadFile = async (file: File) => {
    const id = `${file.name}-${file.size}-${Math.random()}`;
    const set = (p: Partial<Progress>) => setProgress((prev) => ({ ...prev, [id]: { ...{ name: file.name, pct: 0 }, ...prev[id], ...p } }));
    set({});
    try {
      if (file.size > MAX_BYTES) throw new Error("Supera 50MB");
      const pre = await fetch("/api/recuerdos/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, size: file.size }),
      });
      if (pre.status === 401) {
        setSession("anon");
        throw new Error("Tu sesión expiró, valida tu celular de nuevo");
      }
      if (!pre.ok) throw new Error(await readError(pre, "No permitido"));
      const data = await pre.json();
      await putWithProgress(data.uploadUrl, file, (pct) => set({ pct }));
      const reg = await fetch("/api/recuerdos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: data.key, contentType: file.type }),
      });
      if (!reg.ok) throw new Error(await readError(reg, "No se pudo registrar"));
      set({ pct: 100 });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Error" });
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || !enabled) return;
    // Máx. 3 subidas simultáneas para no saturar la red del celular.
    const queue = Array.from(files);
    await Promise.all(
      Array.from({ length: Math.min(3, queue.length) }, async () => {
        for (let f = queue.shift(); f; f = queue.shift()) await uploadFile(f);
      })
    );
    load();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: 24,
            padding: 1,
            background:
              "linear-gradient(120deg, rgba(var(--gold-rgb),0.5), rgba(var(--accent-rgb),0.35), rgba(var(--gold-rgb),0.25))",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div
            style={{
              borderRadius: 23,
              background:
                "linear-gradient(160deg, var(--surface-elevated) 0%, var(--surface) 100%)",
              padding: "48px 32px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                lineHeight: 1.85,
                fontWeight: 300,
                maxWidth: 500,
                margin: "0 0 32px",
              }}
            >
              {enabled && nombre ? `Hola, ${nombre}. ` : ""}Comparte tus fotos y videos del día de la fiesta. Todos los invitados podrán ver y disfrutar de los momentos especiales juntos.
            </p>

            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => enabled && inputRef.current?.click()}
              style={{
                borderRadius: 16,
                border: `2px dashed ${dragActive ? "var(--accent)" : "var(--border)"}`,
                padding: "48px 32px",
                cursor: enabled ? "pointer" : "not-allowed",
                opacity: enabled ? 1 : 0.5,
                transition: "all 0.25s ease",
                background: dragActive
                  ? "rgba(var(--accent-rgb), 0.08)"
                  : "transparent",
              }}
            >
              <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleChange}
                style={{ display: "none" }}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ margin: "0 auto", opacity: 0.7 }}
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>

                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      fontSize: 18,
                      fontWeight: 600,
                      color: "var(--text)",
                      margin: "0 0 4px",
                    }}
                  >
                    {dragActive ? "Suelta aquí" : "Arrastra fotos o videos"}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      margin: 0,
                    }}
                  >
                    o haz clic para seleccionar archivos
                  </p>
                </div>

                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    margin: "12px 0 0",
                    fontStyle: "italic",
                  }}
                >
                  Formatos: JPG, PNG, WEBP, HEIC, MP4, MOV (máx. 50MB por archivo)
                </p>
              </div>
            </div>

            {session === "anon" && (
              <div style={{ marginTop: 20 }}>
                <p style={{ fontSize: 13, color: "var(--accent-ink)", margin: "0 0 12px" }}>
                  Solo los invitados pueden subir recuerdos. Abre el enlace de tu invitación o valida tu número de celular.
                </p>
                <button
                  type="button"
                  onClick={goValidate}
                  style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-ink)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 8 }}
                >
                  Validar mi celular
                </button>
              </div>
            )}

            {Object.values(progress).length > 0 && (
              <div style={{ marginTop: 24, display: "grid", gap: 8, textAlign: "left" }}>
                {Object.entries(progress).map(([id, p]) => (
                  <div key={id} style={{ fontSize: 12, color: p.error ? "var(--accent-ink)" : "var(--text-muted)" }}>
                    {p.name} — {p.error ?? (p.pct === 100 ? "listo ✓" : `${p.pct}%`)}
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: 8,
                  marginTop: 32,
                }}
              >
                {items.map((it) =>
                  it.tipo === "video" ? (
                    <video key={it.id} src={it.url} controls preload="metadata" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 12 }} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={it.id} src={it.url} alt={`Recuerdo de ${it.autor}`} loading="lazy" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 12 }} />
                  )
                )}
              </div>
            )}

            {/* Info Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 24,
                marginTop: 40,
              }}
            >
              {[
                { icon: "📸", label: "Fotos", desc: "Captura los momentos" },
                { icon: "🎥", label: "Videos", desc: "Graba la diversión" },
                { icon: "👥", label: "Compartir", desc: "Con todos los invitados" },
              ].map(({ icon, label, desc }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 32,
                      marginBottom: 8,
                    }}
                  >
                    {icon}
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text)",
                      margin: "0 0 4px",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      margin: 0,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
