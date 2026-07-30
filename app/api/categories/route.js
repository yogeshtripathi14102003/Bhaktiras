import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { ok, fail, created } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";
import { toSlug } from "@/lib/utils";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const filter = type ? { type } : {};
    const categories = await Category.find(filter).sort({ name: 1 });
    return ok(categories);
  } catch (err) {
    return fail("Could not load categories", 500, err.message);
  }
}

export async function POST(req) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    if (!body.name || !body.type) return fail("Name and type are required", 422);

    const category = await Category.create({ ...body, slug: body.slug || toSlug(body.name) });
    return created(category);
  } catch (err) {
    return fail("Could not create category", 500, err.message);
  }
}
