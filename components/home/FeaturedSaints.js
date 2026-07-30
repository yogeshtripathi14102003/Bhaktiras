import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_SAINTS } from "@/lib/sampleData";

export default function FeaturedSaints() {
  return (
    <section className="bg-ivory py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Saints" title="Featured Saints of Braj" description="The lives and teachings that shaped Vaishnav devotion." align="center" />

        <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {SAMPLE_SAINTS.map((saint) => (
            <Link key={saint._id} href={`/saints/${saint.slug}`} className="group text-center">
              <PlaceholderMedia
                seed={saint._id}
                type="saint"
                className="mx-auto aspect-square w-full max-w-[180px] rounded-full ring-4 ring-marigold/20 transition group-hover:ring-marigold/50"
                iconClassName="h-9 w-9"
              />
              <p className="mt-4 font-display text-lg font-semibold text-indigo">{saint.name}</p>
              <p className="font-body text-xs text-indigo/55">{saint.era}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
