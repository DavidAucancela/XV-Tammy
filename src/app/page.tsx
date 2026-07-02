import MeshBackground from "@/components/landing/MeshBackground";
import StickyNav from "@/components/landing/StickyNav";
import HeroSection from "@/components/landing/HeroSection";
import CountdownSection from "@/components/landing/CountdownSection";
import PhotoGallery from "@/components/landing/PhotoGallery";
import FamilyMessages from "@/components/landing/FamilyMessages";
import VideoSection from "@/components/landing/VideoSection";
import EventLocation from "@/components/landing/EventLocation";
import InvitePrompt from "@/components/landing/InvitePrompt";
import { photos, messages, videoUrl, venue } from "@/data/landingContent";

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
      <HeroSection celebrant={celebrant} />
      <CountdownSection dateLabel={dateLabel} timeLabel={timeLabel} />
      <PhotoGallery photos={photos} />
      <FamilyMessages messages={messages} />
      <VideoSection videoUrl={videoUrl} />
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
