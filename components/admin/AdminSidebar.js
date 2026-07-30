"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Music2, PlayCircle, BookOpen, Flame,
  CalendarHeart, Ticket, ImageIcon, Quote, Wallet, Radio, Search, Settings,
  MessageSquare, CalendarClock,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/bhajans", label: "Bhajans", icon: Music2 },
  { href: "/admin/kathas", label: "Kathas", icon: PlayCircle },
  { href: "/admin/katha-bookings", label: "Katha Bookings", icon: CalendarClock },
  { href: "/admin/blogs", label: "Blogs", icon: BookOpen },
  { href: "/admin/saints", label: "Saints", icon: Flame },
  { href: "/admin/festivals", label: "Festivals", icon: CalendarHeart },
  { href: "/admin/events", label: "Events", icon: Ticket },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/quotes", label: "Quotes", icon: Quote },
  { href: "/admin/donations", label: "Donations", icon: Wallet },
  { href: "/admin/live-streams", label: "Live Streams", icon: Radio },
  { href: "/admin/queries", label: "Queries", icon: MessageSquare },
  { href: "/admin/settings", label: "SEO & Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-ivory/10 bg-indigo lg:block">
      <div className="px-6 py-6">
        <span className="font-display text-xl font-semibold text-ivory">Kishori Bhakti</span>
        <p className="font-mono text-[10px] uppercase tracking-widest text-marigold">Admin CMS</p>
      </div>
      <nav className="space-y-1 px-3">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm transition ${
                active ? "bg-marigold/15 text-marigold" : "text-ivory/70 hover:bg-ivory/5 hover:text-ivory"
              }`}
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
