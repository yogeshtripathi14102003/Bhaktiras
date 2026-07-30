import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { ok, fail } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

const ALLOWED_FIELDS = ["role", "status", "name", "phone"];

export async function PUT(req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();

    if (params.id === session.id && body.role && body.role !== "admin") {
      return fail("You can't remove your own admin access", 400);
    }

    const updates = {};
    for (const key of ALLOWED_FIELDS) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    const user = await User.findByIdAndUpdate(params.id, updates, { new: true });
    if (!user) return fail("User not found", 404);
    return ok(user);
  } catch (err) {
    return fail("Could not update user", 500, err.message);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    if (params.id === session.id) {
      return fail("You can't delete your own account", 400);
    }

    await connectDB();
    const user = await User.findByIdAndDelete(params.id);
    if (!user) return fail("User not found", 404);
    return ok({ deleted: true });
  } catch (err) {
    return fail("Could not delete user", 500, err.message);
  }
}
