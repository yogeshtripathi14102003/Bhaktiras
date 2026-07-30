"use client";

import { useEffect, useState, useCallback } from "react";
import { Trash2, Mail, Phone } from "lucide-react";

const STATUS_STYLES = {
  new: "bg-marigold/15 text-marigold-dark",
  "in-progress": "bg-peacock/10 text-peacock",
  resolved: "bg-indigo/10 text-indigo/60",
};

export default function AdminQueriesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter ? `/api/queries?status=${filter}&limit=50` : "/api/queries?limit=50";
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
    const res = await fetch(`/api/queries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (json.success) setRows((r) => r.map((q) => (q._id === id ? json.data : q)));
  }

  async function handleDelete(id) {
    if (!confirm("Delete this query?")) return;
    const res = await fetch(`/api/queries/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) setRows((r) => r.filter((q) => q._id !== id));
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-indigo">Query Management</h1>
      <p className="mt-1 font-body text-sm text-indigo/60">
        {loading ? "Loading…" : "Messages submitted through the Contact form."}
      </p>

      <div className="mt-6 flex gap-2">
        {["", "new", "in-progress", "resolved"].map((s) => (
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
        {rows.map((q) => (
          <div key={q._id} className="rounded-2xl border border-indigo/10 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold text-indigo">{q.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 font-body text-xs text-indigo/55">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {q.email}</span>
                  {q.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {q.phone}</span>}
                  <span>{new Date(q.createdAt).toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={q.status}
                  onChange={(e) => updateStatus(q._id, e.target.value)}
                  className={`rounded-full border-0 px-3 py-1 font-body text-xs font-medium ${STATUS_STYLES[q.status]}`}
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <button onClick={() => handleDelete(q._id)} aria-label="Delete" className="text-maroon/70 hover:text-maroon">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {q.subject && <p className="mt-3 font-body text-sm font-medium text-indigo/80">{q.subject}</p>}
            <p className="mt-1 font-body text-sm text-indigo/65">{q.message}</p>
          </div>
        ))}

        {!loading && rows.length === 0 && (
          <div className="rounded-2xl border border-indigo/10 bg-white p-10 text-center font-body text-sm text-indigo/45">
            No queries yet.
          </div>
        )}
      </div>
    </div>
  );
}
