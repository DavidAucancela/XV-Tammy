import MeshBackground from "@/components/landing/MeshBackground";
import FloatingIcons from "@/components/landing/FloatingIcons";
import HomeHero from "@/components/landing/HomeHero";
import { heroPhoto, venue } from "@/data/landingContent";
import { getEventDetails } from "@/lib/eventDetails";

export default function Home() {
  const { celebrant, dateLabel, timeLabel } = getEventDetails();

  return (
    <>
      <MeshBackground />
      <FloatingIcons />
      <HomeHero
        celebrant={celebrant}
        photo={heroPhoto}
        dateLabel={dateLabel}
        timeLabel={timeLabel}
        venueName={venue.name}
      />
    </>
  );
}
