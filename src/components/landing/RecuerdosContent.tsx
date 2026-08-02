"use client";

import { useSearchParams } from "next/navigation";
import PhotoGallery from "./PhotoGallery";
import PhotoGrid from "./PhotoGrid";
import FamilyMessages from "./FamilyMessages";
import GatekeeperSection from "./GatekeeperSection";
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
        <PhotoGallery groups={photoGroups} />
        <PhotoGrid groups={photoGroups} />
      </GatekeeperSection>
      <GatekeeperSection eventDate={eventDateISO} adminPreview={adminPreview} sections="familia">
        <FamilyMessages items={familyItems} />
      </GatekeeperSection>
    </>
  );
}
