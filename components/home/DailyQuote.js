import { Share2, Quote as QuoteIcon } from "lucide-react";
import { SAMPLE_QUOTE } from "@/lib/sampleData";

export default function DailyQuote() {
  return (
    <section className="relative overflow-hidden bg-maroon py-16 sm:py-20">
      <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <QuoteIcon className="mx-auto h-8 w-8 text-marigold" strokeWidth={1.5} />
        <p className="mt-6 font-display text-2xl italic leading-relaxed text-ivory sm:text-3xl">
          &ldquo;{SAMPLE_QUOTE.text}&rdquo;
        </p>
        <p className="mt-5 font-body text-sm text-ivory/70">— {SAMPLE_QUOTE.author}</p>
        <button className="mx-auto mt-8 flex items-center gap-2 rounded-full border border-marigold/40 px-5 py-2 font-body text-sm text-marigold transition hover:bg-marigold hover:text-maroon">
          <Share2 className="h-4 w-4" /> Share today&apos;s quote
        </button>
      </div>
    </section>
  );
}
