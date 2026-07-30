import Link from "next/link";
import { Eye, PlayCircle } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_KATHAS } from "@/lib/sampleData";

export default function LatestKathas() {
  return (
    <section className="bg-peacock/5 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Katha" title="Latest Katha" description="Discourses from revered speakers across Braj." />
          <Link href="/kathas" className="font-body text-sm text-peacock hover:underline">
            Browse all katha →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {SAMPLE_KATHAS.map((katha) => (
            <Link
              key={katha._id}
              href={`/kathas/${katha.slug}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative">
                <PlaceholderMedia seed={katha._id} type="katha" className="aspect-video w-full" iconClassName="h-12 w-12" />
                <div className="absolute inset-0 flex items-center justify-center bg-indigo/0 transition group-hover:bg-indigo/30">
                  <PlayCircle className="h-12 w-12 text-ivory opacity-0 transition group-hover:opacity-100" />
                </div>
              </div>
              <div className="p-5">
                <p className="line-clamp-2 font-display text-xl font-semibold text-indigo">{katha.title}</p>
                <p className="mt-2 font-body text-sm text-indigo/60">{katha.speaker.name}</p>
                <span className="mt-3 flex items-center gap-1 text-xs text-indigo/45">
                  <Eye className="h-3.5 w-3.5" /> {katha.views.toLocaleString("en-IN")} views
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
