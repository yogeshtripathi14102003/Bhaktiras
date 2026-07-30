import Link from "next/link";
import { HeartHandshake } from "lucide-react";

export default function DonationCTA() {
  return (
    <section className="bg-indigo py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <HeartHandshake className="mx-auto h-9 w-9 text-marigold" strokeWidth={1.5} />
        <h2 className="mt-5 font-display text-3xl font-semibold text-ivory sm:text-4xl">
          Support Seva in Braj
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-body text-sm text-ivory/70 sm:text-base">
          Your donation helps fund temple seva, katha production, and community
          events across Vrindavan and Barsana. Every contribution, big or small,
          reaches directly where it&apos;s needed.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/donate"
            className="rounded-full bg-marigold px-8 py-3 font-body text-sm font-semibold text-indigo transition hover:bg-marigold-light"
          >
            Donate Now
          </Link>
          <Link
            href="/donate#monthly"
            className="rounded-full border border-ivory/30 px-8 py-3 font-body text-sm font-semibold text-ivory transition hover:border-marigold hover:text-marigold"
          >
            Become a Monthly Donor
          </Link>
        </div>
      </div>
    </section>
  );
}
