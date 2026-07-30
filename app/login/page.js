"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.message || "Login failed");
      } else {
        // Admins land on the Admin Dashboard, everyone else on the
        // regular User Dashboard.
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
        <h1 className="mt-6 font-display text-2xl font-semibold text-indigo">Welcome back</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="font-body text-xs text-indigo/60">Email</label>
            <input id="email" type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
          </div>
          <div>
            <label htmlFor="password" className="font-body text-xs text-indigo/60">Password</label>
            <input id="password" type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-lg border border-indigo/15 px-3 py-2 font-body text-sm focus:border-marigold" />
          </div>
          {error && <p className="font-body text-xs text-maroon">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-full bg-marigold py-2.5 font-body text-sm font-semibold text-indigo hover:bg-marigold-light disabled:opacity-60">
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <a href="/api/auth/google" className="mt-3 flex w-full items-center justify-center rounded-full border border-indigo/15 py-2.5 font-body text-sm text-indigo hover:border-marigold">
          Continue with Google
        </a>

        <p className="mt-6 text-center font-body text-xs text-indigo/55">
          <Link href="#" className="hover:text-marigold-dark">Forgot password?</Link>
        </p>
        <p className="mt-2 text-center font-body text-xs text-indigo/55">
          New here? <Link href="/signup" className="text-peacock hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
