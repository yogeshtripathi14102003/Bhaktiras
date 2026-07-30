"use client";

import { useEffect, useState, useCallback } from "react";
import AdminTable from "@/components/admin/AdminTable";
import AdminFormModal from "@/components/admin/AdminFormModal";

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "album", label: "Album" },
  { key: "type", label: "Type" },
];

export default function AdminGalleryPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery?limit=50", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setRows(json.data.items.map((g) => ({ id: g._id, title: g.title, album: g.album, type: g.type, _raw: g })));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(row) {
    if (!confirm(`Delete "${row.title}"?`)) return;
    const res = await fetch(`/api/gallery/${row.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) setRows((r) => r.filter((x) => x.id !== row.id));
    else alert(json.message || "Could not delete gallery item");
  }

  const fields = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "album", label: "Album", type: "text" },
    { name: "type", label: "Type", type: "select", options: ["photo", "video"], required: true },
    { name: "url", label: "Media URL", type: "text", required: true },
    { name: "thumbnail", label: "Thumbnail URL", type: "text" },
    { name: "isTempleGallery", label: "Show in Temple Gallery", type: "checkbox" },
  ];

  async function handleSubmit(values) {
    const isEdit = modal.mode === "edit";
    const url = isEdit ? `/api/gallery/${modal.record.id}` : "/api/gallery";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Save failed");
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-indigo">Manage Gallery</h1>
      <p className="mt-1 font-body text-sm text-indigo/60">
        {loading ? "Loading…" : "Photos and videos — changes appear on the site immediately."}
      </p>
      <div className="mt-8">
        <AdminTable
          title="All Gallery Items"
          addLabel="Add Item"
          columns={COLUMNS}
          rows={rows}
          onAdd={() => setModal({ mode: "add" })}
          onEdit={(row) => setModal({ mode: "edit", record: row })}
          onDelete={handleDelete}
        />
      </div>

      {modal && (
        <AdminFormModal
          title={modal.mode === "edit" ? `Edit "${modal.record.title}"` : "Add Gallery Item"}
          fields={fields}
          initialValues={
            modal.mode === "edit"
              ? {
                  title: modal.record._raw.title,
                  album: modal.record._raw.album || "",
                  type: modal.record._raw.type,
                  url: modal.record._raw.url || "",
                  thumbnail: modal.record._raw.thumbnail || "",
                  isTempleGallery: modal.record._raw.isTempleGallery,
                }
              : { type: "photo" }
          }
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
