"use client";

import { useEffect, useState, useCallback } from "react";
import AdminTable from "@/components/admin/AdminTable";
import AdminFormModal from "@/components/admin/AdminFormModal";

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "speaker", label: "Speaker" },
  { key: "views", label: "Views" },
  { key: "status", label: "Status" },
];

export default function AdminKathasPage() {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [res, catRes] = await Promise.all([
        fetch("/api/kathas?limit=50", { cache: "no-store" }),
        fetch("/api/categories?type=katha", { cache: "no-store" }),
      ]);
      const json = await res.json();
      const catJson = await catRes.json();
      if (json.success) {
        setRows(
          json.data.items.map((k) => ({
            id: k._id,
            title: k.title,
            speaker: k.speaker?.name || "—",
            views: (k.views || 0).toLocaleString("en-IN"),
            status: k.status,
            _raw: k,
          }))
        );
      }
      if (catJson.success) setCategories(catJson.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(row) {
    if (!confirm(`Delete "${row.title}"?`)) return;
    const res = await fetch(`/api/kathas/${row.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) setRows((r) => r.filter((x) => x.id !== row.id));
    else alert(json.message || "Could not delete katha");
  }

  const fields = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "category", label: "Category", type: "select", options: categories.map((c) => c.name) },
    { name: "speakerName", label: "Speaker Name", type: "text" },
    { name: "videoUrl", label: "Video URL", type: "text", required: true },
    { name: "duration", label: "Duration (seconds)", type: "number" },
    { name: "status", label: "Status", type: "select", options: ["draft", "published"] },
    { name: "isFeatured", label: "Featured on homepage", type: "checkbox" },
  ];

  async function handleSubmit(values) {
    const category = categories.find((c) => c.name === values.category);
    const { speakerName, ...rest } = values;
    const payload = { ...rest, category: category?._id || undefined, speaker: { name: speakerName } };

    const isEdit = modal.mode === "edit";
    const url = isEdit ? `/api/kathas/${modal.record.id}` : "/api/kathas";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Save failed");
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-indigo">Manage Kathas</h1>
      <p className="mt-1 font-body text-sm text-indigo/60">
        {loading ? "Loading…" : "Video library — changes appear on the site immediately."}
      </p>
      <div className="mt-8">
        <AdminTable
          title="All Kathas"
          addLabel="Add Katha"
          columns={COLUMNS}
          rows={rows}
          onAdd={() => setModal({ mode: "add" })}
          onEdit={(row) => setModal({ mode: "edit", record: row })}
          onDelete={handleDelete}
        />
      </div>

      {modal && (
        <AdminFormModal
          title={modal.mode === "edit" ? `Edit "${modal.record.title}"` : "Add Katha"}
          fields={fields}
          initialValues={
            modal.mode === "edit"
              ? {
                  title: modal.record._raw.title,
                  description: modal.record._raw.description || "",
                  category: modal.record._raw.category?.name || "",
                  speakerName: modal.record._raw.speaker?.name || "",
                  videoUrl: modal.record._raw.videoUrl || "",
                  duration: modal.record._raw.duration || 0,
                  status: modal.record._raw.status,
                  isFeatured: modal.record._raw.isFeatured,
                }
              : { status: "published" }
          }
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
