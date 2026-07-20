import fs from "node:fs";
import path from "node:path";
import { photoGroups } from "@/data/landingContent";

// Server-only: lee public/photos en build/render. Entran archivos con nombre
// numérico, incluida numeración decimal para intercalar (2.1.jpeg va entre
// 2.jpg y 3.jpg). Assets como inicio_1_hero.png quedan fuera. El número
// define el orden cronológico "de niña a señorita".
const NUMBERED_PHOTO = /^(\d+(?:\.\d+)?)\.(jpe?g|png|webp)$/i;

type NumberedPhoto = { src: string; num: number };

function readPhotos(): NumberedPhoto[] {
  const dir = path.join(process.cwd(), "public", "photos");
  let files: string[];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }
  return files
    .map((file) => ({ file, match: file.match(NUMBERED_PHOTO) }))
    .filter((x): x is { file: string; match: RegExpMatchArray } => x.match !== null)
    .map((x) => ({ src: `/photos/${x.file}`, num: parseFloat(x.match[1]) }))
    .sort((a, b) => a.num - b.num);
}

export function getGalleryPhotos(): string[] {
  return readPhotos().map((p) => p.src);
}

export type PhotoGroup = { title: string; photos: string[] };

/**
 * Agrupa las fotos según photoGroups (landingContent): cada grupo toma las
 * fotos cuyo número es ≤ su `hasta`; el último se queda con el resto.
 */
export function getGroupedPhotos(): PhotoGroup[] {
  const all = readPhotos();
  let cursor = 0;
  return photoGroups.map((g, i) => {
    const isLast = i === photoGroups.length - 1;
    const end = isLast
      ? all.length
      : all.findIndex((p, idx) => idx >= cursor && p.num > g.hasta);
    const sliceEnd = end === -1 ? all.length : end;
    const photos = all.slice(cursor, sliceEnd).map((p) => p.src);
    cursor = sliceEnd;
    return { title: g.title, photos };
  });
}
