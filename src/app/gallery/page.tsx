import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PaxGallery } from "@/components/PaxGallery";
import { galleryPhotos } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Password-protected F3 Lincoln photo roll from @F3Lincoln on X.",
  robots: { index: false, follow: false },
};

export default function GalleryPage() {
  return (
    <PageShell
      eyebrow="From the gloom"
      title="Photo Gallery"
      intro="Real stills from @F3Lincoln — beatdown packs, not AI posters. Password required."
    >
      <PaxGallery photos={galleryPhotos} />
    </PageShell>
  );
}
