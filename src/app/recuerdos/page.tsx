import { Suspense } from "react";
import MeshBackground from "@/components/landing/MeshBackground";
import FloatingIcons from "@/components/landing/FloatingIcons";
import GalleryNav from "@/components/landing/GalleryNav";
import ScrollProgress from "@/components/landing/ScrollProgress";
import MusicPlayer from "@/components/landing/MusicPlayer";
import EventLocation from "@/components/landing/EventLocation";
import InvitePrompt from "@/components/landing/InvitePrompt";
import UploadRecuerdos from "@/components/landing/UploadRecuerdos";
import RecuerdosContent from "@/components/landing/RecuerdosContent";
import AccordionSection from "@/components/landing/AccordionSection";
import { RecuerdosAccordionProvider } from "@/components/landing/RecuerdosAccordionProvider";
import { familyItems, venue, songUrl } from "@/data/landingContent";
import { getEventDetails } from "@/lib/eventDetails";
import { getGroupedPhotos } from "@/lib/photos";

export default async function Recuerdos() {
  const { celebrant, dateLabel, timeLabel, lat, lng, calendarUrl, eventDateISO } = getEventDetails();
  const photoGroups = getGroupedPhotos();

  return (
    <main
      style={{
        background: "transparent",
        color: "var(--text)",
        fontFamily: "var(--font-lato), system-ui, sans-serif",
        paddingTop: "80px",
      }}
    >
      <MeshBackground />
      <FloatingIcons />
      <ScrollProgress />
      <RecuerdosAccordionProvider>
        <GalleryNav />
        <MusicPlayer songUrl={songUrl} />
        <Suspense fallback={<div />}>
          <RecuerdosContent
            photoGroups={photoGroups}
            familyItems={familyItems}
            eventDateISO={eventDateISO}
          />
        </Suspense>
        <AccordionSection id="evento" index={4} title="Fecha, hora y lugar">
          <EventLocation
            dateLabel={dateLabel}
            timeLabel={timeLabel}
            venue={venue}
            lat={lat}
            lng={lng}
          />
        </AccordionSection>
        <AccordionSection id="recuerdos-compartidos" index={5} title="Carga tus recuerdos con los demás">
          <UploadRecuerdos />
        </AccordionSection>
        <AccordionSection id="invitacion" index={6} title="¿Tienes tu invitación?">
          <InvitePrompt celebrant={celebrant} calendarUrl={calendarUrl} />
        </AccordionSection>
      </RecuerdosAccordionProvider>
    </main>
  );
}
