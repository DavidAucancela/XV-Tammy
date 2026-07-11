import MeshBackground from "@/components/landing/MeshBackground";
import FloatingIcons from "@/components/landing/FloatingIcons";
import GalleryNav from "@/components/landing/GalleryNav";
import MusicPlayer from "@/components/landing/MusicPlayer";
import PhotoGallery from "@/components/landing/PhotoGallery";
import FamilyMessages from "@/components/landing/FamilyMessages";
import EventLocation from "@/components/landing/EventLocation";
import InvitePrompt from "@/components/landing/InvitePrompt";
import { photos, familyItems, venue, songUrl } from "@/data/landingContent";
import { getEventDetails } from "@/lib/eventDetails";

export default function Recuerdos() {
  const { celebrant, dateLabel, timeLabel, lat, lng, calendarUrl } = getEventDetails();

  return (
    <main
      style={{
        background: "transparent",
        color: "var(--text)",
        fontFamily: "var(--font-lato), system-ui, sans-serif",
      }}
    >
      <MeshBackground />
      <FloatingIcons />
      <GalleryNav />
      <MusicPlayer songUrl={songUrl} />
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
