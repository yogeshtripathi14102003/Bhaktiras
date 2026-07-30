import Link from "next/link";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_FESTIVALS } from "@/lib/sampleData";
import { connectDB } from "@/lib/mongodb";
import Festival from "@/models/Festival";

export const metadata = {
  title: "Festival Calendar",
  description: "Browse the full calendar of Braj festivals with history, importance, mantras and countdowns.",
};

function daysUntil(dateStr) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

async function getFestivals() {
  try {
    await connectDB();
    const items = await Festival.find({ status: "published" }).sort({ date: 1 }).lean();
    return items.length ? items : SAMPLE_FESTIVALS;
  } catch {
    return SAMPLE_FESTIVALS;
  }
}

export default async function FestivalsPage() {
  const festivals = await getFestivals();

  return (
    <div className="bg-ivory">
      <div className="border-b border-indigo/10 bg-indigo py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="section-eyebrow text-marigold">Festival Calendar</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ivory sm:text-5xl">Festivals of Braj</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {festivals.map((festival) => (
            <Link
              key={festival._id}
              href={`/festivals/${festival.slug}`}
              className="group overflow-hidden rounded-2xl border border-marigold/25 bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <PlaceholderMedia seed={festival._id} type="festival" className="aspect-video w-full" />
              <div className="p-6">
                <p className="font-display text-2xl font-semibold text-maroon">{festival.name}</p>
                <p className="mt-1 font-body text-xs text-indigo/55">
                  {new Date(festival.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-marigold-dark">{daysUntil(festival.date)}</span>
                  <span className="font-body text-sm text-indigo/60">days to go</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
