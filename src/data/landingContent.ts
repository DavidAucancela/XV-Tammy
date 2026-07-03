// ============================================================
// Personaliza el contenido de la landing aquí
// ============================================================

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

// Canción de fondo del slideshow (archivo dentro de /public/audio).
// Deja "" para ocultar el botón de música. Ej: "/audio/cancion.mp3"
export const songUrl = "";

// Mensajes de la familia — edita o agrega los que quieras
export const messages = [
  {
    author: "Mamá y Papá",
    role: "Padres",
    text: "Mi niña, eres la alegría y el orgullo de nuestro hogar. Que este día tan especial sea el primero de muchos sueños cumplidos. Te amamos con todo el corazón.",
  },
  {
    author: "Abuela María",
    role: "Abuela",
    text: "Verte crecer ha sido el regalo más hermoso de mi vida. Hoy celebramos a la jovencita increíble que eres y a la mujer extraordinaria en que te convertirás.",
  },
  {
    author: "Tío Roberto",
    role: "Tío",
    text: "Siempre serás nuestra princesa. Que esta fiesta sea tan especial y radiante como tú eres para nuestra familia.",
  },
];

// URL de embed de YouTube (ej: "https://www.youtube.com/embed/VIDEO_ID")
// Deja vacío para mostrar placeholder
export const videoUrl = "";

// Información del salón
export const venue = {
  name: "Salón de Eventos",
  address: "Dirección del salón aquí",
};
