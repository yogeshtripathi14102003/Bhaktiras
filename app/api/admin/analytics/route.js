import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Bhajan from "@/models/Bhajan";
import Katha from "@/models/Katha";
import Blog from "@/models/Blog";
import Donation from "@/models/Donation";
import { ok, fail } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      newUsersToday,
      topBhajans,
      topKathas,
      topBlogs,
      donationAgg,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfDay } }),
      Bhajan.find().sort({ playCount: -1 }).limit(5).select("title playCount"),
      Katha.find().sort({ views: -1 }).limit(5).select("title views"),
      Blog.find().sort({ views: -1 }).limit(5).select("title views"),
      Donation.aggregate([
        { $match: { status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
    ]);

    return ok({
      totalUsers,
      newUsersToday,
      topBhajans,
      topKathas,
      topBlogs,
      donations: donationAgg[0] || { total: 0, count: 0 },
    });
  } catch (err) {
    return fail("Could not load analytics", 500, err.message);
  }
}
