import MeshBackground from "@/components/landing/MeshBackground";
import FloatingIcons from "@/components/landing/FloatingIcons";
import GalleryNav from "@/components/landing/GalleryNav";
import ScrollProgress from "@/components/landing/ScrollProgress";
import MusicPlayer from "@/components/landing/MusicPlayer";
import PhotoGallery from "@/components/landing/PhotoGallery";
import PhotoGrid from "@/components/landing/PhotoGrid";
import FamilyMessages from "@/components/landing/FamilyMessages";
import EventLocation from "@/components/landing/EventLocation";
import InvitePrompt from "@/components/landing/InvitePrompt";
import { familyItems, venue, songUrl } from "@/data/landingContent";
import { getEventDetails } from "@/lib/eventDetails";
import { getGroupedPhotos } from "@/lib/photos";

export default function Recuerdos() {
  const { celebrant, dateLabel, timeLabel, lat, lng, calendarUrl } = getEventDetails();
  const photoGroups = getGroupedPhotos();

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
      <ScrollProgress />
      <GalleryNav />
      <MusicPlayer songUrl={songUrl} />
      <PhotoGallery groups={photoGroups} />
      <PhotoGrid groups={photoGroups} />
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
