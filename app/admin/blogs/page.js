"use client";

import { useEffect, useState, useCallback } from "react";
import AdminTable from "@/components/admin/AdminTable";
import AdminFormModal from "@/components/admin/AdminFormModal";

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "readTime", label: "Read Time" },
  { key: "status", label: "Status" },
];

export default function AdminBlogsPage() {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [res, catRes] = await Promise.all([
        fetch("/api/blogs?limit=50", { cache: "no-store" }),
        fetch("/api/categories?type=blog", { cache: "no-store" }),
      ]);
      const json = await res.json();
      const catJson = await catRes.json();
      if (json.success) {
        setRows(
          json.data.items.map((b) => ({
            id: b._id,
            title: b.title,
            category: b.category?.name || "—",
            readTime: b.readTime ? `${b.readTime} min` : "—",
            status: b.status,
            _raw: b,
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

  async function openEdit(row) {
    const res = await fetch(`/api/blogs/${row.id}`, { cache: "no-store" });
    const json = await res.json();
    if (json.success) {
      setModal({ mode: "edit", record: { ...row, _raw: json.data } });
    } else {
      alert(json.message || "Could not load blog");
    }
  }

  async function handleDelete(row) {
    if (!confirm(`Delete "${row.title}"?`)) return;
    const res = await fetch(`/api/blogs/${row.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) setRows((r) => r.filter((x) => x.id !== row.id));
    else alert(json.message || "Could not delete blog");
  }

  const fields = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "excerpt", label: "Excerpt", type: "textarea" },
    { name: "content", label: "Content (HTML)", type: "textarea", required: true },
    { name: "coverImage", label: "Cover Image URL", type: "text" },
    { name: "category", label: "Category", type: "select", options: categories.map((c) => c.name) },
    { name: "tags", label: "Tags (comma separated)", type: "text" },
    { name: "authorName", label: "Author Name", type: "text" },
    { name: "readTime", label: "Read Time (minutes)", type: "number" },
    { name: "status", label: "Status", type: "select", options: ["draft", "published"] },
  ];

  async function handleSubmit(values) {
    const category = categories.find((c) => c.name === values.category);
    const { authorName, tags, ...rest } = values;
    const payload = {
      ...rest,
      category: category?._id || undefined,
      author: { name: authorName },
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };

    const isEdit = modal.mode === "edit";
    const url = isEdit ? `/api/blogs/${modal.record.id}` : "/api/blogs";
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
      <h1 className="font-display text-3xl font-semibold text-indigo">Manage Blogs</h1>
      <p className="mt-1 font-body text-sm text-indigo/60">
        {loading ? "Loading…" : "SEO-friendly articles — changes appear on the site immediately."}
      </p>
      <div className="mt-8">
        <AdminTable
          title="All Blog Posts"
          addLabel="Add Blog"
          columns={COLUMNS}
          rows={rows}
          onAdd={() => setModal({ mode: "add" })}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      {modal && (
        <AdminFormModal
          title={modal.mode === "edit" ? `Edit "${modal.record.title}"` : "Add Blog"}
          fields={fields}
          initialValues={
            modal.mode === "edit"
              ? {
                  title: modal.record._raw.title,
                  excerpt: modal.record._raw.excerpt || "",
                  content: modal.record._raw.content || "",
                  coverImage: modal.record._raw.coverImage || "",
                  category: modal.record._raw.category?.name || "",
                  tags: (modal.record._raw.tags || []).join(", "),
                  authorName: modal.record._raw.author?.name || "",
                  readTime: modal.record._raw.readTime || 0,
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
