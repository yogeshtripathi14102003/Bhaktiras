"use client";

import { useEffect, useState, useCallback } from "react";
import AdminTable from "@/components/admin/AdminTable";
import AdminFormModal from "@/components/admin/AdminFormModal";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
];

export default function AdminFestivalsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/festivals", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setRows(
          json.data.map((f) => ({
            id: f._id,
            name: f.name,
            date: new Date(f.date).toLocaleDateString("en-IN"),
            status: f.status,
            _raw: f,
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
    const res = await fetch(`/api/festivals/${row.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) setRows((r) => r.filter((x) => x.id !== row.id));
    else alert(json.message || "Could not delete festival");
  }

  const fields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "banner", label: "Banner URL", type: "text" },
    { name: "history", label: "History", type: "textarea" },
    { name: "importance", label: "Importance", type: "textarea" },
    { name: "mantra", label: "Mantra", type: "text" },
    { name: "status", label: "Status", type: "select", options: ["draft", "published"] },
  ];

  async function handleSubmit(values) {
    const isEdit = modal.mode === "edit";
    const url = isEdit ? `/api/festivals/${modal.record.id}` : "/api/festivals";
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
      <h1 className="font-display text-3xl font-semibold text-indigo">Manage Festivals</h1>
      <p className="mt-1 font-body text-sm text-indigo/60">
        {loading ? "Loading…" : "Festival calendar — changes appear on the site immediately."}
      </p>
      <div className="mt-8">
        <AdminTable
          title="All Festivals"
          addLabel="Add Festival"
          columns={COLUMNS}
          rows={rows}
          onAdd={() => setModal({ mode: "add" })}
          onEdit={(row) => setModal({ mode: "edit", record: row })}
          onDelete={handleDelete}
        />
      </div>

      {modal && (
        <AdminFormModal
          title={modal.mode === "edit" ? `Edit "${modal.record.name}"` : "Add Festival"}
          fields={fields}
          initialValues={
            modal.mode === "edit"
              ? {
                  name: modal.record._raw.name,
                  date: modal.record._raw.date ? modal.record._raw.date.slice(0, 10) : "",
                  banner: modal.record._raw.banner || "",
                  history: modal.record._raw.history || "",
                  importance: modal.record._raw.importance || "",
                  mantra: modal.record._raw.mantra || "",
                  status: modal.record._raw.status,
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
