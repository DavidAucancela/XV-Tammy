"use client";

import { useSearchParams } from "next/navigation";
import PhotoGallery from "./PhotoGallery";
import PhotoGrid from "./PhotoGrid";
import FamilyMessages from "./FamilyMessages";
import GatekeeperSection from "./GatekeeperSection";
import AccordionSection from "./AccordionSection";
import type { PhotoGroup } from "@/lib/photos";
import type { FamilyItem } from "@/data/landingContent";

export default function RecuerdosContent({
  photoGroups,
  familyItems,
  eventDateISO,
}: {
  photoGroups: PhotoGroup[];
  familyItems: FamilyItem[];
  eventDateISO: string;
}) {
  const searchParams = useSearchParams();
  const adminPreview = searchParams.get("admin") === "preview";

  return (
    <>
      <GatekeeperSection eventDate={eventDateISO} adminPreview={adminPreview} sections="gallery">
        <AccordionSection id="galeria" index={1} title="Mi crecimiento">
          <PhotoGallery groups={photoGroups} />
        </AccordionSection>
        <AccordionSection id="galeria-grid" index={2} title="Álbum de recuerdos">
          <PhotoGrid groups={photoGroups} />
        </AccordionSection>
      </GatekeeperSection>
      <GatekeeperSection eventDate={eventDateISO} adminPreview={adminPreview} sections="familia">
        <AccordionSection id="familia" index={3} title="Mensajes de tu familia">
          <FamilyMessages items={familyItems} />
        </AccordionSection>
      </GatekeeperSection>
    </>
  );
}
