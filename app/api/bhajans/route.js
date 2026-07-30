import { connectDB } from "@/lib/mongodb";
import Bhajan from "@/models/Bhajan";
import { ok, fail, created, paginate, toSlug } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = paginate(searchParams);
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const filter = { status: "published" };
    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    if (featured) filter.isFeatured = true;

    const [items, total] = await Promise.all([
      Bhajan.find(filter)
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Bhajan.countDocuments(filter),
    ]);

    return ok({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return fail("Could not load bhajans", 500, err.message);
  }
}

export async function POST(req) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    if (!body.title) return fail("Title is required", 422);

    const bhajan = await Bhajan.create({ ...body, slug: body.slug || toSlug(body.title) });
    return created(bhajan);
  } catch (err) {
    return fail("Could not create bhajan", 500, err.message);
  }
}
