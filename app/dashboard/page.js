import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Playlist from "@/models/Playlist";
import Donation from "@/models/Donation";
import Notification from "@/models/Notification";
import { EventRegistration } from "@/models/Event";
import { getSession } from "@/lib/auth";
import DashboardTabs from "@/components/dashboard/DashboardTabs";

export const metadata = { title: "My Dashboard" };

// Server-side gate: the middleware already blocks unauthenticated
// /dashboard requests, but this page checks its own session too so
// it's safe even if rendered directly. Admins are sent to their own
// dashboard rather than seeing the devotee view.
export default async function DashboardPage() {
  const session = getSession();
  if (!session) redirect("/login");
  if (session.role === "admin") redirect("/admin");

  await connectDB();

  const [user, playlists, donations, registrations, notifications] = await Promise.all([
    User.findById(session.id)
      .populate("favorites.bhajans", "title slug")
      .populate("favorites.saints", "name slug")
      .lean(),
    Playlist.find({ user: session.id }).sort({ createdAt: -1 }).lean(),
    Donation.find({ user: session.id }).sort({ createdAt: -1 }).limit(20).lean(),
    EventRegistration.find({ user: session.id }).populate("event", "title slug startDate venue").sort({ createdAt: -1 }).lean(),
    Notification.find({ $or: [{ user: session.id }, { user: null }] }).sort({ createdAt: -1 }).limit(30).lean(),
  ]);

  if (!user) redirect("/login");

  // Plain-object props for the client component (Mongo ObjectIds -> strings).
  const toPlain = (arr) => JSON.parse(JSON.stringify(arr));

  return (
    <div className="bg-ivory">
      <div className="border-b border-indigo/10 bg-indigo py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="section-eyebrow text-marigold">My Dashboard</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-semibold text-ivory sm:text-4xl">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-marigold/15 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-marigold">
              <ShieldCheck className="h-3 w-3" /> {user.role}
            </span>
          </div>
          <p className="mt-1 font-body text-sm text-ivory/60">{user.email}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <DashboardTabs
          favoriteBhajans={toPlain(user.favorites?.bhajans || [])}
          favoriteSaints={toPlain(user.favorites?.saints || [])}
          playlists={toPlain(playlists)}
          donations={toPlain(donations)}
          registrations={toPlain(registrations)}
          notifications={toPlain(notifications)}
        />
      </div>
    </div>
  );
}
