// import { connectDB } from "@/lib/mongodb";
// import Bhajan from "@/models/Bhajan";
// import Katha from "@/models/Katha";
// import Blog from "@/models/Blog";
// import Saint from "@/models/Saint";
// import Festival from "@/models/Festival";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kishoribhakti.org";

export default async function sitemap() {
  const staticRoutes = [
    "", "/bhajans", "/kathas", "/live-darshan", "/saints", "/blog",
    "/festivals", "/events", "/gallery", "/donate", "/quotes",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.7,
  }));

  // Once MongoDB is connected, append dynamic entries for every
  // published bhajan / katha / blog / saint / festival slug, e.g:
  //
  // await connectDB();
  // const blogs = await Blog.find({ status: "published" }).select("slug updatedAt");
  // const blogRoutes = blogs.map((b) => ({
  //   url: `${SITE_URL}/blog/${b.slug}`,
  //   lastModified: b.updatedAt,
  //   changeFrequency: "weekly",
  //   priority: 0.6,
  // }));

  return [...staticRoutes];
}
