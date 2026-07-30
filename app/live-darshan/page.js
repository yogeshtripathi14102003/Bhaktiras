import { Radio } from "lucide-react";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_LIVE_STREAMS } from "@/lib/sampleData";
import { connectDB } from "@/lib/mongodb";
import LiveStream from "@/models/LiveStream";

export const metadata = {
  title: "Live Darshan",
  description: "Join live darshan streams from the temples of Braj — Barsana, Vrindavan and beyond, with daily aarti schedules.",
};

async function getStreams() {
  try {
    await connectDB();
    const items = await LiveStream.find().sort({ isLive: -1, createdAt: -1 }).lean();
    return items.length ? items : SAMPLE_LIVE_STREAMS;
  } catch {
    return SAMPLE_LIVE_STREAMS;
  }
}

export default async function LiveDarshanPage() {
  const streams = await getStreams();
  const featured = streams.find((s) => s.isLive) || null;
  const others = streams.filter((s) => s !== featured);

  return (
    <div className="bg-ivory">
      <div className="border-b border-indigo/10 bg-indigo py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="section-eyebrow text-marigold">Live Darshan</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ivory sm:text-5xl">Temple Live Streams</h1>
          <p className="mt-3 max-w-xl font-body text-sm text-ivory/70 sm:text-base">
            Multiple temple feeds from across Braj, streamed daily.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {featured && (
          <div className="mb-10 overflow-hidden rounded-2xl border border-indigo/10 bg-white">
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={featured.streamUrl}
                title={featured.templeName}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
              <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-maroon px-3 py-1 text-xs font-semibold text-ivory">
                <Radio className="h-3 w-3 animate-pulse" /> LIVE NOW
              </span>
            </div>
            <div className="p-5">
              <p className="font-display text-xl font-semibold text-indigo">{featured.templeName}</p>
            </div>
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="grid gap-6 sm:grid-cols-2">
            {others.map((stream) => (
              <div key={stream._id} className="overflow-hidden rounded-2xl border border-indigo/10 bg-white">
                <div className="relative">
                  <PlaceholderMedia seed={stream._id} type="live" className="aspect-video w-full" iconClassName="h-10 w-10" />
                  {stream.isLive && (
                    <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-maroon px-3 py-1 text-xs font-semibold text-ivory">
                      <Radio className="h-3 w-3 animate-pulse" /> LIVE
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-body text-sm font-medium text-indigo">{stream.templeName}</p>
                  {!stream.isLive && <p className="mt-1 font-body text-xs text-indigo/50">Offline — check schedule</p>}
                </div>
              </div>
            ))}
            {streams.length === 0 && (
              <p className="col-span-2 font-body text-sm text-indigo/50">No streams configured yet.</p>
            )}
          </div>

          <aside className="rounded-2xl border border-marigold/25 bg-marigold/5 p-6">
            <h2 className="font-display text-xl font-semibold text-indigo">Today&apos;s Aarti Schedule</h2>
            <ul className="mt-4 space-y-3">
              {(featured?.schedule?.length ? featured.schedule : streams.find((s) => s.schedule?.length)?.schedule || []).map((s, i) => (
                <li key={i} className="flex items-center justify-between border-b border-indigo/10 pb-3 last:border-0">
                  <span className="font-body text-sm text-indigo/75">{s.title}</span>
                  <span className="font-mono text-xs text-marigold-dark">{s.time}</span>
                </li>
              ))}
              {!streams.some((s) => s.schedule?.length) && (
                <li className="font-body text-sm text-indigo/50">No schedule published yet.</li>
              )}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
