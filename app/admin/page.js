import { Users, Music2, PlayCircle, BookOpen, Wallet, TrendingUp, MessageSquare, CalendarClock, Radio } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Bhajan from "@/models/Bhajan";
import Katha from "@/models/Katha";
import Blog from "@/models/Blog";
import Donation from "@/models/Donation";
import Query from "@/models/Query";
import KathaBooking from "@/models/KathaBooking";
import LiveStream from "@/models/LiveStream";

export const metadata = { title: "Dashboard | Admin" };

async function getStats() {
  await connectDB();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    newUsersToday,
    topBhajan,
    topKatha,
    topBlog,
    donationAgg,
    newQueries,
    pendingBookings,
    liveNow,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: startOfDay } }),
    Bhajan.findOne().sort({ playCount: -1 }).select("playCount"),
    Katha.findOne().sort({ views: -1 }).select("views"),
    Blog.findOne().sort({ views: -1 }).select("views"),
    Donation.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
    Query.countDocuments({ status: "new" }),
    KathaBooking.countDocuments({ status: "pending" }),
    LiveStream.countDocuments({ isLive: true }),
  ]);

  const donations = donationAgg[0] || { total: 0, count: 0 };
  const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  return [
    { label: "Total Users", value: totalUsers.toLocaleString("en-IN"), icon: Users, href: "/admin/users" },
    { label: "New Users Today", value: newUsersToday.toLocaleString("en-IN"), icon: TrendingUp },
    { label: "Top Bhajan Plays", value: (topBhajan?.playCount || 0).toLocaleString("en-IN"), icon: Music2, href: "/admin/bhajans" },
    { label: "Top Katha Views", value: (topKatha?.views || 0).toLocaleString("en-IN"), icon: PlayCircle, href: "/admin/kathas" },
    { label: "Most Viewed Blog", value: (topBlog?.views || 0).toLocaleString("en-IN"), icon: BookOpen, href: "/admin/blogs" },
    { label: "Donations (Confirmed)", value: inr.format(donations.total || 0), icon: Wallet, href: "/admin/donations" },
    { label: "New Queries", value: newQueries.toLocaleString("en-IN"), icon: MessageSquare, href: "/admin/queries", alert: newQueries > 0 },
    { label: "Pending Katha Bookings", value: pendingBookings.toLocaleString("en-IN"), icon: CalendarClock, href: "/admin/katha-bookings", alert: pendingBookings > 0 },
    { label: "Live Streams Now", value: liveNow.toLocaleString("en-IN"), icon: Radio, href: "/admin/live-streams", alert: liveNow > 0 },
  ];
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-indigo">Dashboard</h1>
      <p className="mt-1 font-body text-sm text-indigo/60">Site-wide analytics at a glance — live from the database.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Card = (
            <div
              key={stat.label}
              className={`rounded-2xl border bg-white p-6 transition ${
                stat.alert ? "border-marigold/50 ring-1 ring-marigold/30" : "border-indigo/10"
              } ${stat.href ? "hover:-translate-y-0.5 hover:shadow-md" : ""}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.alert ? "text-marigold-dark" : "text-peacock"}`} />
              <p className="mt-4 font-display text-2xl font-semibold text-indigo">{stat.value}</p>
              <p className="mt-1 font-body text-xs text-indigo/55">{stat.label}</p>
            </div>
          );
          return stat.href ? (
            <a key={stat.label} href={stat.href}>{Card}</a>
          ) : (
            Card
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-indigo/10 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-indigo">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="/admin/bhajans" className="rounded-full bg-marigold px-4 py-2 font-body text-sm font-semibold text-indigo hover:bg-marigold-light">+ Add Bhajan</a>
          <a href="/admin/kathas" className="rounded-full border border-indigo/15 px-4 py-2 font-body text-sm text-indigo hover:border-marigold">+ Add Katha</a>
          <a href="/admin/blogs" className="rounded-full border border-indigo/15 px-4 py-2 font-body text-sm text-indigo hover:border-marigold">+ Add Blog</a>
          <a href="/admin/events" className="rounded-full border border-indigo/15 px-4 py-2 font-body text-sm text-indigo hover:border-marigold">+ Add Event</a>
          <a href="/admin/live-streams" className="rounded-full border border-indigo/15 px-4 py-2 font-body text-sm text-indigo hover:border-marigold">+ Go Live</a>
        </div>
      </div>
    </div>
  );
}
