"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    siteName: "",
    contactEmail: "",
    contactPhone: "",
    facebook: "",
    instagram: "",
    youtube: "",
    twitter: "",
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          const s = json.data;
          setForm({
            siteName: s.siteName || "",
            contactEmail: s.contactEmail || "",
            contactPhone: s.contactPhone || "",
            facebook: s.socialLinks?.facebook || "",
            instagram: s.socialLinks?.instagram || "",
            youtube: s.socialLinks?.youtube || "",
            twitter: s.socialLinks?.twitter || "",
            maintenanceMode: s.maintenanceMode || false,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const { facebook, instagram, youtube, twitter, ...rest } = form;
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rest, socialLinks: { facebook, instagram, youtube, twitter } }),
      });
      const json = await res.json();
      if (json.success) setSaved(true);
      else alert(json.message || "Could not save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-indigo">Site Settings</h1>
      <p className="mt-1 font-body text-sm text-indigo/60">Site-wide name, contact info and social links.</p>

      {loading ? (
        <p className="mt-8 font-body text-sm text-indigo/50">Loading…</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-5 rounded-2xl border border-indigo/10 bg-white p-6">
          {[
            ["siteName", "Site Name"],
            ["contactEmail", "Contact Email"],
            ["contactPhone", "Contact Phone"],
            ["facebook", "Facebook URL"],
            ["instagram", "Instagram URL"],
            ["youtube", "YouTube URL"],
            ["twitter", "Twitter / X URL"],
          ].map(([key, label]) => (
            <div key={key}>
              <label htmlFor={key} className="font-body text-xs text-indigo/60">{label}</label>
              <input
                id={key}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold"
              />
            </div>
          ))}

          <label className="flex items-center gap-2 font-body text-sm text-indigo/80">
            <input
              type="checkbox"
              checked={form.maintenanceMode}
              onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
              className="h-4 w-4 rounded border-indigo/30"
            />
            Maintenance mode
          </label>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-marigold px-5 py-2.5 font-body text-sm font-semibold text-indigo hover:bg-marigold-light disabled:opacity-60"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Settings"}
          </button>
          {saved && <p className="font-body text-xs text-peacock">Settings saved.</p>}
        </form>
      )}
    </div>
  );
}
