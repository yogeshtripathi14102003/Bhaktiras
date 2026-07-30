import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { ok, fail, created, paginate, toSlug } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = paginate(searchParams);
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");

    const filter = { status: "published" };
    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    const [items, total] = await Promise.all([
      Blog.find(filter)
        .populate("category", "name slug")
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-content"), // list view skips full body for payload size
      Blog.countDocuments(filter),
    ]);

    return ok({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return fail("Could not load blogs", 500, err.message);
  }
}

export async function POST(req) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    if (!body.title || !body.content) return fail("Title and content are required", 422);

    const blog = await Blog.create({
      ...body,
      slug: body.slug || toSlug(body.title),
      publishedAt: body.status === "published" ? new Date() : null,
    });
    return created(blog);
  } catch (err) {
    return fail("Could not create blog", 500, err.message);
  }
}
