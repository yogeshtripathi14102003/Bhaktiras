import SectionHeading from "@/components/shared/SectionHeading";
import { SAMPLE_TESTIMONIALS } from "@/lib/sampleData";
import { Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="bg-peacock/5 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Devotee Voices" title="What the community shares" align="center" />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {SAMPLE_TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl bg-white p-6 shadow-sm">
              <Quote className="h-6 w-6 text-marigold" strokeWidth={1.5} />
              <p className="mt-4 font-body text-sm leading-relaxed text-indigo/75">{t.text}</p>
              <p className="mt-4 font-display text-base font-semibold text-indigo">{t.name}</p>
              <p className="font-body text-xs text-indigo/50">{t.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
