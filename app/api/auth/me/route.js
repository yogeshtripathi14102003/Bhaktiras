import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getSession } from "@/lib/auth";
import { ok, fail } from "@/lib/utils";

/**
 * Returns the currently authenticated user (based on the httpOnly JWT
 * cookie), or 401 if no valid session exists. Used by the client-side
 * Header (and any other component) to know who's logged in and which
 * role they have, without ever trusting client-side state alone.
 */
export async function GET() {
  try {
    const session = getSession();
    if (!session) return fail("Not authenticated", 401);

    await connectDB();
    const user = await User.findById(session.id);
    if (!user || user.status === "suspended") {
      return fail("Not authenticated", 401);
    }

    return ok({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (err) {
    return fail("Could not load session", 500, err.message);
  }
}
