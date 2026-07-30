import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import { ok, fail } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const event = await Event.findOne({
      $or: [{ _id: params.id.match(/^[0-9a-f]{24}$/) ? params.id : null }, { slug: params.id }],
    });
    if (!event) return fail("Event not found", 404);
    return ok(event);
  } catch (err) {
    return fail("Could not load event", 500, err.message);
  }
}

export async function PUT(req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    const event = await Event.findByIdAndUpdate(params.id, body, { new: true });
    if (!event) return fail("Event not found", 404);
    return ok(event);
  } catch (err) {
    return fail("Could not update event", 500, err.message);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const event = await Event.findByIdAndDelete(params.id);
    if (!event) return fail("Event not found", 404);
    return ok({ deleted: true });
  } catch (err) {
    return fail("Could not delete event", 500, err.message);
  }
}
