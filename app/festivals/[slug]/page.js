import { notFound } from "next/navigation";
import { Bell } from "lucide-react";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_FESTIVALS, SAMPLE_BHAJANS, SAMPLE_BLOGS } from "@/lib/sampleData";
import { connectDB } from "@/lib/mongodb";
import Festival from "@/models/Festival";

async function getFestival(slug) {
  try {
    await connectDB();
    const found = await Festival.findOne({ slug })
      .populate("relatedBhajans", "title slug")
      .populate("relatedArticles", "title slug")
      .lean();
    if (found) return found;
  } catch {
    // fall through to sample data below
  }
  return SAMPLE_FESTIVALS.find((f) => f.slug === slug) || null;
}

export async function generateMetadata({ params }) {
  const festival = await getFestival(params.slug);
  if (!festival) return {};
  return {
    title: festival.name,
    description: `History, importance and mantra for ${festival.name} — Kishori Bhakti Festival Calendar.`,
  };
}

export default async function FestivalDetailPage({ params }) {
  const festival = await getFestival(params.slug);
  if (!festival) notFound();

  const relatedBhajans = festival.relatedBhajans?.length ? festival.relatedBhajans : SAMPLE_BHAJANS.slice(0, 2);
  const relatedArticles = festival.relatedArticles?.length ? festival.relatedArticles : SAMPLE_BLOGS.slice(0, 2);

  return (
    <div className="bg-ivory">
      <PlaceholderMedia seed={festival._id} type="festival" className="aspect-[21/9] w-full" iconClassName="h-14 w-14" />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-semibold text-maroon">{festival.name}</h1>
            <p className="mt-1 font-body text-sm text-indigo/60">
              {new Date(festival.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-full bg-marigold px-5 py-2.5 font-body text-sm font-semibold text-indigo hover:bg-marigold-light">
            <Bell className="h-4 w-4" /> Set Reminder
          </button>
        </div>

        <div className="mt-8 rounded-2xl bg-maroon/5 p-6 text-center">
          <p className="section-eyebrow text-maroon">Mantra</p>
          <p className="mt-2 font-display text-2xl italic text-maroon">{festival.mantra}</p>
        </div>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-indigo">History</h2>
          <p className="mt-3 font-body text-sm leading-7 text-indigo/75">
            {festival.history ||
              `${festival.name} marks a moment cherished across Braj, observed with temple decoration, all-night kirtan and community gatherings that trace back through generations of Vaishnav tradition.`}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl font-semibold text-indigo">Importance</h2>
          <p className="mt-3 font-body text-sm leading-7 text-indigo/75">
            {festival.importance ||
              "Devotees observe this day with fasting, katha and special aarti, believing the occasion carries heightened grace for sincere prayer and remembrance."}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-indigo">Related Bhajans</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {relatedBhajans.map((b) => (
              <a key={b._id} href={`/bhajans/${b.slug}`} className="flex items-center gap-3 rounded-xl border border-indigo/10 bg-white p-3 hover:shadow-md">
                <PlaceholderMedia seed={b._id} type="bhajan" className="h-14 w-14 shrink-0 rounded-lg" />
                <p className="font-body text-sm text-indigo/80">{b.title}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-xl font-semibold text-indigo">Related Articles</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {relatedArticles.map((b) => (
              <a key={b._id} href={`/blog/${b.slug}`} className="flex items-center gap-3 rounded-xl border border-indigo/10 bg-white p-3 hover:shadow-md">
                <PlaceholderMedia seed={b._id} type="blog" className="h-14 w-14 shrink-0 rounded-lg" />
                <p className="font-body text-sm text-indigo/80">{b.title}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
