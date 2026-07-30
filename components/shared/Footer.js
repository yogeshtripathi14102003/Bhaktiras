import Link from "next/link";
import { Youtube, Instagram, Facebook, Flame } from "lucide-react";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/kathas", label: "Katha" },
      { href: "/bhajans", label: "Bhajan" },
      { href: "/live-darshan", label: "Live Darshan" },
      { href: "/saints", label: "Saints" },
    ],
  },
  {
    title: "Discover",
    links: [
      { href: "/blog", label: "Spiritual Blog" },
      { href: "/festivals", label: "Festival Calendar" },
      { href: "/events", label: "Events" },
      { href: "/gallery", label: "Gallery" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/donate", label: "Donate" },
      { href: "/book-katha", label: "Book a Katha" },
      { href: "/contact", label: "Contact Us" },
      { href: "/quotes", label: "Daily Quotes" },
      { href: "/dashboard", label: "My Dashboard" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-indigo text-ivory">
      <div className="arch-divider bg-indigo" style={{ backgroundImage: "radial-gradient(circle at 12px 0, transparent 12px, #16233F 13px)" }} />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-marigold" strokeWidth={1.75} />
              <span className="font-display text-2xl font-semibold">Kishori Bhakti</span>
            </div>
            <p className="mt-4 max-w-xs font-body text-sm text-ivory/70">
              A digital home for Katha, Bhajan, Live Darshan and the living culture
              of Braj — carrying Radha Rani&apos;s grace to every devotee, everywhere.
            </p>
            <div className="mt-5 flex gap-4">
              <a href="#" aria-label="YouTube" className="text-ivory/70 hover:text-marigold"><Youtube className="h-5 w-5" /></a>
              <a href="#" aria-label="Instagram" className="text-ivory/70 hover:text-marigold"><Instagram className="h-5 w-5" /></a>
              <a href="#" aria-label="Facebook" className="text-ivory/70 hover:text-marigold"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="section-eyebrow text-marigold">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="font-body text-sm text-ivory/75 hover:text-marigold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-ivory/10 pt-6 text-xs text-ivory/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Kishori Bhakti. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-marigold">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-marigold">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
