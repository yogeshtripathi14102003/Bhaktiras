import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { ok, fail } from "@/lib/utils";
import { getSession, requireRole } from "@/lib/auth";

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const blog = await Blog.findOne({
      $or: [{ _id: params.id.match(/^[0-9a-f]{24}$/) ? params.id : null }, { slug: params.id }],
    }).populate("category", "name slug");
    if (!blog) return fail("Blog post not found", 404);

    blog.views += 1;
    await blog.save();

    return ok(blog);
  } catch (err) {
    return fail("Could not load blog post", 500, err.message);
  }
}

export async function PUT(req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const body = await req.json();
    const blog = await Blog.findByIdAndUpdate(params.id, body, { new: true });
    if (!blog) return fail("Blog post not found", 404);

    return ok(blog);
  } catch (err) {
    return fail("Could not update blog post", 500, err.message);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const session = getSession();
    const guard = requireRole(session, ["admin"]);
    if (!guard.ok) return fail(guard.message, guard.status);

    await connectDB();
    const blog = await Blog.findByIdAndDelete(params.id);
    if (!blog) return fail("Blog post not found", 404);

    return ok({ deleted: true });
  } catch (err) {
    return fail("Could not delete blog post", 500, err.message);
  }
}
