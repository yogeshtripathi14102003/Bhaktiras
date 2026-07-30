import { connectDB } from "@/lib/mongodb";
import KathaBooking from "@/models/KathaBooking";
import { ok, fail, created, paginate } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";
import { sendEmail, kathaBookingEmail } from "@/lib/email";

export async function GET(req) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = paginate(searchParams);
    const status = searchParams.get("status");

    const filter = {};
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      KathaBooking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      KathaBooking.countDocuments(filter),
    ]);

    return ok({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return fail("Could not load katha bookings", 500, err.message);
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const session = getSession();
    const body = await req.json();

    if (!body.name || !body.email || !body.phone || !body.preferredDate) {
      return fail("Name, email, phone and preferred date are required", 422);
    }

    const booking = await KathaBooking.create({ ...body, user: session?.id });

    sendEmail({ to: booking.email, ...kathaBookingEmail(booking) }).catch(() => {});

    return created(booking);
  } catch (err) {
    return fail("Could not submit booking request", 500, err.message);
  }
}
