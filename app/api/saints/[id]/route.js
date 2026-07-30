import { connectDB } from "@/lib/mongodb";
import Saint from "@/models/Saint";
import { ok, fail } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const saint = await Saint.findOne({
      $or: [{ _id: params.id.match(/^[0-9a-f]{24}$/) ? params.id : null }, { slug: params.id }],
    }).populate("videos", "title slug thumbnail");
    if (!saint) return fail("Saint profile not found", 404);
    return ok(saint);
  } catch (err) {
    return fail("Could not load saint profile", 500, err.message);
  }
}

export async function PUT(req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    const saint = await Saint.findByIdAndUpdate(params.id, body, { new: true });
    if (!saint) return fail("Saint profile not found", 404);
    return ok(saint);
  } catch (err) {
    return fail("Could not update saint profile", 500, err.message);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const saint = await Saint.findByIdAndDelete(params.id);
    if (!saint) return fail("Saint profile not found", 404);
    return ok({ deleted: true });
  } catch (err) {
    return fail("Could not delete saint profile", 500, err.message);
  }
}
