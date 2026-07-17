"use client";

import { Plus, Info, ExternalLink } from "lucide-react";
import type { Product } from "@/lib/types";
import { PLATFORM_OPTIONS, STATUS_OPTIONS } from "@/lib/types";

interface ProductTableProps {
  products: Product[];
  searchQuery: string;
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Product, value: string) => void;
  onOpenInfo: (product: Product) => void;
}

const STATUS_DOT: Record<string, string> = {
  "Done": "bg-accent",
  "In progress": "bg-gold",
  "Not started": "bg-ink-300",
};

export default function ProductTable({ products, searchQuery, onAdd, onUpdate, onOpenInfo }: ProductTableProps) {
  const filtered = searchQuery.trim()
    ? products.filter((p) =>
        [p.title, p.url, p.description, p.platform]
          .filter(Boolean)
          .some((f) => f!.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : products;

  return (
    <div className="flex-1 overflow-auto px-3 pb-10 pt-5 md:px-10 md:pt-8">
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <p className="font-display text-[17px] text-ink-500">
            {products.length === 0 ? "No entries yet" : "Nothing matches your search"}
          </p>
          {products.length === 0 && (
            <button
              onClick={onAdd}
              className="mt-1 flex items-center gap-2 rounded-lg border border-dashed border-ink-300 px-4 py-2 text-[13px] font-medium text-ink-500 hover:border-accent hover:text-accent"
            >
              <Plus className="h-3.5 w-3.5" /> Add your first entry
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white/60 shadow-glass">
          <table className="w-full min-w-[860px] border-separate border-spacing-0 text-[13px]">
            <thead>
              <tr>
                {["URL", "Title", "Description", "Platform", "Status", "Date Added", ""].map((h, i) => (
                  <th
                    key={h + i}
                    className="sticky top-0 z-10 border-b border-ink-200 bg-ink-50/90 px-3 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-400 backdrop-blur-sm"
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
        </div>
      )}
    </div>
  );
}
