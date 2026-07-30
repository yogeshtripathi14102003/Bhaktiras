"use client";

import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      setResults(json.success ? json.data : null);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  const groups = results
    ? [
        ["Bhajans", results.bhajans, "title"],
        ["Katha", results.kathas, "title"],
        ["Blog", results.blogs, "title"],
        ["Saints", results.saints, "name"],
        ["Festivals", results.festivals, "name"],
        ["Events", results.events, "title"],
      ]
    : [];

  return (
    <div className="min-h-[60vh] bg-ivory">
      <div className="border-b border-indigo/10 bg-indigo py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h1 className="font-display text-4xl font-semibold text-ivory">Search Kishori Bhakti</h1>
          <form onSubmit={handleSearch} className="mt-6 flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bhajans, katha, blog, saints, festivals, events…"
              className="flex-1 rounded-full border border-ivory/25 bg-transparent px-5 py-3 font-body text-sm text-ivory placeholder:text-ivory/45 focus:border-marigold"
            />
            <button className="flex items-center gap-2 rounded-full bg-marigold px-6 py-3 font-body text-sm font-semibold text-indigo hover:bg-marigold-light">
              <SearchIcon className="h-4 w-4" /> Search
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {loading && <p className="font-body text-sm text-indigo/60">Searching…</p>}

        {!loading && results && groups.every(([, items]) => !items?.length) && (
          <p className="font-body text-sm text-indigo/60">No results for &ldquo;{query}&rdquo;.</p>
        )}

        {!loading &&
          groups.map(([label, items, key]) =>
            items?.length ? (
              <div key={label} className="mb-8">
                <h2 className="font-display text-xl font-semibold text-indigo">{label}</h2>
                <ul className="mt-3 space-y-2">
                  {items.map((item) => (
                    <li key={item._id} className="rounded-lg border border-indigo/10 bg-white px-4 py-3 font-body text-sm text-indigo/80">
                      {item[key]}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          )}

        {!results && !loading && (
          <p className="font-body text-sm text-indigo/50">
            Results are pulled live from the Bhajan, Katha, Blog, Saint, Festival and Event
            collections via <code className="font-mono text-xs">/api/search</code>.
          </p>
        )}
      </div>
    </div>
  );
}
