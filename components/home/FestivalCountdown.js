import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";
import { SAMPLE_FESTIVALS } from "@/lib/sampleData";

function daysUntil(dateStr) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function FestivalCountdown() {
  return (
    <section className="bg-marigold/10 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Festival Calendar" title="Upcoming Festivals" description="Mark your calendar for the celebrations of Braj." />
          <Link href="/festivals" className="font-body text-sm text-marigold-dark hover:underline">
            Full calendar →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {SAMPLE_FESTIVALS.map((festival) => (
            <Link
              key={festival._id}
              href={`/festivals/${festival.slug}`}
              className="group rounded-2xl border border-marigold/30 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="font-display text-2xl font-semibold text-maroon">{festival.name}</p>
              <p className="mt-1 font-body text-xs text-indigo/55">
                {new Date(festival.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-marigold-dark">{daysUntil(festival.date)}</span>
                <span className="font-body text-sm text-indigo/60">days to go</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
