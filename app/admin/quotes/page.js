"use client";

import { useEffect, useState, useCallback } from "react";
import AdminTable from "@/components/admin/AdminTable";
import AdminFormModal from "@/components/admin/AdminFormModal";

const COLUMNS = [
  { key: "text", label: "Quote" },
  { key: "author", label: "Author" },
  { key: "active", label: "Active" },
];

export default function AdminQuotesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quotes", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setRows(
          json.data.map((q) => ({
            id: q._id,
            text: q.text.length > 60 ? `${q.text.slice(0, 60)}…` : q.text,
            author: q.author || "—",
            active: q.isActive ? "Yes" : "No",
            _raw: q,
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
    if (!confirm("Delete this quote?")) return;
    const res = await fetch(`/api/quotes/${row.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) setRows((r) => r.filter((x) => x.id !== row.id));
    else alert(json.message || "Could not delete quote");
  }

  const fields = [
    { name: "text", label: "Quote text", type: "textarea", required: true },
    { name: "author", label: "Author", type: "text" },
    { name: "isActive", label: "Active (eligible for daily rotation)", type: "checkbox" },
  ];

  async function handleSubmit(values) {
    const isEdit = modal.mode === "edit";
    const url = isEdit ? `/api/quotes/${modal.record.id}` : "/api/quotes";
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
      <h1 className="font-display text-3xl font-semibold text-indigo">Manage Daily Quotes</h1>
      <p className="mt-1 font-body text-sm text-indigo/60">
        {loading ? "Loading…" : "Auto-scheduling and random quote pool — changes appear on the site immediately."}
      </p>
      <div className="mt-8">
        <AdminTable
          title="All Quotes"
          addLabel="Add Quote"
          columns={COLUMNS}
          rows={rows}
          onAdd={() => setModal({ mode: "add" })}
          onEdit={(row) => setModal({ mode: "edit", record: row })}
          onDelete={handleDelete}
        />
      </div>

      {modal && (
        <AdminFormModal
          title={modal.mode === "edit" ? "Edit Quote" : "Add Quote"}
          fields={fields}
          initialValues={
            modal.mode === "edit"
              ? {
                  text: modal.record._raw.text,
                  author: modal.record._raw.author || "",
                  isActive: modal.record._raw.isActive,
                }
              : { isActive: true }
          }
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
