import MeshBackground from "@/components/landing/MeshBackground";
import StickyNav from "@/components/landing/StickyNav";
import MusicPlayer from "@/components/landing/MusicPlayer";
import HeroSection from "@/components/landing/HeroSection";
import CountdownSection from "@/components/landing/CountdownSection";
import PhotoGallery from "@/components/landing/PhotoGallery";
import FamilyMessages from "@/components/landing/FamilyMessages";
import EventLocation from "@/components/landing/EventLocation";
import InvitePrompt from "@/components/landing/InvitePrompt";
import { photos, familyItems, venue, songUrl, heroPhoto } from "@/data/landingContent";

export default function Home() {
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

  return (
    <main
      style={{
        background: "transparent",
        color: "#fdf0f8",
        fontFamily: "var(--font-lato), system-ui, sans-serif",
      }}
    >
      <MeshBackground />
      <StickyNav />
      <MusicPlayer songUrl={songUrl} />
      <HeroSection celebrant={celebrant} photo={heroPhoto} />
      <CountdownSection dateLabel={dateLabel} timeLabel={timeLabel} />
      <PhotoGallery photos={photos} />
      <FamilyMessages items={familyItems} />
      <EventLocation
        dateLabel={dateLabel}
        timeLabel={timeLabel}
        venue={venue}
        lat={lat}
        lng={lng}
      />
      <InvitePrompt celebrant={celebrant} calendarUrl={calendarUrl} />
    </main>
  );
}
