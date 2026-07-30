"use client";

import { useEffect, useState, useCallback } from "react";
import AdminTable from "@/components/admin/AdminTable";
import AdminFormModal from "@/components/admin/AdminFormModal";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "era", label: "Era" },
  { key: "status", label: "Status" },
];

export default function AdminSaintsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/saints?limit=50", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setRows(
          json.data.items.map((s) => ({
            id: s._id,
            name: s.name,
            era: s.era || "—",
            status: s.status,
            _raw: s,
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(row) {
    if (!confirm(`Delete "${row.name}"?`)) return;
    const res = await fetch(`/api/saints/${row.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) setRows((r) => r.filter((x) => x.id !== row.id));
    else alert(json.message || "Could not delete saint profile");
  }

  const fields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "era", label: "Era", type: "text" },
    { name: "photo", label: "Photo URL", type: "text" },
    { name: "biography", label: "Biography", type: "textarea" },
    { name: "status", label: "Status", type: "select", options: ["draft", "published"] },
    { name: "isFeatured", label: "Featured on homepage", type: "checkbox" },
  ];

  async function handleSubmit(values) {
    const isEdit = modal.mode === "edit";
    const url = isEdit ? `/api/saints/${modal.record.id}` : "/api/saints";
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
      <h1 className="font-display text-3xl font-semibold text-indigo">Manage Saints</h1>
      <p className="mt-1 font-body text-sm text-indigo/60">
        {loading ? "Loading…" : "Biography, quotes and teachings — changes appear on the site immediately."}
      </p>
      <div className="mt-8">
        <AdminTable
          title="All Saints"
          addLabel="Add Saint"
          columns={COLUMNS}
          rows={rows}
          onAdd={() => setModal({ mode: "add" })}
          onEdit={(row) => setModal({ mode: "edit", record: row })}
          onDelete={handleDelete}
        />
      </div>

      {modal && (
        <AdminFormModal
          title={modal.mode === "edit" ? `Edit "${modal.record.name}"` : "Add Saint"}
          fields={fields}
          initialValues={
            modal.mode === "edit"
              ? {
                  name: modal.record._raw.name,
                  era: modal.record._raw.era || "",
                  photo: modal.record._raw.photo || "",
                  biography: modal.record._raw.biography || "",
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
