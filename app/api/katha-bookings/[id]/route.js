import { connectDB } from "@/lib/mongodb";
import KathaBooking from "@/models/KathaBooking";
import { ok, fail } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function PUT(req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    const booking = await KathaBooking.findByIdAndUpdate(params.id, body, { new: true });
    if (!booking) return fail("Booking not found", 404);
    return ok(booking);
  } catch (err) {
    return fail("Could not update booking", 500, err.message);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const booking = await KathaBooking.findByIdAndDelete(params.id);
    if (!booking) return fail("Booking not found", 404);
    return ok({ deleted: true });
  } catch (err) {
    return fail("Could not delete booking", 500, err.message);
  }
}
