"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.message || "Could not send your message");
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <div className="bg-ivory">
      <div className="border-b border-indigo/10 bg-indigo py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Mail className="mx-auto h-9 w-9 text-marigold" strokeWidth={1.5} />
          <h1 className="mt-4 font-display text-4xl font-semibold text-ivory sm:text-5xl">Contact Us</h1>
          <p className="mt-3 font-body text-sm text-ivory/70 sm:text-base">
            Questions, feedback or seva enquiries — we&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
        {status === "done" ? (
          <div className="rounded-2xl border border-peacock/30 bg-peacock/5 p-8 text-center">
            <p className="font-display text-2xl font-semibold text-indigo">Jai Shri Radhe 🙏</p>
            <p className="mt-2 font-body text-sm text-indigo/65">
              Your message has been received. Our team will get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-indigo/10 bg-white p-8 space-y-4">
            <div>
              <label className="font-body text-xs text-indigo/60">Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
            </div>
            <div>
              <label className="font-body text-xs text-indigo/60">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
            </div>
            <div>
              <label className="font-body text-xs text-indigo/60">Phone (optional)</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
            </div>
            <div>
              <label className="font-body text-xs text-indigo/60">Subject</label>
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
            </div>
            <div>
              <label className="font-body text-xs text-indigo/60">Message</label>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
            </div>
            {error && <p className="font-body text-xs text-maroon">{error}</p>}
            <button type="submit" disabled={status === "sending"}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-marigold py-2.5 font-body text-sm font-semibold text-indigo hover:bg-marigold-light disabled:opacity-60">
              <Send className="h-4 w-4" /> {status === "sending" ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
