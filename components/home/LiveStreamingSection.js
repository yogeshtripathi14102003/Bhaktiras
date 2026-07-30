import Link from "next/link";
import { Radio } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_LIVE_STREAMS } from "@/lib/sampleData";

export default function LiveStreamingSection() {
  return (
    <section className="bg-indigo py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow text-marigold">Live Darshan</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ivory sm:text-4xl">
              Temple streams, live right now
            </h2>
          </div>
          <Link href="/live-darshan" className="font-body text-sm text-marigold hover:underline">
            View all streams →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_LIVE_STREAMS.map((stream) => (
            <div key={stream._id} className="group overflow-hidden rounded-2xl border border-ivory/10 bg-indigo-light/40">
              <div className="relative">
                <PlaceholderMedia seed={stream._id} type="live" className="aspect-video w-full" iconClassName="h-10 w-10" />
                {stream.isLive && (
                  <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-maroon px-3 py-1 text-xs font-semibold text-ivory">
                    <Radio className="h-3 w-3 animate-pulse" /> LIVE
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-body text-sm font-medium text-ivory">{stream.templeName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
