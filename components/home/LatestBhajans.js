import Link from "next/link";
import { PlayCircle, Clock } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_BHAJANS } from "@/lib/sampleData";

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function LatestBhajans() {
  return (
    <section className="bg-ivory py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Bhajan" title="Latest Bhajans" description="New devotional music, added every week." />
          <Link href="/bhajans" className="font-body text-sm text-peacock hover:underline">
            Browse all bhajans →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_BHAJANS.map((bhajan) => (
            <Link
              key={bhajan._id}
              href={`/bhajans/${bhajan.slug}`}
              className="group overflow-hidden rounded-2xl border border-indigo/10 bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative">
                <PlaceholderMedia seed={bhajan._id} type="bhajan" className="aspect-square w-full" />
                <div className="absolute inset-0 flex items-center justify-center bg-indigo/0 transition group-hover:bg-indigo/30">
                  <PlayCircle className="h-10 w-10 text-ivory opacity-0 transition group-hover:opacity-100" />
                </div>
              </div>
              <div className="p-4">
                <p className="line-clamp-2 font-display text-lg font-semibold text-indigo">{bhajan.title}</p>
                <p className="mt-1 font-body text-xs text-indigo/60">{bhajan.singer}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-full bg-peacock/10 px-2.5 py-1 text-[11px] font-medium text-peacock">
                    {bhajan.category?.name}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-indigo/50">
                    <Clock className="h-3 w-3" /> {formatDuration(bhajan.duration)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
