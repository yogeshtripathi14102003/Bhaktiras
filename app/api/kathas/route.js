import { connectDB } from "@/lib/mongodb";
import Katha from "@/models/Katha";
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
      Katha.find(filter)
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Katha.countDocuments(filter),
    ]);

    return ok({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return fail("Could not load kathas", 500, err.message);
  }
}

export async function POST(req) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    if (!body.title || !body.videoUrl) return fail("Title and videoUrl are required", 422);

    const katha = await Katha.create({ ...body, slug: body.slug || toSlug(body.title) });
    return created(katha);
  } catch (err) {
    return fail("Could not create katha", 500, err.message);
  }
}
