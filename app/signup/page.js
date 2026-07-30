"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.message || "Registration failed");
      } else {
        window.location.href = json.data.role === "admin" ? "/admin" : "/dashboard";
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ivory px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-indigo/10 bg-white p-8">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-marigold" />
          <span className="font-display text-xl font-semibold text-indigo">Kishori Bhakti</span>
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold text-indigo">Create your account</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="font-body text-xs text-indigo/60">Full name</label>
            <input id="name" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
          </div>
          <div>
            <label htmlFor="email" className="font-body text-xs text-indigo/60">Email</label>
            <input id="email" type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
          </div>
          <div>
            <label htmlFor="password" className="font-body text-xs text-indigo/60">Password</label>
            <input id="password" type="password" required minLength={6} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
          </div>
          {error && <p className="font-body text-xs text-maroon">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-full bg-marigold py-2.5 font-body text-sm font-semibold text-indigo hover:bg-marigold-light disabled:opacity-60">
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-xs text-indigo/55">
          Already have an account? <Link href="/login" className="text-peacock hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
