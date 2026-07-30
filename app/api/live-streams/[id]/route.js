import { connectDB } from "@/lib/mongodb";
import LiveStream from "@/models/LiveStream";
import { ok, fail } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function PUT(req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    const stream = await LiveStream.findByIdAndUpdate(params.id, body, { new: true });
    if (!stream) return fail("Live stream not found", 404);
    return ok(stream);
  } catch (err) {
    return fail("Could not update live stream", 500, err.message);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const stream = await LiveStream.findByIdAndDelete(params.id);
    if (!stream) return fail("Live stream not found", 404);
    return ok({ deleted: true });
  } catch (err) {
    return fail("Could not delete live stream", 500, err.message);
  }
}
