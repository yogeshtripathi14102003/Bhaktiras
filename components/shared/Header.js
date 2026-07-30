"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Menu, X, Flame, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";

const NAV_LINKS = [
  { href: "/kathas", label: "Katha" },
  { href: "/bhajans", label: "Bhajan" },
  { href: "/live-darshan", label: "Live Darshan" },
  { href: "/saints", label: "Saints" },
  { href: "/blog", label: "Blog" },
  { href: "/festivals", label: "Festivals" },
  { href: "/events", label: "Events" },
];

/**
 * Session-aware account menu. Every claim about "who's logged in" comes
 * from GET /api/auth/me, which itself only trusts the httpOnly JWT
 * cookie verified server-side — never from anything stored client-side.
 */
function AccountMenu({ variant = "desktop" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(undefined); // undefined = loading, null = logged out
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadSession() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const json = await res.json();
        if (!cancelled) setUser(json.success ? json.data : null);
      } catch {
        if (!cancelled) setUser(null);
      }
    }
    loadSession();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  if (user === undefined) {
    return <div className="h-8 w-16 animate-pulse rounded-full bg-ivory/10" />;
  }

  if (!user) {
    return (
      <div className={variant === "desktop" ? "flex items-center gap-4" : "flex flex-col gap-3"}>
        <Link href="/login" className="font-body text-sm text-ivory/80 hover:text-marigold">
          Login
        </Link>
        <Link
          href="/signup"
          className="font-body text-sm text-ivory/80 hover:text-marigold"
        >
          Sign up
        </Link>
      </div>
    );
  }

  const dashboardHref = user.role === "admin" ? "/admin" : "/dashboard";

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 font-body text-sm text-ivory">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-marigold/20 text-xs font-semibold text-marigold">
            {user.name?.[0]?.toUpperCase() || "U"}
          </span>
          {user.name}
          <span className="rounded-full bg-marigold/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-marigold">
            {user.role}
          </span>
        </div>
        <Link href={dashboardHref} className="font-body text-ivory/85 hover:text-marigold">
          {user.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
        </Link>
        <button onClick={handleLogout} className="text-left font-body text-ivory/85 hover:text-marigold">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-ivory/15 py-1 pl-1 pr-3 text-ivory/90 hover:border-marigold"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-marigold/20 text-xs font-semibold text-marigold">
          {user.name?.[0]?.toUpperCase() || "U"}
        </span>
        <span className="font-body text-sm">{user.name}</span>
        <span className="rounded-full bg-marigold/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-marigold">
          {user.role}
        </span>
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-indigo/10 bg-white py-1 shadow-lg">
            <Link
              href={dashboardHref}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 font-body text-sm text-indigo hover:bg-ivory"
            >
              {user.role === "admin" ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <LayoutDashboard className="h-4 w-4" />
              )}
              {user.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 font-body text-sm text-maroon hover:bg-ivory"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-marigold/20 bg-indigo/95 backdrop-blur supports-[backdrop-filter]:bg-indigo/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Flame className="h-6 w-6 text-marigold animate-flicker" strokeWidth={1.75} />
          <span className="font-display text-2xl font-semibold tracking-wide text-ivory">
            Kishori Bhakti
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm text-ivory/80 transition hover:text-marigold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/search" aria-label="Search" className="text-ivory/80 hover:text-marigold">
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/donate"
            className="rounded-full bg-marigold px-5 py-2 font-body text-sm font-semibold text-indigo transition hover:bg-marigold-light"
          >
            Donate
          </Link>
          <AccountMenu variant="desktop" />
        </div>

        <button
          className="text-ivory lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-marigold/20 bg-indigo px-4 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-body text-ivory/85 hover:text-marigold"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/search" onClick={() => setOpen(false)} className="font-body text-ivory/85 hover:text-marigold">
              Search
            </Link>
            <Link
              href="/donate"
              onClick={() => setOpen(false)}
              className="w-fit rounded-full bg-marigold px-5 py-2 font-body text-sm font-semibold text-indigo"
            >
              Donate
            </Link>
            <div className="border-t border-marigold/20 pt-4">
              <AccountMenu variant="mobile" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
