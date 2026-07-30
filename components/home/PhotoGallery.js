import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_GALLERY } from "@/lib/sampleData";

export default function PhotoGallery() {
  return (
    <section className="bg-ivory py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Gallery" title="Moments from the Temples" />
          <Link href="/gallery" className="font-body text-sm text-peacock hover:underline">
            View full gallery →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SAMPLE_GALLERY.map((item) => (
            <PlaceholderMedia
              key={item._id}
              seed={item._id}
              type="gallery"
              className="aspect-square w-full rounded-xl"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
