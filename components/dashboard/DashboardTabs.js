"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ListMusic, Ticket, Receipt, Bell, X, Check } from "lucide-react";
import PlaceholderMedia from "@/components/shared/PlaceholderMedia";

const TABS = [
  { key: "favorites", icon: Heart, label: "Favorites" },
  { key: "playlists", icon: ListMusic, label: "Playlists" },
  { key: "events", icon: Ticket, label: "Event Registrations" },
  { key: "donations", icon: Receipt, label: "Donation History" },
  { key: "notifications", icon: Bell, label: "Notifications" },
];

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const dateFmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export default function DashboardTabs({ favoriteBhajans, favoriteSaints, playlists, donations, registrations, notifications }) {
  const [active, setActive] = useState("favorites");
  const [bhajans, setBhajans] = useState(favoriteBhajans);
  const [saints, setSaints] = useState(favoriteSaints);
  const [notifs, setNotifs] = useState(notifications);
  const unreadCount = notifs.filter((n) => !n.isRead).length;

  async function removeFavorite(type, id) {
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    });
    if (type === "bhajan") setBhajans((b) => b.filter((x) => x._id !== id));
    if (type === "saint") setSaints((s) => s.filter((x) => x._id !== id));
  }

  async function markRead(id) {
    setNotifs((list) => list.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    await fetch(`/api/notifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: true }),
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 font-body text-sm transition ${
              active === tab.key
                ? "border-marigold bg-marigold/15 text-marigold-dark"
                : "border-indigo/15 bg-white text-indigo hover:border-marigold hover:text-marigold-dark"
            }`}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
            {tab.key === "notifications" && unreadCount > 0 && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-maroon text-[10px] text-ivory">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {active === "favorites" && (
        <div className="mt-8 space-y-10">
          <section>
            <h2 className="font-display text-xl font-semibold text-indigo">Favorite Bhajans</h2>
            {bhajans.length ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {bhajans.map((b) => (
                  <div key={b._id} className="flex items-center gap-3 rounded-xl border border-indigo/10 bg-white p-3">
                    <PlaceholderMedia seed={b._id} type="bhajan" className="h-14 w-14 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <Link href={`/bhajans/${b.slug}`} className="line-clamp-2 font-body text-sm text-indigo/80 hover:text-marigold-dark">
                        {b.title}
                      </Link>
                    </div>
                    <button onClick={() => removeFavorite("bhajan", b._id)} aria-label="Remove favorite" className="shrink-0 text-indigo/30 hover:text-maroon">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 font-body text-sm text-indigo/55">
                No favorite bhajans yet — open any bhajan and tap &ldquo;Favorite&rdquo; to save it here.
              </p>
            )}
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-indigo">Favorite Saints</h2>
            {saints.length ? (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {saints.map((s) => (
                  <div key={s._id} className="relative text-center">
                    <button
                      onClick={() => removeFavorite("saint", s._id)}
                      aria-label="Remove favorite"
                      className="absolute right-2 top-0 rounded-full bg-white/90 p-1 text-indigo/40 hover:text-maroon"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <Link href={`/saints/${s.slug}`}>
                      <PlaceholderMedia seed={s._id} type="saint" className="mx-auto aspect-square w-20 rounded-full" />
                      <p className="mt-2 font-body text-xs text-indigo/70">{s.name}</p>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 font-body text-sm text-indigo/55">
                No favorite saints yet — visit the Saints page to follow one.
              </p>
            )}
          </section>
        </div>
      )}

      {active === "playlists" && (
        <div className="mt-8 rounded-2xl border border-indigo/10 bg-white p-6">
          {playlists.length ? (
            <ul className="divide-y divide-indigo/10">
              {playlists.map((p) => (
                <li key={p._id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-body text-sm font-medium text-indigo">{p.name}</p>
                    <p className="font-body text-xs text-indigo/50">{p.bhajans?.length || 0} bhajans</p>
                  </div>
                  <span className="rounded-full bg-peacock/10 px-3 py-1 text-[11px] font-medium text-peacock">
                    {p.isPublic ? "Public" : "Private"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-body text-sm text-indigo/55">
              No playlists yet — build one from the Bhajan Library.
            </p>
          )}
        </div>
      )}

      {active === "events" && (
        <div className="mt-8 rounded-2xl border border-indigo/10 bg-white p-6">
          {registrations.length ? (
            <ul className="divide-y divide-indigo/10">
              {registrations.map((r) => (
                <li key={r._id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <Link href={`/events/${r.event?.slug}`} className="font-body text-sm font-medium text-indigo hover:text-marigold-dark">
                      {r.event?.title || "Event"}
                    </Link>
                    <p className="font-body text-xs text-indigo/50">
                      {r.event?.startDate ? dateFmt(r.event.startDate) : ""} {r.event?.venue ? `· ${r.event.venue}` : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                      r.attended ? "bg-peacock/10 text-peacock" : "bg-marigold/15 text-marigold-dark"
                    }`}
                  >
                    {r.attended ? "Attended" : "Registered"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-body text-sm text-indigo/55">
              No event registrations yet. Visit the Events page to join a gathering.
            </p>
          )}
        </div>
      )}

      {active === "donations" && (
        <div className="mt-8 rounded-2xl border border-indigo/10 bg-white p-6">
          {donations.length ? (
            <ul className="divide-y divide-indigo/10">
              {donations.map((d) => (
                <li key={d._id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="font-body text-sm font-medium text-indigo">{d.purpose || "General seva"}</p>
                    <p className="font-body text-xs text-indigo/50">{dateFmt(d.createdAt)} · {d.method?.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-semibold text-indigo">{inr.format(d.amount)}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase ${
                        d.status === "success"
                          ? "bg-peacock/10 text-peacock"
                          : d.status === "failed"
                            ? "bg-maroon/10 text-maroon"
                            : "bg-marigold/15 text-marigold-dark"
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-body text-sm text-indigo/55">
              No donations yet. Visit the Donate page to support seva in Braj.
            </p>
          )}
        </div>
      )}

      {active === "notifications" && (
        <div className="mt-8 rounded-2xl border border-indigo/10 bg-white p-6">
          {notifs.length ? (
            <ul className="divide-y divide-indigo/10">
              {notifs.map((n) => (
                <li key={n._id} className={`flex items-start justify-between gap-3 py-3 ${!n.isRead ? "bg-marigold/5" : ""}`}>
                  <div>
                    <p className="font-body text-sm font-medium text-indigo">{n.title}</p>
                    {n.message && <p className="mt-0.5 font-body text-xs text-indigo/55">{n.message}</p>}
                    <p className="mt-1 font-mono text-[10px] text-indigo/40">{dateFmt(n.createdAt)}</p>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={() => markRead(n._id)}
                      className="flex shrink-0 items-center gap-1 rounded-full border border-indigo/15 px-2.5 py-1 text-[11px] text-indigo hover:border-marigold hover:text-marigold-dark"
                    >
                      <Check className="h-3 w-3" /> Mark read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-body text-sm text-indigo/55">No notifications yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
