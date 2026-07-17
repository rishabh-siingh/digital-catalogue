"use client";

import { useState } from "react";
import { Plus, Info, ExternalLink, Search } from "lucide-react";
import type { Product } from "@/lib/types";
import { PLATFORM_OPTIONS, STATUS_OPTIONS } from "@/lib/types";

interface ProductTableProps {
  categoryName: string;
  products: Product[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Product, value: string) => void;
  onOpenInfo: (product: Product) => void;
}

const STATUS_DOT: Record<string, string> = {
  "Done": "bg-accent",
  "In progress": "bg-gold",
  "Not started": "bg-ink-300",
};

export default function ProductTable({ categoryName, products, onAdd, onUpdate, onOpenInfo }: ProductTableProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? products.filter((p) =>
        [p.title, p.url, p.description, p.platform]
          .filter(Boolean)
          .some((f) => f!.toLowerCase().includes(query.toLowerCase()))
      )
    : products;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-ink-100 px-6 pb-5 pt-8 md:px-10 md:pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-400">Category</p>
            <h1 className="mt-1 font-display text-[28px] font-medium leading-none text-ink-900 md:text-[32px]">
              {categoryName}
            </h1>
            <p className="mt-2 text-[13px] text-ink-500">
              {products.length} {products.length === 1 ? "entry" : "entries"}
            </p>
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-[13.5px] font-semibold text-paper shadow-sm transition-colors hover:bg-accent-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={2.25} />
            New entry
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this category…"
            className="w-full rounded-md border border-ink-200 bg-white py-2 pr-3 text-[13px] text-ink-800 placeholder:text-ink-400 focus:border-accent"
            style={{ paddingLeft: "2.1rem" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 pb-10 md:px-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <p className="font-display text-[17px] text-ink-500">
              {products.length === 0 ? "No entries yet" : "Nothing matches your search"}
            </p>
            {products.length === 0 && (
              <button
                onClick={onAdd}
                className="mt-1 flex items-center gap-2 rounded-md border border-dashed border-ink-300 px-4 py-2 text-[13px] font-medium text-ink-500 hover:border-accent hover:text-accent"
              >
                <Plus className="h-3.5 w-3.5" /> Add your first entry
              </button>
            )}
          </div>
        ) : (
          <table className="mt-5 w-full min-w-[860px] border-separate border-spacing-0 text-[13px]">
            <thead>
              <tr>
                {["URL", "Title", "Description", "Platform", "Status", "Date Added", ""].map((h, i) => (
                  <th
                    key={h + i}
                    className="sticky top-0 z-10 border-b border-ink-200 bg-paper px-3 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr
                  key={p.id}
                  className="row-in group"
                  style={{ animationDelay: `${Math.min(idx, 12) * 18}ms` }}
                >
                  <td className="max-w-[160px] border-b border-ink-100 px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        defaultValue={p.url}
                        onBlur={(e) => onUpdate(p.id, "url", e.target.value)}
                        placeholder="https://…"
                        className="w-full truncate rounded border border-transparent bg-transparent px-1.5 py-1 font-mono text-[12px] text-accent hover:border-ink-200 focus:border-accent focus:bg-white"
                      />
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-ink-300 hover:text-accent">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="max-w-[200px] border-b border-ink-100 px-3 py-2.5">
                    <input
                      defaultValue={p.title}
                      onBlur={(e) => onUpdate(p.id, "title", e.target.value)}
                      placeholder="Untitled"
                      className="w-full truncate rounded border border-transparent bg-transparent px-1.5 py-1 font-medium text-ink-900 hover:border-ink-200 focus:border-accent focus:bg-white"
                    />
                  </td>
                  <td className="max-w-[220px] border-b border-ink-100 px-3 py-2.5">
                    <input
                      defaultValue={p.description || ""}
                      onBlur={(e) => onUpdate(p.id, "description", e.target.value)}
                      placeholder="—"
                      className="w-full truncate rounded border border-transparent bg-transparent px-1.5 py-1 text-ink-600 hover:border-ink-200 focus:border-accent focus:bg-white"
                    />
                  </td>
                  <td className="border-b border-ink-100 px-3 py-2.5">
                    <select
                      defaultValue={p.platform || ""}
                      onChange={(e) => onUpdate(p.id, "platform", e.target.value)}
                      className="rounded border border-transparent bg-transparent px-1.5 py-1 text-ink-700 hover:border-ink-200 focus:border-accent focus:bg-white"
                    >
                      <option value="">—</option>
                      {PLATFORM_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border-b border-ink-100 px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[p.status || ""] || "bg-ink-300"}`} />
                      <select
                        defaultValue={p.status || "Not started"}
                        onChange={(e) => onUpdate(p.id, "status", e.target.value)}
                        className="rounded border border-transparent bg-transparent px-1 py-1 text-ink-700 hover:border-ink-200 focus:border-accent focus:bg-white"
                      >
                        {STATUS_OPTIONS.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="whitespace-nowrap border-b border-ink-100 px-3 py-2.5 text-ink-500">
                    {new Date(p.date_added).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                  </td>
                  <td className="border-b border-ink-100 px-3 py-2.5 text-center">
                    <button
                      onClick={() => onOpenInfo(p)}
                      className="rounded p-1.5 text-ink-400 opacity-60 transition-colors hover:bg-accent-light hover:text-accent group-hover:opacity-100"
                      aria-label="View details"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
