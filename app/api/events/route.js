import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import { ok, fail, created, paginate, toSlug } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = paginate(searchParams);
    const status = searchParams.get("status");

    const filter = {};
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      Event.find(filter).sort({ startDate: 1 }).skip(skip).limit(limit),
      Event.countDocuments(filter),
    ]);

    return ok({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return fail("Could not load events", 500, err.message);
  }
}

export async function POST(req) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    if (!body.title || !body.startDate) return fail("Title and start date are required", 422);

    const event = await Event.create({ ...body, slug: body.slug || toSlug(body.title) });
    return created(event);
  } catch (err) {
    return fail("Could not create event", 500, err.message);
  }
}
