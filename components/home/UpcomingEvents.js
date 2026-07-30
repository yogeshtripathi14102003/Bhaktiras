import Link from "next/link";
import { MapPin, CalendarDays } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_EVENTS } from "@/lib/sampleData";

export default function UpcomingEvents() {
  return (
    <section className="bg-ivory py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Events" title="Upcoming Events" description="Join gatherings, yatras, and katha sammelans." />
          <Link href="/events" className="font-body text-sm text-peacock hover:underline">
            View all events →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {SAMPLE_EVENTS.map((event) => (
            <Link
              key={event._id}
              href={`/events/${event.slug}`}
              className="group flex overflow-hidden rounded-2xl border border-indigo/10 bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <PlaceholderMedia seed={event._id} type="event" className="w-36 shrink-0 sm:w-48" />
              <div className="flex flex-col justify-center p-5">
                <p className="font-display text-xl font-semibold text-indigo">{event.title}</p>
                <p className="mt-2 flex items-center gap-1.5 font-body text-xs text-indigo/60">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(event.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <p className="mt-1 flex items-center gap-1.5 font-body text-xs text-indigo/60">
                  <MapPin className="h-3.5 w-3.5" /> {event.venue}
                </p>
                <span className="mt-3 w-fit rounded-full bg-peacock/10 px-3 py-1 text-[11px] font-medium text-peacock">
                  {event.isFree ? "Free entry" : `₹${event.price}`}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
