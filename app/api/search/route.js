import { connectDB } from "@/lib/mongodb";
import Bhajan from "@/models/Bhajan";
import Katha from "@/models/Katha";
import Blog from "@/models/Blog";
import Saint from "@/models/Saint";
import Festival from "@/models/Festival";
import Event from "@/models/Event";
import { ok, fail } from "@/lib/utils";

// Global search across all content modules, per the SRS "Global Search" module.
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    if (!q || q.trim().length < 2) return fail("Enter at least 2 characters to search", 422);

    await connectDB();
    const textFilter = { $text: { $search: q } };
    const limit = 6;

    const [bhajans, kathas, blogs, saints, festivals, events] = await Promise.all([
      Bhajan.find({ ...textFilter, status: "published" }).limit(limit).select("title slug thumbnail"),
      Katha.find({ ...textFilter, status: "published" }).limit(limit).select("title slug thumbnail"),
      Blog.find({ ...textFilter, status: "published" }).limit(limit).select("title slug coverImage"),
      Saint.find({ ...textFilter, status: "published" }).limit(limit).select("name slug photo"),
      Festival.find({ name: new RegExp(q, "i"), status: "published" }).limit(limit).select("name slug banner date"),
      Event.find({ title: new RegExp(q, "i") }).limit(limit).select("title slug banner startDate"),
    ]);

    return ok({ bhajans, kathas, blogs, saints, festivals, events });
  } catch (err) {
    return fail("Search failed", 500, err.message);
  }
}
