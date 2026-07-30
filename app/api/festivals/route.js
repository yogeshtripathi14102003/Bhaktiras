import { connectDB } from "@/lib/mongodb";
import Festival from "@/models/Festival";
import { ok, fail, created, toSlug } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const upcoming = searchParams.get("upcoming");

    const filter = { status: "published" };
    if (upcoming) filter.date = { $gte: new Date() };

    const items = await Festival.find(filter)
      .populate("relatedBhajans", "title slug thumbnail")
      .populate("relatedArticles", "title slug coverImage")
      .sort({ date: 1 });

    return ok(items);
  } catch (err) {
    return fail("Could not load festivals", 500, err.message);
  }
}

export async function POST(req) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    if (!body.name || !body.date) return fail("Name and date are required", 422);

    const festival = await Festival.create({ ...body, slug: body.slug || toSlug(body.name) });
    return created(festival);
  } catch (err) {
    return fail("Could not create festival", 500, err.message);
  }
}
