import Link from "next/link";
import { Clock } from "lucide-react";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_BLOGS } from "@/lib/sampleData";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export const metadata = {
  title: "Spiritual Blog",
  description: "Stories, teachings and reflections on Braj culture, Vaishnav philosophy and life in Vrindavan.",
};

async function getBlogs() {
  try {
    await connectDB();
    const items = await Blog.find({ status: "published" })
      .populate("category", "name slug")
      .sort({ publishedAt: -1, createdAt: -1 })
      .select("-content")
      .lean();
    return items.length ? items : SAMPLE_BLOGS;
  } catch {
    return SAMPLE_BLOGS;
  }
}

export default async function BlogListPage() {
  const blogs = await getBlogs();

  return (
    <div className="bg-ivory">
      <div className="border-b border-indigo/10 bg-indigo py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="section-eyebrow text-marigold">Spiritual Blog</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ivory sm:text-5xl">Blog</h1>
          <p className="mt-3 max-w-xl font-body text-sm text-ivory/70 sm:text-base">
            Stories, teachings and reflections from Braj.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blog/${blog.slug}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <PlaceholderMedia seed={blog._id} type="blog" className="aspect-[16/10] w-full" />
              <div className="p-5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-peacock">
                  {blog.category?.name}
                </span>
                <p className="mt-2 line-clamp-2 font-display text-xl font-semibold text-indigo">{blog.title}</p>
                <p className="mt-2 line-clamp-2 font-body text-sm text-indigo/60">{blog.excerpt}</p>
                <span className="mt-3 flex items-center gap-1 text-xs text-indigo/45">
                  <Clock className="h-3.5 w-3.5" /> {blog.readTime || 5} min read
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
