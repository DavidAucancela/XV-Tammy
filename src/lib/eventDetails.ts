import { venue } from "@/data/landingContent";

export function getEventDetails() {
  const celebrant = process.env.NEXT_PUBLIC_CELEBRANT_NAME ?? "XV Años";
  const eventDate = new Date(process.env.NEXT_PUBLIC_EVENT_DATE!);

  const dateLabel = new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(eventDate);

  const timeLabel = new Intl.DateTimeFormat("es", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(eventDate);

  const lat = process.env.NEXT_PUBLIC_VENUE_LAT ?? "";
  const lng = process.env.NEXT_PUBLIC_VENUE_LNG ?? "";

  // "Agregar al calendario" — real action for any visitor, not just invitees
  // with a personal link. Assumes a 3-hour celebration when no end time is set.
  const toGCalDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const eventEnd = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000);
  const calendarUrl =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(`XV Años de ${celebrant}`)}` +
    `&dates=${toGCalDate(eventDate)}/${toGCalDate(eventEnd)}` +
    `&details=${encodeURIComponent(`Te esperamos para celebrar los XV años de ${celebrant}.`)}` +
    `&location=${encodeURIComponent(`${venue.name}, ${venue.address}`)}`;

  return { celebrant, dateLabel, timeLabel, lat, lng, calendarUrl };
}
