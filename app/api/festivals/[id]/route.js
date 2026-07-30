import { connectDB } from "@/lib/mongodb";
import Festival from "@/models/Festival";
import { ok, fail } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const festival = await Festival.findOne({
      $or: [{ _id: params.id.match(/^[0-9a-f]{24}$/) ? params.id : null }, { slug: params.id }],
    })
      .populate("relatedBhajans", "title slug thumbnail")
      .populate("relatedArticles", "title slug coverImage");
    if (!festival) return fail("Festival not found", 404);
    return ok(festival);
  } catch (err) {
    return fail("Could not load festival", 500, err.message);
  }
}

export async function PUT(req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    const festival = await Festival.findByIdAndUpdate(params.id, body, { new: true });
    if (!festival) return fail("Festival not found", 404);
    return ok(festival);
  } catch (err) {
    return fail("Could not update festival", 500, err.message);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const festival = await Festival.findByIdAndDelete(params.id);
    if (!festival) return fail("Festival not found", 404);
    return ok({ deleted: true });
  } catch (err) {
    return fail("Could not delete festival", 500, err.message);
  }
}
