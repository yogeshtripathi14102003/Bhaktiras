"use client";

import { useEffect, useState, useCallback } from "react";
import { Trash2, Mail, Phone, MapPin, CalendarDays } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-marigold/15 text-marigold-dark",
  confirmed: "bg-peacock/10 text-peacock",
  completed: "bg-indigo/10 text-indigo/60",
  cancelled: "bg-maroon/10 text-maroon",
};

export default function AdminKathaBookingsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter ? `/api/katha-bookings?status=${filter}&limit=50` : "/api/katha-bookings?limit=50";
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (json.success) setRows(json.data.items);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id, status) {
    const res = await fetch(`/api/katha-bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (json.success) setRows((r) => r.map((b) => (b._id === id ? json.data : b)));
  }

  async function handleDelete(id) {
    if (!confirm("Delete this booking?")) return;
    const res = await fetch(`/api/katha-bookings/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) setRows((r) => r.filter((b) => b._id !== id));
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-indigo">Katha Booking Management</h1>
      <p className="mt-1 font-body text-sm text-indigo/60">
        {loading ? "Loading…" : "Requests submitted through the Book a Katha form."}
      </p>

      <div className="mt-6 flex gap-2">
        {["", "pending", "confirmed", "completed", "cancelled"].map((s) => (
          <button
            key={s || "all"}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-1.5 font-body text-xs capitalize transition ${
              filter === s ? "border-marigold bg-marigold/15 text-marigold-dark" : "border-indigo/15 text-indigo/60 hover:border-marigold"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {rows.map((b) => (
          <div key={b._id} className="rounded-2xl border border-indigo/10 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold text-indigo">
                  {b.name} — <span className="text-peacock">{b.kathaType || "Katha"}</span>
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-3 font-body text-xs text-indigo/55">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {b.email}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {b.phone}</span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(b.preferredDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  {b.venue && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {b.venue}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={b.status}
                  onChange={(e) => updateStatus(b._id, e.target.value)}
                  className={`rounded-full border-0 px-3 py-1 font-body text-xs font-medium ${STATUS_STYLES[b.status]}`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button onClick={() => handleDelete(b._id)} aria-label="Delete" className="text-maroon/70 hover:text-maroon">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {b.notes && <p className="mt-3 font-body text-sm text-indigo/65">{b.notes}</p>}
          </div>
        ))}

        {!loading && rows.length === 0 && (
          <div className="rounded-2xl border border-indigo/10 bg-white p-10 text-center font-body text-sm text-indigo/45">
            No booking requests yet.
          </div>
        )}
      </div>
    </div>
  );
}
