"use client";

import { useState } from "react";
import { X } from "lucide-react";

/**
 * Generic Add/Edit form, driven by a `fields` config so every admin
 * content module (Bhajans, Kathas, Blogs, Saints, Festivals, Events,
 * Quotes...) can reuse the same modal instead of hand-rolling one each.
 *
 * fields: [{ name, label, type: "text" | "textarea" | "number" | "checkbox" | "select" | "date", options?, required? }]
 */
export default function AdminFormModal({ title, fields, initialValues = {}, onSubmit, onClose }) {
  const [values, setValues] = useState(() => {
    const base = {};
    fields.forEach((f) => {
      base[f.name] = initialValues[f.name] ?? (f.type === "checkbox" ? false : "");
    });
    return base;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function setField(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-indigo/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-indigo">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-indigo/50 hover:text-indigo">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              {f.type !== "checkbox" && (
                <label className="font-body text-xs text-indigo/60">
                  {f.label} {f.required && <span className="text-maroon">*</span>}
                </label>
              )}

              {f.type === "textarea" && (
                <textarea
                  rows={4}
                  required={f.required}
                  value={values[f.name]}
                  onChange={(e) => setField(f.name, e.target.value)}
                  className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold"
                />
              )}

              {f.type === "select" && (
                <select
                  required={f.required}
                  value={values[f.name]}
                  onChange={(e) => setField(f.name, e.target.value)}
                  className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold"
                >
                  <option value="">Select…</option>
                  {(f.options || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {f.type === "checkbox" && (
                <label className="flex items-center gap-2 font-body text-sm text-indigo/80">
                  <input
                    type="checkbox"
                    checked={!!values[f.name]}
                    onChange={(e) => setField(f.name, e.target.checked)}
                    className="h-4 w-4 rounded border-indigo/30"
                  />
                  {f.label}
                </label>
              )}

              {["text", "number", "date"].includes(f.type) && (
                <input
                  type={f.type}
                  required={f.required}
                  value={values[f.name]}
                  onChange={(e) => setField(f.name, f.type === "number" ? e.target.valueAsNumber || 0 : e.target.value)}
                  className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold"
                />
              )}
            </div>
          ))}

          {error && <p className="font-body text-xs text-maroon">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-full border border-indigo/15 px-4 py-2 font-body text-sm text-indigo hover:border-marigold">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-full bg-marigold px-5 py-2 font-body text-sm font-semibold text-indigo hover:bg-marigold-light disabled:opacity-60">
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
