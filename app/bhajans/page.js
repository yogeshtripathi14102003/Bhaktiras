import Link from "next/link";
import { Clock, PlayCircle } from "lucide-react";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_BHAJANS } from "@/lib/sampleData";
import { connectDB } from "@/lib/mongodb";
import Bhajan from "@/models/Bhajan";

export const metadata = {
  title: "Bhajan Library",
  description: "Listen to devotional Bhajans of Radha Krishna with lyrics, audio and video — search by category and singer.",
};

function formatDuration(seconds) {
  const m = Math.floor((seconds || 0) / 60);
  const s = (seconds || 0) % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Live from MongoDB — falls back to sample data only if the DB is
// unreachable or genuinely has nothing published yet, so the page never
// breaks during initial setup.
async function getBhajans() {
  try {
    await connectDB();
    const items = await Bhajan.find({ status: "published" })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean();
    return items.length ? items : SAMPLE_BHAJANS;
  } catch {
    return SAMPLE_BHAJANS;
  }
}

export default async function BhajansPage() {
  const bhajans = await getBhajans();

  return (
    <div className="bg-ivory">
      <div className="border-b border-indigo/10 bg-indigo py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="section-eyebrow text-marigold">Bhajan</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ivory sm:text-5xl">
            Bhajan Library
          </h1>
          <p className="mt-3 max-w-xl font-body text-sm text-ivory/70 sm:text-base">
            Devotional music with lyrics, audio and video — build your playlist
            and download lyric sheets.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bhajans.map((bhajan) => (
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
    </div>
  );
}
