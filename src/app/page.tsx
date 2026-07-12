import MeshBackground from "@/components/landing/MeshBackground";
import FloatingIcons from "@/components/landing/FloatingIcons";
import FallingPetals from "@/components/landing/FallingPetals";
import CornerFlorals from "@/components/landing/CornerFlorals";
import Sparkles from "@/components/landing/Sparkles";
import SparkleTrail from "@/components/landing/SparkleTrail";
import Butterflies from "@/components/landing/Butterflies";
import HomeHero from "@/components/landing/HomeHero";
import { heroPhoto, venue } from "@/data/landingContent";
import { getEventDetails } from "@/lib/eventDetails";

export default function Home() {
  const { celebrant, dateLabel, timeLabel, eventDateISO } = getEventDetails();

  return (
    <>
      <MeshBackground />
      <FloatingIcons />
      <FallingPetals />
      <Sparkles />
      <SparkleTrail />
      <Butterflies />
      <CornerFlorals />
      <HomeHero
        celebrant={celebrant}
        photo={heroPhoto}
        dateLabel={dateLabel}
        timeLabel={timeLabel}
        venueName={venue.name}
        eventDateISO={eventDateISO}
      />
    </>
  );
}
