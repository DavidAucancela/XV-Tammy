// ============================================================
// Personaliza el contenido de la landing aquí
// ============================================================

// Foto destacada del Hero — retrato reciente, se muestra en el medallón bajo el título.
export const heroPhoto = "/photos/25.jpg";

// Rutas de fotos dentro de /public, en orden cronológico (de niña a señorita).
// El slideshow las recorre en este orden con música de fondo.
export const photos: string[] = [
  "/photos/1.jpg",
  "/photos/2.jpeg",
  "/photos/3.jpg",
  "/photos/4.jpg",
  "/photos/5.jpg",
  "/photos/6.jpg",
  "/photos/7.jpg",
  "/photos/9.jpg",
  "/photos/10.jpg",
  "/photos/11.jpg",
  "/photos/12.jpg",
  "/photos/13.jpg",
  "/photos/14.jpg",
  "/photos/15.jpg",
  "/photos/16.jpg",
  "/photos/17.jpg",
  "/photos/18.jpg",
  "/photos/19.jpg",
  "/photos/20.jpg",
  "/photos/21.jpg",
  "/photos/22.jpg",
  "/photos/23.jpg",
  "/photos/24.jpg",
  "/photos/25.jpg",
  "/photos/26.JPG",
];

// Canción de fondo de toda la página (archivo dentro de /public/audio).
// Se reproduce apenas se entra a la landing, desde un widget flotante siempre visible.
export const songUrl = "/audio/mi-princesa.mp3";

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
  // Ejemplo de video — copia este bloque y cambia autor/rol/URL por cada video real:
  // {
  //   type: "video",
  //   author: "Tía Rosa",
  //   role: "Tía",
  //   videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
  // },
];

// Información del salón
export const venue = {
  name: "OE6C",
  address: "Quito, Ecuador",
};
