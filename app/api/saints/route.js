import { connectDB } from "@/lib/mongodb";
import Saint from "@/models/Saint";
import { ok, fail, created, paginate, toSlug } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = paginate(searchParams);
    const q = searchParams.get("q");
    const featured = searchParams.get("featured");

    const filter = { status: "published" };
    if (q) filter.$text = { $search: q };
    if (featured) filter.isFeatured = true;

    const [items, total] = await Promise.all([
      Saint.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
      Saint.countDocuments(filter),
    ]);

    return ok({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return fail("Could not load saints", 500, err.message);
  }
}

export async function POST(req) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    if (!body.name) return fail("Name is required", 422);

    const saint = await Saint.create({ ...body, slug: body.slug || toSlug(body.name) });
    return created(saint);
  } catch (err) {
    return fail("Could not create saint profile", 500, err.message);
  }
}
