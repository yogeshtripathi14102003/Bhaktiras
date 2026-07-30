"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, QrCode } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-marigold/15 text-marigold-dark",
  success: "bg-peacock/10 text-peacock",
  failed: "bg-maroon/10 text-maroon",
  refunded: "bg-indigo/10 text-indigo/60",
};

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function UpiSettingsPanel() {
  const [form, setForm] = useState({ upiId: "", upiPayeeName: "Kishori Bhakti", qrImageUrl: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data.donation) {
          setForm({
            upiId: json.data.donation.upiId || "",
            upiPayeeName: json.data.donation.upiPayeeName || "Kishori Bhakti",
            qrImageUrl: json.data.donation.qrImageUrl || "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donation: form }),
      });
      const json = await res.json();
      if (json.success) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  const upiPreviewLink = form.upiId
    ? `upi://pay?pa=${encodeURIComponent(form.upiId)}&pn=${encodeURIComponent(form.upiPayeeName || "Kishori Bhakti")}&cu=INR`
    : "";
  const autoQr = upiPreviewLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiPreviewLink)}`
    : null;

  return (
    <form onSubmit={handleSave} className="rounded-2xl border border-indigo/10 bg-white p-6">
      <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-indigo">
        <QrCode className="h-5 w-5 text-peacock" /> UPI Donation Settings
      </h2>
      <p className="mt-1 font-body text-xs text-indigo/55">
        Shown on the public Donate page. Leave QR Image URL blank to auto-generate a QR from the UPI ID.
      </p>

      {loading ? (
        <p className="mt-4 font-body text-sm text-indigo/50">Loading…</p>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <div>
              <label className="font-body text-xs text-indigo/60">UPI ID</label>
              <input
                value={form.upiId}
                onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                placeholder="kishoribhakti@upi"
                className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold"
              />
            </div>
            <div>
              <label className="font-body text-xs text-indigo/60">Payee Name</label>
              <input
                value={form.upiPayeeName}
                onChange={(e) => setForm({ ...form, upiPayeeName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold"
              />
            </div>
            <div>
              <label className="font-body text-xs text-indigo/60">Custom QR Image URL (optional)</label>
              <input
                value={form.qrImageUrl}
                onChange={(e) => setForm({ ...form, qrImageUrl: e.target.value })}
                placeholder="https://…"
                className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-marigold px-5 py-2.5 font-body text-sm font-semibold text-indigo hover:bg-marigold-light disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save UPI Settings"}
            </button>
            {saved && <p className="font-body text-xs text-peacock">Saved — now live on the Donate page.</p>}
          </div>

          <div className="flex flex-col items-center justify-start gap-2">
            <p className="font-body text-xs text-indigo/50">Preview</p>
            {form.qrImageUrl || autoQr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.qrImageUrl || autoQr} alt="UPI QR preview" className="h-32 w-32 rounded-lg border border-indigo/10" />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-lg border border-dashed border-indigo/20 font-body text-[10px] text-indigo/40">
                Enter UPI ID
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}

export default function AdminDonationsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRaised, setTotalRaised] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/donations?limit=50", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setRows(json.data.items);
        setTotalRaised(json.data.items.filter((d) => d.status === "success").reduce((sum, d) => sum + d.amount, 0));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id, status) {
    const res = await fetch(`/api/donations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (json.success) {
      setRows((r) => r.map((d) => (d._id === id ? json.data : d)));
      load();
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this donation record?")) return;
    const res = await fetch(`/api/donations/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) setRows((r) => r.filter((d) => d._id !== id));
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-indigo">Donation Management</h1>
      <p className="mt-1 font-body text-sm text-indigo/60">
        {loading ? "Loading…" : `Total confirmed: ${inr.format(totalRaised)} across ${rows.filter((d) => d.status === "success").length} donations.`}
      </p>

      <div className="mt-6">
        <UpiSettingsPanel />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-indigo/10 bg-white">
        <div className="border-b border-indigo/10 p-5">
          <h2 className="font-display text-xl font-semibold text-indigo">All Donations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-indigo/10 font-body text-xs uppercase tracking-wide text-indigo/50">
                <th className="px-5 py-3 font-medium">Donor</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Method</th>
                <th className="px-5 py-3 font-medium">Purpose</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d._id} className="border-b border-indigo/5 font-body text-sm text-indigo/80 last:border-0 hover:bg-ivory/60">
                  <td className="px-5 py-3">
                    <p>{d.donorName || "Anonymous"}</p>
                    {d.donorEmail && <p className="font-mono text-[11px] text-indigo/45">{d.donorEmail}</p>}
                  </td>
                  <td className="px-5 py-3 font-semibold">{inr.format(d.amount)}</td>
                  <td className="px-5 py-3 uppercase">{d.method}</td>
                  <td className="px-5 py-3">{d.purpose}</td>
                  <td className="px-5 py-3">{new Date(d.createdAt).toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3">
                    <select
                      value={d.status}
                      onChange={(e) => updateStatus(d._id, e.target.value)}
                      className={`rounded-full border-0 px-3 py-1 font-body text-xs font-medium ${STATUS_STYLES[d.status]}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleDelete(d._id)} className="font-body text-xs text-maroon hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center font-body text-sm text-indigo/45">
                    No donations recorded yet.
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
