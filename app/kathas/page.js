import Link from "next/link";
import { Eye, PlayCircle } from "lucide-react";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_KATHAS } from "@/lib/sampleData";
import { connectDB } from "@/lib/mongodb";
import Katha from "@/models/Katha";

export const metadata = {
  title: "Katha Video Library",
  description: "Watch Shrimad Bhagwat Katha and Braj leela discourses from revered speakers, organized by category.",
};

async function getKathas() {
  try {
    await connectDB();
    const items = await Katha.find({ status: "published" }).sort({ createdAt: -1 }).lean();
    return items.length ? items : SAMPLE_KATHAS;
  } catch {
    return SAMPLE_KATHAS;
  }
}

export default async function KathasPage() {
  const kathas = await getKathas();

  return (
    <div className="bg-ivory">
      <div className="border-b border-indigo/10 bg-indigo py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="section-eyebrow text-marigold">Katha</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ivory sm:text-5xl">Katha Video Library</h1>
          <p className="mt-3 max-w-xl font-body text-sm text-ivory/70 sm:text-base">
            Discourses from revered speakers across Braj, organized for easy discovery.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {kathas.map((katha) => (
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
                <p className="mt-2 font-body text-sm text-indigo/60">{katha.speaker?.name || "—"}</p>
                <span className="mt-3 flex items-center gap-1 text-xs text-indigo/45">
                  <Eye className="h-3.5 w-3.5" /> {(katha.views || 0).toLocaleString("en-IN")} views
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
