"use client";

import { Pencil, Trash2, Plus } from "lucide-react";

/**
 * Generic list+actions table for admin CRUD screens.
 * columns: [{ key, label }]
 * rows: array of objects with matching keys (must include `id`)
 * onAdd / onEdit(row) / onDelete(row): optional handlers — wire these to
 * fetch() calls against the matching /api/<module> route for real CRUD.
 */
export default function AdminTable({ title, addLabel = "Add New", columns, rows, onAdd, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-indigo/10 bg-white">
      <div className="flex items-center justify-between border-b border-indigo/10 p-5">
        <h2 className="font-display text-xl font-semibold text-indigo">{title}</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-full bg-marigold px-4 py-2 font-body text-sm font-semibold text-indigo hover:bg-marigold-light"
        >
          <Plus className="h-4 w-4" /> {addLabel}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-indigo/10 font-body text-xs uppercase tracking-wide text-indigo/50">
              {columns.map((col) => (
                <th key={col.key} className="px-5 py-3 font-medium">{col.label}</th>
              ))}
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-indigo/5 font-body text-sm text-indigo/80 last:border-0 hover:bg-ivory/60">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3">{row[col.key]}</td>
                ))}
                <td className="px-5 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => onEdit?.(row)} aria-label="Edit" className="text-peacock hover:text-peacock-dark">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDelete?.(row)} aria-label="Delete" className="text-maroon hover:text-maroon-dark">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-10 text-center font-body text-sm text-indigo/45">
                  No records yet — click &ldquo;{addLabel}&rdquo; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
