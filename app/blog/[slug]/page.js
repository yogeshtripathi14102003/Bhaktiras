import { notFound } from "next/navigation";
import { Share2, Clock } from "lucide-react";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_BLOGS } from "@/lib/sampleData";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

async function getBlogData(slug) {
  try {
    await connectDB();
    const blog = await Blog.findOne({ slug }).populate("category", "name slug").lean();
    if (blog) {
      const related = await Blog.find({ slug: { $ne: slug }, status: "published" })
        .select("-content")
        .sort({ publishedAt: -1 })
        .limit(4)
        .lean();
      return { blog, related };
    }
  } catch {
    // fall through to sample data below
  }
  const sample = SAMPLE_BLOGS.find((b) => b.slug === slug);
  return sample ? { blog: sample, related: SAMPLE_BLOGS.filter((b) => b.slug !== slug) } : { blog: null, related: [] };
}

export async function generateMetadata({ params }) {
  const { blog } = await getBlogData(params.slug);
  if (!blog) return {};
  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: { title: blog.title, description: blog.excerpt },
  };
}

export default async function BlogDetailPage({ params }) {
  const { blog, related } = await getBlogData(params.slug);
  if (!blog) notFound();

  return (
    <article className="bg-ivory">
      <PlaceholderMedia seed={blog._id} type="blog" className="aspect-[21/9] w-full" iconClassName="h-14 w-14" />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <span className="text-[11px] font-medium uppercase tracking-wide text-peacock">
          {blog.category?.name}
        </span>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-indigo">{blog.title}</h1>
        <div className="mt-4 flex items-center justify-between border-b border-indigo/10 pb-4">
          <span className="flex items-center gap-1.5 font-body text-xs text-indigo/50">
            <Clock className="h-3.5 w-3.5" /> {blog.readTime || 5} min read
          </span>
          <button className="flex items-center gap-1.5 font-body text-xs text-peacock hover:underline">
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
        </div>

        <div
          className="prose prose-indigo mt-8 max-w-none font-body text-[15px] leading-8 text-indigo/80"
          dangerouslySetInnerHTML={{ __html: blog.content || `<p>${blog.excerpt || ""}</p>` }}
        />

        <div className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-indigo">Related Articles</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <a key={r._id} href={`/blog/${r.slug}`} className="flex gap-3 rounded-xl border border-indigo/10 bg-white p-3 transition hover:shadow-md">
                <PlaceholderMedia seed={r._id} type="blog" className="h-16 w-24 shrink-0 rounded-lg" />
                <p className="line-clamp-3 font-body text-sm text-indigo/80">{r.title}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
