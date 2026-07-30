"use client";

import { useState } from "react";
import { CalendarHeart, Send } from "lucide-react";

export default function BookKathaPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", kathaType: "", preferredDate: "", venue: "", address: "", notes: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/katha-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.message || "Could not submit your booking request");
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
          <CalendarHeart className="mx-auto h-9 w-9 text-marigold" strokeWidth={1.5} />
          <h1 className="mt-4 font-display text-4xl font-semibold text-ivory sm:text-5xl">Book a Katha</h1>
          <p className="mt-3 font-body text-sm text-ivory/70 sm:text-base">
            Request a Katha for your home, temple or community gathering — our team will confirm the details.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
        {status === "done" ? (
          <div className="rounded-2xl border border-peacock/30 bg-peacock/5 p-8 text-center">
            <p className="font-display text-2xl font-semibold text-indigo">Jai Shri Radhe 🙏</p>
            <p className="mt-2 font-body text-sm text-indigo/65">
              Your booking request has been received. A confirmation email is on its way, and our team will reach out shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-indigo/10 bg-white p-8 space-y-4">
            <div>
              <label className="font-body text-xs text-indigo/60">Your Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="font-body text-xs text-indigo/60">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
              </div>
              <div>
                <label className="font-body text-xs text-indigo/60">Phone</label>
                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
              </div>
            </div>
            <div>
              <label className="font-body text-xs text-indigo/60">Katha Type</label>
              <input placeholder="e.g. Shrimad Bhagwat Katha" value={form.kathaType} onChange={(e) => setForm({ ...form, kathaType: e.target.value })}
                className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="font-body text-xs text-indigo/60">Preferred Date</label>
                <input type="date" required value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
              </div>
              <div>
                <label className="font-body text-xs text-indigo/60">Venue</label>
                <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
              </div>
            </div>
            <div>
              <label className="font-body text-xs text-indigo/60">Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
            </div>
            <div>
              <label className="font-body text-xs text-indigo/60">Additional Notes</label>
              <textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
            </div>
            {error && <p className="font-body text-xs text-maroon">{error}</p>}
            <button type="submit" disabled={status === "sending"}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-marigold py-2.5 font-body text-sm font-semibold text-indigo hover:bg-marigold-light disabled:opacity-60">
              <Send className="h-4 w-4" /> {status === "sending" ? "Submitting…" : "Submit Booking Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
