import MeshBackground from "@/components/landing/MeshBackground";
import GardenScene from "@/components/landing/GardenScene";
import FallingPetals from "@/components/landing/FallingPetals";
import CornerFlorals from "@/components/landing/CornerFlorals";
import Sparkles from "@/components/landing/Sparkles";
import SparkleTrail from "@/components/landing/SparkleTrail";
import Butterflies from "@/components/landing/Butterflies";
import HomeHero from "@/components/landing/HomeHero";
import InvitationOpener from "@/components/landing/InvitationOpener";
import { heroPhoto } from "@/data/landingContent";
import { getEventDetails } from "@/lib/eventDetails";

export default function Home() {
  const { celebrant, dateLabel, timeLabel, eventDateISO } = getEventDetails();

  return (
    <>
      <MeshBackground />
      <GardenScene />
      <FallingPetals />
      <Sparkles />
      <SparkleTrail />
      <Butterflies />
      <CornerFlorals />
      <InvitationOpener celebrant={celebrant}>
        <HomeHero
          celebrant={celebrant}
          photo={heroPhoto}
          dateLabel={dateLabel}
          timeLabel={timeLabel}
          eventDateISO={eventDateISO}
        />
      </InvitationOpener>
    </>
  );
}
