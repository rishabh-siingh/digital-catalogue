"use client";

import { useMemo, useState } from "react";
import { Plus, Info, ExternalLink, Link2, ChevronDown, ArrowUpAZ, ArrowDownAZ, ArrowUp01, ArrowDown01 } from "lucide-react";
import type { Product } from "@/lib/types";
import { PLATFORM_OPTIONS, getFaviconUrl, getPlatformColor } from "@/lib/types";

interface ProductTableProps {
  products: Product[];
  searchQuery: string;
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Product, value: string) => void;
  onOpenInfo: (product: Product) => void;
}

type SortField = "title" | "platform" | "date_added" | null;
type SortDir = "asc" | "desc";

const COLUMN_CONFIG: { key: SortField; label: string; sortable: boolean }[] = [
  { key: "title", label: "Title", sortable: true },
  { key: null, label: "Description", sortable: false },
  { key: "platform", label: "Platform", sortable: true },
  { key: null, label: "Visit", sortable: false },
  { key: "date_added", label: "Date Added", sortable: true },
];

function PlatformFavicon({ url, platform }: { url: string; platform: string | null }) {
  const favicon = getFaviconUrl(url);
  if (!favicon) {
    return <Link2 className="h-3.5 w-3.5 shrink-0 text-ink-300" strokeWidth={2} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={favicon}
      alt=""
      className="h-3.5 w-3.5 shrink-0 rounded-sm"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

function ColumnHeader({
  label,
  field,
  sortable,
  activeSort,
  onSort,
}: {
  label: string;
  field: SortField;
  sortable: boolean;
  activeSort: { field: SortField; dir: SortDir };
  onSort: (field: SortField, dir: SortDir) => void;
}) {
  const [open, setOpen] = useState(false);
  const isActive = activeSort.field === field;
  const isDate = field === "date_added";

  if (!sortable) {
    return (
      <th className="sticky top-0 z-10 border-b border-ink-200 bg-marble-100/90 px-3 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-400 backdrop-blur-sm">
        {label}
      </th>
    );
  }

  return (
    <th className="sticky top-0 z-10 border-b border-ink-200 bg-marble-100/90 px-3 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-400 backdrop-blur-sm">
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:bg-ink-100 hover:text-ink-700 ${
            isActive ? "text-accent" : ""
          }`}
        >
          {label}
          <ChevronDown className="h-3 w-3" strokeWidth={2.5} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
            <div className="fade-in absolute left-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-lg border border-ink-100 bg-white shadow-pop">
              {isDate ? (
                <>
                  <button
                    onClick={() => { onSort(field, "desc"); setOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] font-normal normal-case tracking-normal text-ink-700 hover:bg-accent-light hover:text-accent-dark"
                  >
                    <ArrowDown01 className="h-3.5 w-3.5" /> Newest first
                  </button>
                  <button
                    onClick={() => { onSort(field, "asc"); setOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] font-normal normal-case tracking-normal text-ink-700 hover:bg-accent-light hover:text-accent-dark"
                  >
                    <ArrowUp01 className="h-3.5 w-3.5" /> Oldest first
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { onSort(field, "asc"); setOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] font-normal normal-case tracking-normal text-ink-700 hover:bg-accent-light hover:text-accent-dark"
                  >
                    <ArrowUpAZ className="h-3.5 w-3.5" /> Sort A → Z
                  </button>
                  <button
                    onClick={() => { onSort(field, "desc"); setOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] font-normal normal-case tracking-normal text-ink-700 hover:bg-accent-light hover:text-accent-dark"
                  >
                    <ArrowDownAZ className="h-3.5 w-3.5" /> Sort Z → A
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </th>
  );
}

export default function ProductTable({ products, searchQuery, onAdd, onUpdate, onOpenInfo }: ProductTableProps) {
  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({ field: null, dir: "asc" });
  const [urlBoxOpenId, setUrlBoxOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = searchQuery.trim()
      ? products.filter((p) =>
          [p.title, p.url, p.description, p.platform]
            .filter(Boolean)
            .some((f) => f!.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : products;

    if (sort.field) {
      list = [...list].sort((a, b) => {
        const field = sort.field as keyof Product;
        const av = (a[field] || "").toString().toLowerCase();
        const bv = (b[field] || "").toString().toLowerCase();
        if (av < bv) return sort.dir === "asc" ? -1 : 1;
        if (av > bv) return sort.dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return list;
  }, [products, searchQuery, sort]);

  const handleSort = (field: SortField, dir: SortDir) => setSort({ field, dir });

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
        <div className="overflow-x-auto rounded-xl border border-white bg-white/50 shadow-glass">
          <table className="w-full min-w-[820px] border-separate border-spacing-0 text-[13px]">
            <thead>
              <tr>
                {COLUMN_CONFIG.map((col) => (
                  <ColumnHeader
                    key={col.label}
                    label={col.label}
                    field={col.key}
                    sortable={col.sortable}
                    activeSort={sort}
                    onSort={handleSort}
                  />
                ))}
                <th className="sticky top-0 z-10 border-b border-ink-200 bg-marble-100/90 px-3 py-2.5 backdrop-blur-sm" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => {
                const platformColor = getPlatformColor(p.platform);
                const urlBoxOpen = urlBoxOpenId === p.id;
                return (
                  <tr
                    key={p.id}
                    className="row-in group"
                    style={{ animationDelay: `${Math.min(idx, 12) * 18}ms` }}
                  >
                    {/* Title + inline URL box */}
                    <td className="max-w-[240px] border-b border-ink-100 px-3 py-2.5 align-top">
                      <input
                        defaultValue={p.title}
                        onBlur={(e) => onUpdate(p.id, "title", e.target.value)}
                        placeholder="Untitled"
                        className="w-full truncate rounded border border-transparent bg-transparent px-1.5 py-1 font-medium text-ink-900 hover:border-ink-200 focus:border-accent focus:bg-white"
                      />
                      {!urlBoxOpen ? (
                        <button
                          onClick={() => setUrlBoxOpenId(p.id)}
                          className="mt-0.5 flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-ink-400 hover:bg-ink-100 hover:text-accent"
                        >
                          <Link2 className="h-3 w-3" />
                          {p.url ? "Edit URL" : "Add URL"}
                        </button>
                      ) : (
                        <div className="fade-in mt-1 flex items-center gap-1">
                          <input
                            autoFocus
                            defaultValue={p.url}
                            onBlur={(e) => {
                              onUpdate(p.id, "url", e.target.value);
                              setUrlBoxOpenId(null);
                            }}
                            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                            placeholder="https://…"
                            className="w-full min-w-0 rounded border border-accent/40 bg-accent-light px-1.5 py-1 font-mono text-[11.5px] text-accent-dark focus:border-accent"
                          />
                        </div>
                      )}
                    </td>

                    {/* Description */}
                    <td className="max-w-[220px] border-b border-ink-100 px-3 py-2.5 align-top">
                      <input
                        defaultValue={p.description || ""}
                        onBlur={(e) => onUpdate(p.id, "description", e.target.value)}
                        placeholder="—"
                        className="w-full truncate rounded border border-transparent bg-transparent px-1.5 py-1 text-ink-600 hover:border-ink-200 focus:border-accent focus:bg-white"
                      />
                    </td>

                    {/* Platform + favicon */}
                    <td className="border-b border-ink-100 px-3 py-2.5 align-top">
                      <div className="flex items-center gap-1.5">
                        <PlatformFavicon url={p.url} platform={p.platform} />
                        <select
                          defaultValue={p.platform || ""}
                          onChange={(e) => onUpdate(p.id, "platform", e.target.value)}
                          className="rounded border border-transparent bg-transparent py-1 text-ink-700 hover:border-ink-200 focus:border-accent focus:bg-white"
                        >
                          <option value="">—</option>
                          {PLATFORM_OPTIONS.map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Visit capsule */}
                    <td className="border-b border-ink-100 px-3 py-2.5 align-top">
                      {p.url ? (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-semibold ring-1 ring-inset transition-transform hover:scale-[1.03] ${platformColor.bg} ${platformColor.text} ${platformColor.ring}`}
                        >
                          Visit
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-ink-100 px-3 py-1 text-[11.5px] font-medium text-ink-400">
                          No URL
                        </span>
                      )}
                    </td>

                    {/* Date Added */}
                    <td className="whitespace-nowrap border-b border-ink-100 px-3 py-2.5 align-top text-ink-500">
                      {new Date(p.date_added).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                    </td>

                    {/* Info */}
                    <td className="border-b border-ink-100 px-3 py-2.5 text-center align-top">
                      <button
                        onClick={() => onOpenInfo(p)}
                        className="rounded p-1.5 text-ink-400 opacity-60 transition-colors hover:bg-accent-light hover:text-accent group-hover:opacity-100"
                        aria-label="View details"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
