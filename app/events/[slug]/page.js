import { notFound } from "next/navigation";
import { MapPin, CalendarDays, Users } from "lucide-react";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import EventRegisterForm from "@/components/home/EventRegisterForm";
import { SAMPLE_EVENTS } from "@/lib/sampleData";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";

async function getEvent(slug) {
  try {
    await connectDB();
    const found = await Event.findOne({ slug }).lean();
    if (found) return found;
  } catch {
    // fall through to sample data below
  }
  return SAMPLE_EVENTS.find((e) => e.slug === slug) || null;
}

export async function generateMetadata({ params }) {
  const event = await getEvent(params.slug);
  if (!event) return {};
  return {
    title: event.title,
    description: `Register for ${event.title} at ${event.venue} — Kishori Bhakti Events.`,
  };
}

export default async function EventDetailPage({ params }) {
  const event = await getEvent(params.slug);
  if (!event) notFound();

  return (
    <div className="bg-ivory">
      <PlaceholderMedia seed={event._id} type="event" className="aspect-[21/9] w-full" iconClassName="h-14 w-14" />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h1 className="font-display text-4xl font-semibold text-indigo">{event.title}</h1>
            <div className="mt-4 flex flex-wrap gap-5">
              <span className="flex items-center gap-1.5 font-body text-sm text-indigo/70">
                <CalendarDays className="h-4 w-4" />
                {new Date(event.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1.5 font-body text-sm text-indigo/70">
                <MapPin className="h-4 w-4" /> {event.venue}
              </span>
              <span className="flex items-center gap-1.5 font-body text-sm text-indigo/70">
                <Users className="h-4 w-4" /> {event.isFree ? "Free entry" : `₹${event.price} per person`}
              </span>
            </div>

            <p className="mt-6 font-body text-sm leading-7 text-indigo/75">
              Join fellow devotees for {event.title.toLowerCase()} — an occasion
              of kirtan, katha and community seva at {event.venue}. Registration
              includes a QR entry ticket sent to your email.
            </p>
          </div>

          <EventRegisterForm eventTitle={event.title} />
        </div>
      </div>
    </div>
  );
}
