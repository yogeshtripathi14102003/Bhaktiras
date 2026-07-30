import { connectDB } from "@/lib/mongodb";
import Query from "@/models/Query";
import { ok, fail } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function PUT(req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    const query = await Query.findByIdAndUpdate(params.id, body, { new: true });
    if (!query) return fail("Query not found", 404);
    return ok(query);
  } catch (err) {
    return fail("Could not update query", 500, err.message);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const query = await Query.findByIdAndDelete(params.id);
    if (!query) return fail("Query not found", 404);
    return ok({ deleted: true });
  } catch (err) {
    return fail("Could not delete query", 500, err.message);
  }
}
