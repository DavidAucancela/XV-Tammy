import MeshBackground from "@/components/landing/MeshBackground";
import StickyNav from "@/components/landing/StickyNav";
import MusicPlayer from "@/components/landing/MusicPlayer";
import HeroSection from "@/components/landing/HeroSection";
import CountdownSection from "@/components/landing/CountdownSection";
import PhotoGallery from "@/components/landing/PhotoGallery";
import FamilyMessages from "@/components/landing/FamilyMessages";
import EventLocation from "@/components/landing/EventLocation";
import InvitePrompt from "@/components/landing/InvitePrompt";
import { photos, familyItems, venue, songUrl } from "@/data/landingContent";

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
      <HeroSection celebrant={celebrant} />
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
      <InvitePrompt celebrant={celebrant} />
    </main>
  );
}
