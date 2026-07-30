"use client";

import { useEffect, useState, useCallback } from "react";
import AdminTable from "@/components/admin/AdminTable";
import AdminFormModal from "@/components/admin/AdminFormModal";

const COLUMNS = [
  { key: "templeName", label: "Title / Temple" },
  { key: "status", label: "Status" },
];

export default function AdminLiveStreamsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/live-streams", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setRows(
          json.data.map((s) => ({
            id: s._id,
            templeName: s.templeName,
            status: s.isLive ? "Live" : "Offline",
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
    if (!confirm(`Delete "${row.templeName}"?`)) return;
    const res = await fetch(`/api/live-streams/${row.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) setRows((r) => r.filter((x) => x.id !== row.id));
    else alert(json.message || "Could not delete live stream");
  }

  const fields = [
    { name: "templeName", label: "Title / Temple Name", type: "text", required: true },
    { name: "streamUrl", label: "Stream URL (YouTube live embed / HLS)", type: "text", required: true },
    { name: "thumbnail", label: "Thumbnail URL", type: "text" },
    { name: "isLive", label: "Currently Live", type: "checkbox" },
    { name: "scheduleText", label: "Schedule (one per line: Day | Time | Title)", type: "textarea" },
  ];

  function scheduleToText(schedule) {
    return (schedule || []).map((s) => `${s.day || ""} | ${s.time || ""} | ${s.title || ""}`).join("\n");
  }

  function textToSchedule(text) {
    return (text || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [day, time, title] = line.split("|").map((p) => p?.trim());
        return { day, time, title };
      });
  }

  async function handleSubmit(values) {
    const { scheduleText, ...rest } = values;
    const payload = { ...rest, schedule: textToSchedule(scheduleText) };

    const isEdit = modal.mode === "edit";
    const url = isEdit ? `/api/live-streams/${modal.record.id}` : "/api/live-streams";
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
      <h1 className="font-display text-3xl font-semibold text-indigo">Manage Live Katha / Streams</h1>
      <p className="mt-1 font-body text-sm text-indigo/60">
        {loading ? "Loading…" : "Toggle a stream live and it appears instantly on the Live Darshan page."}
      </p>
      <div className="mt-8">
        <AdminTable
          title="All Streams"
          addLabel="Add Stream"
          columns={COLUMNS}
          rows={rows}
          onAdd={() => setModal({ mode: "add" })}
          onEdit={(row) => setModal({ mode: "edit", record: row })}
          onDelete={handleDelete}
        />
      </div>

      {modal && (
        <AdminFormModal
          title={modal.mode === "edit" ? `Edit "${modal.record.templeName}"` : "Add Live Stream"}
          fields={fields}
          initialValues={
            modal.mode === "edit"
              ? {
                  templeName: modal.record._raw.templeName,
                  streamUrl: modal.record._raw.streamUrl || "",
                  thumbnail: modal.record._raw.thumbnail || "",
                  isLive: modal.record._raw.isLive,
                  scheduleText: scheduleToText(modal.record._raw.schedule),
                }
              : { isLive: false }
          }
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
