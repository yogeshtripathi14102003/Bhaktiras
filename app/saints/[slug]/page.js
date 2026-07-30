import { notFound } from "next/navigation";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import FavoriteButton from "@/components/shared/FavoriteButton";
import { SAMPLE_SAINTS } from "@/lib/sampleData";
import { connectDB } from "@/lib/mongodb";
import Saint from "@/models/Saint";

async function getSaint(slug) {
  try {
    await connectDB();
    const found = await Saint.findOne({ slug }).lean();
    if (found) return found;
  } catch {
    // fall through to sample data below
  }
  return SAMPLE_SAINTS.find((s) => s.slug === slug) || null;
}

export async function generateMetadata({ params }) {
  const saint = await getSaint(params.slug);
  if (!saint) return {};
  return {
    title: saint.name,
    description: `Biography, teachings and quotes of ${saint.name} on Kishori Bhakti.`,
  };
}

const FALLBACK_TIMELINE = [
  { year: "1486", event: "Birth in Navadvip, Bengal" },
  { year: "1510", event: "Took sannyasa and traveled to Puri" },
  { year: "1515", event: "Journeyed to Vrindavan, rediscovering lost pilgrimage sites" },
];

const FALLBACK_QUOTES = [
  "Chant the holy name and be humbler than a blade of grass.",
  "Devotion is the only path that asks nothing but love in return.",
];

export default async function SaintDetailPage({ params }) {
  const saint = await getSaint(params.slug);
  if (!saint) notFound();

  const quotes = saint.quotes?.length ? saint.quotes : FALLBACK_QUOTES;
  const timeline = saint.timeline?.length ? saint.timeline : FALLBACK_TIMELINE;

  return (
    <div className="bg-ivory">
      <div className="border-b border-indigo/10 bg-indigo py-14">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <PlaceholderMedia seed={saint._id} type="saint" className="h-32 w-32 rounded-full ring-4 ring-marigold/40" iconClassName="h-12 w-12" />
          <div>
            <h1 className="font-display text-4xl font-semibold text-ivory">{saint.name}</h1>
            <p className="mt-1 font-body text-sm text-ivory/60">{saint.era}</p>
            <div className="mt-4 flex justify-center">
              <FavoriteButton type="saint" id={String(saint._id)} dark />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <section>
          <h2 className="font-display text-2xl font-semibold text-indigo">Biography</h2>
          <p className="mt-4 font-body text-sm leading-7 text-indigo/75">
            {saint.biography ||
              `${saint.name} is remembered across Braj for a life devoted entirely to Radha-Krishna bhakti, whose teachings continue to guide devotees through katha, kirtan and the living tradition of Vaishnav sampradaya.`}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-indigo">Quotes</h2>
          <div className="mt-4 space-y-4">
            {quotes.map((q, i) => (
              <blockquote key={i} className="rounded-xl border-l-4 border-marigold bg-marigold/5 p-4 font-body italic text-indigo/80">
                &ldquo;{q}&rdquo;
              </blockquote>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-indigo">Timeline</h2>
          <ol className="mt-4 space-y-4 border-l border-indigo/15 pl-6">
            {timeline.map((t, i) => (
              <li key={t.year || i} className="relative">
                <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-marigold" />
                <p className="font-mono text-xs text-marigold-dark">{t.year}</p>
                <p className="font-body text-sm text-indigo/75">{t.event}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
