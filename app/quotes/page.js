import { Share2, Quote as QuoteIcon } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Quote from "@/models/Quote";

export const metadata = {
  title: "Daily Quotes",
  description: "A collection of daily devotional quotes to inspire your day.",
};

const FALLBACK_QUOTES = [
  { text: "Where there is Radha, there is Krishna; where there is Krishna, there is Radha — the two are one soul in two forms.", author: "Traditional Vaishnav teaching" },
  { text: "Chant the holy name and be humbler than a blade of grass.", author: "Sri Chaitanya Mahaprabhu" },
  { text: "Devotion is the only path that asks nothing but love in return.", author: "Sri Hit Harivansh Mahaprabhu" },
  { text: "The dust of Vrindavan is worth more than the riches of any kingdom.", author: "Braj folk saying" },
];

async function getQuotes() {
  try {
    await connectDB();
    const items = await Quote.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    return items.length ? items : FALLBACK_QUOTES;
  } catch {
    return FALLBACK_QUOTES;
  }
}

export default async function QuotesPage() {
  const quotes = await getQuotes();

  return (
    <div className="bg-ivory">
      <div className="border-b border-indigo/10 bg-maroon py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="section-eyebrow text-marigold">Daily Quotes</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ivory sm:text-5xl">Words to Carry Today</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="space-y-6">
          {quotes.map((q, i) => (
            <div key={q._id || i} className="rounded-2xl border border-indigo/10 bg-white p-6">
              <QuoteIcon className="h-6 w-6 text-marigold" strokeWidth={1.5} />
              <p className="mt-3 font-display text-xl italic text-indigo">&ldquo;{q.text}&rdquo;</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="font-body text-xs text-indigo/55">— {q.author || "Unknown"}</p>
                <button className="flex items-center gap-1.5 font-body text-xs text-peacock hover:underline">
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
