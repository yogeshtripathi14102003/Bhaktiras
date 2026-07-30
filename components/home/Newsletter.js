"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitted");
  }

  return (
    <section className="bg-maroon py-14">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ivory sm:text-3xl">
          Get today&apos;s quote and darshan schedule in your inbox
        </h2>
        <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 rounded-full border border-ivory/30 bg-transparent px-5 py-3 font-body text-sm text-ivory placeholder:text-ivory/50 focus:border-marigold"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-full bg-marigold px-6 py-3 font-body text-sm font-semibold text-maroon transition hover:bg-marigold-light"
          >
            <Send className="h-4 w-4" /> Subscribe
          </button>
        </form>
        {status === "submitted" && (
          <p className="mt-3 font-body text-xs text-marigold">Subscribed — welcome to the family.</p>
        )}
      </div>
    </section>
  );
}
