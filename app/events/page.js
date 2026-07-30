import Link from "next/link";
import { MapPin, CalendarDays } from "lucide-react";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_EVENTS } from "@/lib/sampleData";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";

export const metadata = {
  title: "Events",
  description: "Register for upcoming yatras, katha sammelans and community gatherings across Braj.",
};

async function getEvents() {
  try {
    await connectDB();
    const items = await Event.find().sort({ startDate: 1 }).lean();
    return items.length ? items : SAMPLE_EVENTS;
  } catch {
    return SAMPLE_EVENTS;
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="bg-ivory">
      <div className="border-b border-indigo/10 bg-indigo py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="section-eyebrow text-marigold">Events</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ivory sm:text-5xl">Upcoming Events</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {events.map((event) => (
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
    </div>
  );
}
