import Link from "next/link";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_SAINTS } from "@/lib/sampleData";
import { connectDB } from "@/lib/mongodb";
import Saint from "@/models/Saint";

export const metadata = {
  title: "Saints of Braj",
  description: "Explore the biography, quotes and teachings of the saints who shaped Vaishnav devotion in Braj.",
};

async function getSaints() {
  try {
    await connectDB();
    const items = await Saint.find({ status: "published" }).sort({ name: 1 }).lean();
    return items.length ? items : SAMPLE_SAINTS;
  } catch {
    return SAMPLE_SAINTS;
  }
}

export default async function SaintsPage() {
  const saints = await getSaints();

  return (
    <div className="bg-ivory">
      <div className="border-b border-indigo/10 bg-indigo py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="section-eyebrow text-marigold">Saints</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ivory sm:text-5xl">Saints of Braj</h1>
          <p className="mt-3 max-w-xl font-body text-sm text-ivory/70 sm:text-base">
            The lives, quotes and teachings that shaped Vaishnav devotion.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {saints.map((saint) => (
            <Link key={saint._id} href={`/saints/${saint.slug}`} className="group text-center">
              <PlaceholderMedia
                seed={saint._id}
                type="saint"
                className="mx-auto aspect-square w-full max-w-[180px] rounded-full ring-4 ring-marigold/20 transition group-hover:ring-marigold/50"
                iconClassName="h-9 w-9"
              />
              <p className="mt-4 font-display text-lg font-semibold text-indigo">{saint.name}</p>
              <p className="font-body text-xs text-indigo/55">{saint.era}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
