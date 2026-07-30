"use client";

import { useEffect, useState, useCallback } from "react";
import AdminTable from "@/components/admin/AdminTable";
import AdminFormModal from "@/components/admin/AdminFormModal";

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "singer", label: "Singer" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
];

/**
 * Full CRUD reference implementation, wired to the real /api/bhajans
 * routes. Every other /admin/<module> page (kathas, blogs, saints,
 * festivals, events, quotes) follows this exact same shape — fetch on
 * mount, AdminFormModal for add/edit, DELETE + refetch — against its
 * own API route.
 */
export default function AdminBhajansPage() {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { mode: "add" } | { mode: "edit", record }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [bhajansRes, categoriesRes] = await Promise.all([
        fetch("/api/bhajans?limit=50", { cache: "no-store" }),
        fetch("/api/categories?type=bhajan", { cache: "no-store" }),
      ]);
      const bhajansJson = await bhajansRes.json();
      const categoriesJson = await categoriesRes.json();

      if (bhajansJson.success) {
        setRows(
          bhajansJson.data.items.map((b) => ({
            id: b._id,
            title: b.title,
            singer: b.singer || "—",
            category: b.category?.name || "—",
            status: b.status,
            _raw: b,
          }))
        );
      }
      if (categoriesJson.success) setCategories(categoriesJson.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(row) {
    if (!confirm(`Delete "${row.title}"?`)) return;
    const res = await fetch(`/api/bhajans/${row.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      setRows((r) => r.filter((x) => x.id !== row.id));
    } else {
      alert(json.message || "Could not delete bhajan");
    }
  }

  const fields = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "singer", label: "Singer", type: "text" },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: categories.map((c) => c.name),
    },
    { name: "lyrics", label: "Lyrics", type: "textarea" },
    { name: "audioUrl", label: "Audio URL", type: "text" },
    { name: "videoUrl", label: "Video URL", type: "text" },
    { name: "status", label: "Status", type: "select", options: ["draft", "published"] },
    { name: "isFeatured", label: "Featured on homepage", type: "checkbox" },
  ];

  async function handleSubmit(values) {
    const category = categories.find((c) => c.name === values.category);
    const payload = { ...values, category: category?._id || undefined };

    const isEdit = modal.mode === "edit";
    const url = isEdit ? `/api/bhajans/${modal.record.id}` : "/api/bhajans";
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
      <h1 className="font-display text-3xl font-semibold text-indigo">Manage Bhajans</h1>
      <p className="mt-1 font-body text-sm text-indigo/60">
        {loading ? "Loading…" : "Create, edit and publish devotional bhajans. Changes appear on the site immediately."}
      </p>

      <div className="mt-8">
        <AdminTable
          title="All Bhajans"
          addLabel="Add Bhajan"
          columns={COLUMNS}
          rows={rows}
          onAdd={() => setModal({ mode: "add" })}
          onEdit={(row) => setModal({ mode: "edit", record: row })}
          onDelete={handleDelete}
        />
      </div>

      {modal && (
        <AdminFormModal
          title={modal.mode === "edit" ? `Edit "${modal.record.title}"` : "Add Bhajan"}
          fields={fields}
          initialValues={
            modal.mode === "edit"
              ? {
                  title: modal.record._raw.title,
                  singer: modal.record._raw.singer || "",
                  category: modal.record._raw.category?.name || "",
                  lyrics: modal.record._raw.lyrics || "",
                  audioUrl: modal.record._raw.audioUrl || "",
                  videoUrl: modal.record._raw.videoUrl || "",
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
