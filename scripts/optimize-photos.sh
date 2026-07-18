#!/bin/bash
# Optimiza fotos para la galería: redimensiona a máx. 1600px por lado y
# comprime a JPEG calidad 80. Acepta jpg/jpeg/png/heic/heif/webp (las fotos
# de iPhone en HEIC se convierten solas).
#
# Uso:
#   ./scripts/optimize-photos.sh <carpeta-con-originales>
#
# Las fotos se copian a public/photos numeradas a continuación de la última
# existente (si la última es 26.jpg, las nuevas serán 27.jpg, 28.jpg, ...).
# El orden lo da el nombre del archivo original (alfabético) — si quieres
# controlar la cronología, renombra los originales como 01-..., 02-..., etc.
set -euo pipefail

SRC_DIR="${1:-}"
DEST_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/photos"
QUALITY=80
MAX_PX=1600

if [[ -z "$SRC_DIR" || ! -d "$SRC_DIR" ]]; then
  echo "Uso: $0 <carpeta-con-fotos-originales>"
  exit 1
fi

# Siguiente número libre en public/photos (solo archivos tipo N.ext)
next=1
for f in "$DEST_DIR"/*; do
  [[ -f "$f" ]] || continue
  base="$(basename "$f")"
  num="${base%%.*}"
  [[ "$num" =~ ^[0-9]+$ ]] || continue
  (( num >= next )) && next=$(( num + 1 ))
done

count=0
while IFS= read -r src; do
  out="$DEST_DIR/$next.jpg"
  sips -s format jpeg -s formatOptions "$QUALITY" -Z "$MAX_PX" "$src" --out "$out" >/dev/null
  echo "✔ $(basename "$src") → $next.jpg ($(du -h "$out" | cut -f1 | tr -d ' '))"
  next=$(( next + 1 ))
  count=$(( count + 1 ))
done < <(find "$SRC_DIR" -maxdepth 1 -type f \( \
    -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \
    -o -iname "*.heic" -o -iname "*.heif" -o -iname "*.webp" \) | sort)

echo ""
echo "Listo: $count fotos optimizadas en public/photos (siguiente número: $next)"
echo "La galería las carga automáticamente — no hay que editar código."
