import { notFound } from "next/navigation";
import { PlayCircle, Bookmark, Share2 } from "lucide-react";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_KATHAS } from "@/lib/sampleData";
import { connectDB } from "@/lib/mongodb";
import Katha from "@/models/Katha";

async function getKathaData(slug) {
  try {
    await connectDB();
    const katha = await Katha.findOne({ slug }).lean();
    if (katha) {
      const related = await Katha.find({ slug: { $ne: slug }, status: "published" })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
      return { katha, related };
    }
  } catch {
    // fall through to sample data below
  }
  const sample = SAMPLE_KATHAS.find((k) => k.slug === slug);
  return sample ? { katha: sample, related: SAMPLE_KATHAS.filter((k) => k.slug !== slug) } : { katha: null, related: [] };
}

export async function generateMetadata({ params }) {
  const { katha } = await getKathaData(params.slug);
  if (!katha) return {};
  return {
    title: katha.title,
    description: `Watch "${katha.title}" by ${katha.speaker?.name || "our speaker"} on Kishori Bhakti.`,
  };
}

export default async function KathaDetailPage({ params }) {
  const { katha, related } = await getKathaData(params.slug);
  if (!katha) notFound();

  return (
    <div className="bg-ivory">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="relative overflow-hidden rounded-2xl">
              <PlaceholderMedia seed={katha._id} type="katha" className="aspect-video w-full" iconClassName="h-16 w-16" />
              <button className="absolute inset-0 flex items-center justify-center bg-indigo/20 transition hover:bg-indigo/35" aria-label="Play katha">
                <PlayCircle className="h-16 w-16 text-ivory" />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
              <h1 className="font-display text-3xl font-semibold text-indigo sm:text-4xl">{katha.title}</h1>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 rounded-full border border-indigo/15 px-4 py-2 font-body text-sm text-indigo hover:border-marigold hover:text-marigold-dark">
                  <Bookmark className="h-4 w-4" /> Bookmark
                </button>
                <button className="flex items-center gap-2 rounded-full border border-indigo/15 px-4 py-2 font-body text-sm text-indigo hover:border-marigold hover:text-marigold-dark">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-indigo/10 bg-white p-5">
              <PlaceholderMedia seed={`speaker-${katha._id}`} type="saint" className="h-16 w-16 shrink-0 rounded-full" />
              <div>
                <p className="font-display text-lg font-semibold text-indigo">{katha.speaker?.name || "—"}</p>
                <p className="font-body text-xs text-indigo/55">Katha Speaker</p>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-xl font-semibold text-indigo">Comments</h2>
              <p className="mt-2 font-body text-sm text-indigo/55">Login to join the discussion.</p>
            </div>
          </div>

          <aside>
            <h2 className="font-display text-xl font-semibold text-indigo">Related Videos</h2>
            <div className="mt-4 space-y-4">
              {related.map((r) => (
                <a key={r._id} href={`/kathas/${r.slug}`} className="flex gap-3 rounded-xl p-2 transition hover:bg-white">
                  <PlaceholderMedia seed={r._id} type="katha" className="h-16 w-28 shrink-0 rounded-lg" />
                  <div>
                    <p className="line-clamp-2 font-body text-sm font-medium text-indigo">{r.title}</p>
                    <p className="mt-1 font-body text-xs text-indigo/50">{r.speaker?.name || "—"}</p>
                  </div>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
