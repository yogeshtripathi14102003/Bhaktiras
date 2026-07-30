import { connectDB } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { ok, fail } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function PUT(req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    const item = await Gallery.findByIdAndUpdate(params.id, body, { new: true });
    if (!item) return fail("Gallery item not found", 404);
    return ok(item);
  } catch (err) {
    return fail("Could not update gallery item", 500, err.message);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const item = await Gallery.findByIdAndDelete(params.id);
    if (!item) return fail("Gallery item not found", 404);
    return ok({ deleted: true });
  } catch (err) {
    return fail("Could not delete gallery item", 500, err.message);
  }
}
