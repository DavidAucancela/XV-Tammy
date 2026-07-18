import fs from "node:fs";
import path from "node:path";

// Server-only: lee public/photos en build/render. Solo entran archivos con
// nombre numérico (1.jpg, 2.webp, ...) — assets como inicio_1_hero.png quedan
// fuera. El número define el orden cronológico "de niña a señorita".
const NUMBERED_PHOTO = /^(\d+)\.(jpe?g|png|webp)$/i;

export function getGalleryPhotos(): string[] {
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
    .sort((a, b) => Number(a.match[1]) - Number(b.match[1]))
    .map((x) => `/photos/${x.file}`);
}
