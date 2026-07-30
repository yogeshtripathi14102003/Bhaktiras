import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { getSession } from "@/lib/auth";
import { ok, fail } from "@/lib/utils";

export async function PATCH(req, { params }) {
  try {
    const session = getSession();
    if (!session) return fail("Not authenticated", 401);

    await connectDB();
    const notification = await Notification.findById(params.id);
    if (!notification) return fail("Notification not found", 404);

    // Users may only mark their own personal notifications (or public
    // broadcasts) as read — never someone else's.
    if (notification.user && notification.user.toString() !== session.id) {
      return fail("Not authorized", 403);
    }

    const body = await req.json().catch(() => ({}));
    notification.isRead = body.isRead ?? true;
    await notification.save();

    return ok(notification);
  } catch (err) {
    return fail("Could not update notification", 500, err.message);
  }
}
