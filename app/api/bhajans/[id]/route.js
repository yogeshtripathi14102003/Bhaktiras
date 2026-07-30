import { connectDB } from "@/lib/mongodb";
import Bhajan from "@/models/Bhajan";
import { ok, fail } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const bhajan = await Bhajan.findOne({
      $or: [{ _id: params.id.match(/^[0-9a-f]{24}$/) ? params.id : null }, { slug: params.id }],
    }).populate("category", "name slug");
    if (!bhajan) return fail("Bhajan not found", 404);

    bhajan.playCount += 1;
    await bhajan.save();

    return ok(bhajan);
  } catch (err) {
    return fail("Could not load bhajan", 500, err.message);
  }
}

export async function PUT(req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    const bhajan = await Bhajan.findByIdAndUpdate(params.id, body, { new: true });
    if (!bhajan) return fail("Bhajan not found", 404);

    return ok(bhajan);
  } catch (err) {
    return fail("Could not update bhajan", 500, err.message);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const bhajan = await Bhajan.findByIdAndDelete(params.id);
    if (!bhajan) return fail("Bhajan not found", 404);

    return ok({ deleted: true });
  } catch (err) {
    return fail("Could not delete bhajan", 500, err.message);
  }
}
