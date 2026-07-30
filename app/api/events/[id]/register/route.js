import { connectDB } from "@/lib/mongodb";
import Event, { EventRegistration } from "@/models/Event";
import { ok, fail } from "@/lib/utils";
import { getSession } from "@/lib/auth";

// Registers a user for an event and issues a QR ticket (encoded string
// the front-end renders as a QR code, e.g. via the `qrcode` package).
export async function POST(req, { params }) {
  try {
    await connectDB();
    const event = await Event.findById(params.id);
    if (!event) return fail("Event not found", 404);

    const session = getSession();
    const body = await req.json();
    const { name, email, phone } = body;
    if (!name || !email) return fail("Name and email are required", 422);

    const count = await EventRegistration.countDocuments({ event: event._id });
    if (event.capacity && count >= event.capacity) {
      return fail("This event is fully booked", 409);
    }

    const ticketCode = `KB-${event._id.toString().slice(-6)}-${Date.now().toString(36).toUpperCase()}`;

    const registration = await EventRegistration.create({
      event: event._id,
      user: session?.id,
      name,
      email,
      phone,
      qrCode: ticketCode,
    });

    return ok(registration, { status: 201 });
  } catch (err) {
    return fail("Could not register for event", 500, err.message);
  }
}

// List registrations for an event (admin only, via query ?admin=1 checked upstream in UI)
export async function GET(_req, { params }) {
  try {
    await connectDB();
    const registrations = await EventRegistration.find({ event: params.id }).sort({ createdAt: -1 });
    return ok(registrations);
  } catch (err) {
    return fail("Could not load registrations", 500, err.message);
  }
}
