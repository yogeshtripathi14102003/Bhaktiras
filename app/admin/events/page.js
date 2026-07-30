"use client";

import { useEffect, useState, useCallback } from "react";
import AdminTable from "@/components/admin/AdminTable";
import AdminFormModal from "@/components/admin/AdminFormModal";

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "venue", label: "Venue" },
  { key: "startDate", label: "Date" },
  { key: "status", label: "Status" },
];

export default function AdminEventsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events?limit=50", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setRows(
          json.data.items.map((e) => ({
            id: e._id,
            title: e.title,
            venue: e.venue || "—",
            startDate: new Date(e.startDate).toLocaleDateString("en-IN"),
            status: e.status,
            _raw: e,
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
    if (!confirm(`Delete "${row.title}"?`)) return;
    const res = await fetch(`/api/events/${row.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) setRows((r) => r.filter((x) => x.id !== row.id));
    else alert(json.message || "Could not delete event");
  }

  const fields = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "banner", label: "Banner URL", type: "text" },
    { name: "venue", label: "Venue", type: "text" },
    { name: "startDate", label: "Start Date", type: "date", required: true },
    { name: "endDate", label: "End Date", type: "date" },
    { name: "capacity", label: "Capacity", type: "number" },
    { name: "isFree", label: "Free event", type: "checkbox" },
    { name: "price", label: "Price (₹)", type: "number" },
    { name: "status", label: "Status", type: "select", options: ["upcoming", "ongoing", "completed", "cancelled"] },
  ];

  async function handleSubmit(values) {
    const isEdit = modal.mode === "edit";
    const url = isEdit ? `/api/events/${modal.record.id}` : "/api/events";
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
      <h1 className="font-display text-3xl font-semibold text-indigo">Manage Events</h1>
      <p className="mt-1 font-body text-sm text-indigo/60">
        {loading ? "Loading…" : "Registrations, QR tickets and attendance — changes appear on the site immediately."}
      </p>
      <div className="mt-8">
        <AdminTable
          title="All Events"
          addLabel="Add Event"
          columns={COLUMNS}
          rows={rows}
          onAdd={() => setModal({ mode: "add" })}
          onEdit={(row) => setModal({ mode: "edit", record: row })}
          onDelete={handleDelete}
        />
      </div>

      {modal && (
        <AdminFormModal
          title={modal.mode === "edit" ? `Edit "${modal.record.title}"` : "Add Event"}
          fields={fields}
          initialValues={
            modal.mode === "edit"
              ? {
                  title: modal.record._raw.title,
                  description: modal.record._raw.description || "",
                  banner: modal.record._raw.banner || "",
                  venue: modal.record._raw.venue || "",
                  startDate: modal.record._raw.startDate ? modal.record._raw.startDate.slice(0, 10) : "",
                  endDate: modal.record._raw.endDate ? modal.record._raw.endDate.slice(0, 10) : "",
                  capacity: modal.record._raw.capacity || 0,
                  isFree: modal.record._raw.isFree,
                  price: modal.record._raw.price || 0,
                  status: modal.record._raw.status,
                }
              : { status: "upcoming", isFree: true }
          }
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
