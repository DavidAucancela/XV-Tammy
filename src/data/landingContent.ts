// ============================================================
// Personaliza el contenido de la landing aquí
// ============================================================

// Foto destacada del Hero — retrato reciente, se muestra en el medallón bajo el título.
export const heroPhoto = "/photos/inicio.jpeg";

// Las fotos de la galería se cargan automáticamente desde /public/photos:
// todo archivo con nombre numérico entra, ordenado por número (orden
// cronológico, de niña a señorita). Soporta decimales para intercalar:
// 2.1.jpeg queda entre 2.jpg y 3.jpg. Ver src/lib/photos.ts.
// Para agregar fotos usa: ./scripts/optimize-photos.sh <carpeta-originales>

// Etapas de "Mi crecimiento": cada grupo abarca las fotos hasta el número
// indicado en `hasta` (inclusive); el último grupo toma todas las restantes.
export const photoGroups = [
  { title: "Mis primeros pasos", hasta: 6 },
  { title: "Descubriendo el mundo", hasta: 14 },
  { title: "Forjando mi esencia", hasta: 22 },
  { title: "Creciendo con ilusión", hasta: Infinity },
];

// Canción de fondo de toda la página (archivo dentro de /public/audio).
// Se reproduce apenas se entra a la landing, desde un widget flotante siempre visible.
export const songUrl = "/audio/mi-princesa.mp3";

export const dressCode = "Código de vestimenta: Elegante";

// Mensajes y videos de la familia — se muestran juntos en un mismo grid.
// Cada item es de tipo "text" (mensaje escrito) o "video" (embed de YouTube/Vimeo).
// Para un video usa la URL de EMBED (ej: "https://www.youtube.com/embed/VIDEO_ID"),
// no el link normal del video.
export type FamilyItem =
  | { type: "text"; author: string; role: string; text: string }
  | { type: "video"; author: string; role: string; videoUrl: string };

export const familyItems: FamilyItem[] = [
  {
    type: "text",
    author: "Mamá y Papá",
    role: "Padres",
    text: "Mi niña, eres la alegría y el orgullo de nuestro hogar. Que este día tan especial sea el primero de muchos sueños cumplidos. Te amamos con todo el corazón.",
  },
  {
    type: "text",
    author: "Abuela María",
    role: "Abuela",
    text: "Verte crecer ha sido el regalo más hermoso de mi vida. Hoy celebramos a la jovencita increíble que eres y a la mujer extraordinaria en que te convertirás.",
  },
  {
    type: "text",
    author: "Tío Roberto",
    role: "Tío",
    text: "Siempre serás nuestra princesa. Que esta fiesta sea tan especial y radiante como tú eres para nuestra familia.",
  },
  {
    type: "video",
    author: "Tía Rosa",
    role: "Tía",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    type: "video",
    author: "Prima Ana",
    role: "Prima",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
  },
  {
    type: "video",
    author: "Padrino Luis",
    role: "Padrino",
    videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
  },
];

// Información del salón
export const venue = {
  name: "Servellón Urbina N58-143 y Víctor Hugo",
  address: "Quito, Ecuador",
};
