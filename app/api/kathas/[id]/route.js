import { connectDB } from "@/lib/mongodb";
import Katha from "@/models/Katha";
import { ok, fail } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const katha = await Katha.findOne({
      $or: [{ _id: params.id.match(/^[0-9a-f]{24}$/) ? params.id : null }, { slug: params.id }],
    })
      .populate("category", "name slug")
      .populate("relatedVideos", "title slug thumbnail");
    if (!katha) return fail("Katha not found", 404);

    katha.views += 1;
    await katha.save();

    return ok(katha);
  } catch (err) {
    return fail("Could not load katha", 500, err.message);
  }
}

export async function PUT(req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    const katha = await Katha.findByIdAndUpdate(params.id, body, { new: true });
    if (!katha) return fail("Katha not found", 404);

    return ok(katha);
  } catch (err) {
    return fail("Could not update katha", 500, err.message);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const katha = await Katha.findByIdAndDelete(params.id);
    if (!katha) return fail("Katha not found", 404);

    return ok({ deleted: true });
  } catch (err) {
    return fail("Could not delete katha", 500, err.message);
  }
}
