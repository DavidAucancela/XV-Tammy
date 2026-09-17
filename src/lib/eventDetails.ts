import { venue } from "@/data/landingContent";

export function getEventDetails() {
  const celebrant = process.env.NEXT_PUBLIC_CELEBRANT_NAME ?? "XV Años";
  const rawEventDate = new Date(process.env.NEXT_PUBLIC_EVENT_DATE ?? "");
  const eventDate = Number.isNaN(rawEventDate.getTime()) ? new Date() : rawEventDate;

  // La fecha cambió y todavía no está confirmada oficialmente — mientras
  // NEXT_PUBLIC_EVENT_DATE_CONFIRMED no sea "true", no mostramos fecha/hora/
  // cuenta regresiva/calendario específicos en ningún lado del sitio.
  const dateConfirmed = process.env.NEXT_PUBLIC_EVENT_DATE_CONFIRMED === "true";

  const dateLabel = dateConfirmed
    ? new Intl.DateTimeFormat("es", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "America/Guayaquil",
      }).format(eventDate)
    : "Próximamente";

  const timeLabel = dateConfirmed
    ? new Intl.DateTimeFormat("es", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/Guayaquil",
      }).format(eventDate)
    : "Por confirmar";

  const lat = process.env.NEXT_PUBLIC_VENUE_LAT ?? "";
  const lng = process.env.NEXT_PUBLIC_VENUE_LNG ?? "";

  // "Agregar al calendario" — real action for any visitor, not just invitees
  // with a personal link. Assumes a 3-hour celebration when no end time is set.
  // Vacío mientras la fecha no esté confirmada, para no agendar una fecha equivocada.
  const toGCalDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const eventEnd = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000);
  const calendarUrl = dateConfirmed
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(`XV Años de ${celebrant}`)}` +
      `&dates=${toGCalDate(eventDate)}/${toGCalDate(eventEnd)}` +
      `&details=${encodeURIComponent(`Te esperamos para celebrar los XV años de ${celebrant}.`)}` +
      `&location=${encodeURIComponent(`${venue.name}, ${venue.address}`)}`
    : "";

  return {
    celebrant,
    dateConfirmed,
    dateLabel,
    timeLabel,
    lat,
    lng,
    calendarUrl,
    eventDateISO: eventDate.toISOString(),
  };
}
