"use client";

import { useEffect, useState, useCallback } from "react";
import { Trash2 } from "lucide-react";

export default function AdminUsersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = useCallback(async (query) => {
    setLoading(true);
    try {
      const url = query ? `/api/users?limit=50&q=${encodeURIComponent(query)}` : "/api/users?limit=50";
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (json.success) setRows(json.data.items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load("");
  }, [load]);

  async function updateUser(id, updates) {
    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (json.success) setRows((r) => r.map((u) => (u._id === id ? json.data : u)));
    else alert(json.message || "Could not update user");
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) setRows((r) => r.filter((u) => u._id !== id));
    else alert(json.message || "Could not delete user");
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-indigo">Manage Users</h1>
      <p className="mt-1 font-body text-sm text-indigo/60">
        {loading ? "Loading…" : `${rows.length} users — change role/status inline, updates are live.`}
      </p>

      <div className="mt-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(q)}
          placeholder="Search by name or email, press Enter"
          className="w-full max-w-sm rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-indigo/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-indigo/10 font-body text-xs uppercase tracking-wide text-indigo/50">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u._id} className="border-b border-indigo/5 font-body text-sm text-indigo/80 last:border-0 hover:bg-ivory/60">
                  <td className="px-5 py-3">{u.name}</td>
                  <td className="px-5 py-3">{u.email}</td>
                  <td className="px-5 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => updateUser(u._id, { role: e.target.value })}
                      className="rounded-full border border-indigo/15 px-2.5 py-1 text-xs"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={u.status}
                      onChange={(e) => updateUser(u._id, { status: e.target.value })}
                      className={`rounded-full border-0 px-3 py-1 text-xs font-medium ${
                        u.status === "active" ? "bg-peacock/10 text-peacock" : "bg-maroon/10 text-maroon"
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-indigo/50">
                    {new Date(u.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleDelete(u._id, u.name)} aria-label="Delete" className="text-maroon/70 hover:text-maroon">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center font-body text-sm text-indigo/45">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
