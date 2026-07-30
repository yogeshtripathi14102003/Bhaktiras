import Link from "next/link";
import { Clock } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";
import { SAMPLE_BLOGS } from "@/lib/sampleData";

export default function LatestBlogs() {
  return (
    <section className="bg-peacock/5 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Spiritual Blog" title="Latest from the Blog" description="Stories, teachings and reflections from Braj." />
          <Link href="/blog" className="font-body text-sm text-peacock hover:underline">
            Read all articles →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {SAMPLE_BLOGS.map((blog) => (
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
                  <Clock className="h-3.5 w-3.5" /> {blog.readTime} min read
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
