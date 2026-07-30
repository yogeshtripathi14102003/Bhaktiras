"use client";

import { useState } from "react";
import { Ticket } from "lucide-react";

export default function EventRegisterForm({ eventTitle }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState("idle");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // In production: POST to /api/events/[id]/register with the real event id.
    setStatus("registered");
  }

  if (status === "registered") {
    return (
      <div className="h-fit rounded-2xl border border-peacock/30 bg-peacock/5 p-6 text-center">
        <Ticket className="mx-auto h-8 w-8 text-peacock" />
        <p className="mt-3 font-display text-lg font-semibold text-indigo">You&apos;re registered!</p>
        <p className="mt-1 font-body text-sm text-indigo/60">
          A QR ticket for {eventTitle} has been sent to {form.email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="h-fit rounded-2xl border border-indigo/10 bg-white p-6">
      <h2 className="font-display text-xl font-semibold text-indigo">Register for this Event</h2>
      <div className="mt-4 space-y-3">
        <div>
          <label htmlFor="name" className="font-body text-xs text-indigo/60">Full name</label>
          <input id="name" name="name" required value={form.name} onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
        </div>
        <div>
          <label htmlFor="email" className="font-body text-xs text-indigo/60">Email</label>
          <input id="email" type="email" name="email" required value={form.email} onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
        </div>
        <div>
          <label htmlFor="phone" className="font-body text-xs text-indigo/60">Phone</label>
          <input id="phone" name="phone" value={form.phone} onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
        </div>
      </div>
      <button type="submit" className="mt-5 w-full rounded-full bg-marigold py-2.5 font-body text-sm font-semibold text-indigo hover:bg-marigold-light">
        Register &amp; Get QR Ticket
      </button>
    </form>
  );
}
