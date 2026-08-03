"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function UploadRecuerdos() {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    // Funcionalidad pendiente
    console.log("Archivos soltados:", e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Funcionalidad pendiente
    console.log("Archivos seleccionados:", e.target.files);
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
              Comparte tus fotos y videos del día de la fiesta. Todos los invitados podrán ver y disfrutar de los momentos especiales juntos.
            </p>

            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              style={{
                borderRadius: 16,
                border: `2px dashed ${dragActive ? "var(--accent)" : "var(--border)"}`,
                padding: "48px 32px",
                cursor: "pointer",
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
                  Formatos: JPG, PNG, MP4 (máx. 50MB por archivo)
                </p>
              </div>
            </div>

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
