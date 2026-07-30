import { notFound } from "next/navigation";
import { ListMusic, Download, PlayCircle } from "lucide-react";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import FavoriteButton from "@/components/shared/FavoriteButton";
import { SAMPLE_BHAJANS } from "@/lib/sampleData";
import { connectDB } from "@/lib/mongodb";
import Bhajan from "@/models/Bhajan";

async function getBhajan(slug) {
  try {
    await connectDB();
    const found = await Bhajan.findOne({ slug }).populate("category", "name slug").lean();
    if (found) return found;
  } catch {
    // fall through to sample data below
  }
  return SAMPLE_BHAJANS.find((b) => b.slug === slug) || null;
}

export async function generateMetadata({ params }) {
  const bhajan = await getBhajan(params.slug);
  if (!bhajan) return {};
  return {
    title: bhajan.title,
    description: `Listen to "${bhajan.title}" by ${bhajan.singer} — lyrics, audio and video on Kishori Bhakti.`,
  };
}

export default async function BhajanDetailPage({ params }) {
  const bhajan = await getBhajan(params.slug);
  if (!bhajan) notFound();

  return (
    <div className="bg-ivory">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl">
          <PlaceholderMedia seed={bhajan._id} type="bhajan" className="aspect-video w-full" iconClassName="h-16 w-16" />
          <button className="absolute inset-0 flex items-center justify-center bg-indigo/20 transition hover:bg-indigo/35" aria-label="Play bhajan">
            <PlayCircle className="h-16 w-16 text-ivory" />
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-peacock/10 px-2.5 py-1 text-[11px] font-medium text-peacock">
              {bhajan.category?.name}
            </span>
            <h1 className="mt-3 font-display text-3xl font-semibold text-indigo sm:text-4xl">{bhajan.title}</h1>
            <p className="mt-1 font-body text-sm text-indigo/60">{bhajan.singer}</p>
          </div>
          <div className="flex gap-3">
            <FavoriteButton type="bhajan" id={String(bhajan._id)} />
            <button className="flex items-center gap-2 rounded-full border border-indigo/15 px-4 py-2 font-body text-sm text-indigo hover:border-marigold hover:text-marigold-dark">
              <ListMusic className="h-4 w-4" /> Add to Playlist
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-indigo/10 bg-white p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-indigo">Lyrics</h2>
            <button className="flex items-center gap-1.5 font-body text-xs text-peacock hover:underline">
              <Download className="h-3.5 w-3.5" /> Download PDF
            </button>
          </div>
          <p className="mt-4 whitespace-pre-line font-body text-sm leading-8 text-indigo/75">
            {bhajan.lyrics || "Lyrics coming soon."}
          </p>
        </div>
      </div>
    </div>
  );
}
