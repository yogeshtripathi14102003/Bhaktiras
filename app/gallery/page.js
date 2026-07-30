import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_GALLERY } from "@/lib/sampleData";

export const metadata = {
  title: "Gallery",
  description: "Photos and videos from temple seva, festivals and events across Braj.",
};

export default function GalleryPage() {
  return (
    <div className="bg-ivory">
      <div className="border-b border-indigo/10 bg-indigo py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="section-eyebrow text-marigold">Gallery</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ivory sm:text-5xl">Moments from the Temples</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[...SAMPLE_GALLERY, ...SAMPLE_GALLERY].map((item, i) => (
            <div key={`${item._id}-${i}`} className="group relative overflow-hidden rounded-xl">
              <PlaceholderMedia seed={`${item._id}-${i}`} type="gallery" className="aspect-square w-full transition group-hover:scale-105" />
              <p className="absolute bottom-0 w-full bg-gradient-to-t from-indigo/80 to-transparent p-2 font-body text-[11px] text-ivory opacity-0 transition group-hover:opacity-100">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
