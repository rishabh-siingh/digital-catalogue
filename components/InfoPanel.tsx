"use client";

import { X, ExternalLink, Trash2, Calendar, Layers, Tag } from "lucide-react";
import type { Product } from "@/lib/types";

interface InfoPanelProps {
  product: Product | null;
  categoryName: string;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  "Done": "bg-accent-light text-accent-dark",
  "In progress": "bg-gold-light text-gold",
  "Not started": "bg-ink-100 text-ink-500",
};

export default function InfoPanel({ product, categoryName, onClose, onDelete, onUpdateNotes }: InfoPanelProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fade-in absolute inset-0 bg-ink-950/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="panel-in absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col border-l border-ink-200 bg-paper/95 backdrop-blur-xl shadow-pop">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-ink-100 px-6 py-5">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-400">{categoryName}</p>
            <h2 className="mt-1 font-display text-[19px] font-medium leading-snug text-ink-900">
              {product.title || "Untitled"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
            aria-label="Close panel"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Status + platform chips */}
          <div className="flex flex-wrap gap-2">
            {product.status && (
              <span className={`rounded px-2 py-1 text-[11.5px] font-semibold ${STATUS_STYLES[product.status] || "bg-ink-100 text-ink-500"}`}>
                {product.status}
              </span>
            )}
            {product.platform && (
              <span className="flex items-center gap-1 rounded bg-ink-100 px-2 py-1 text-[11.5px] font-medium text-ink-600">
                <Layers className="h-3 w-3" /> {product.platform}
              </span>
            )}
          </div>

          {/* URL */}
          {product.url && (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-between gap-2 rounded-md border border-ink-200 bg-ink-50 px-3.5 py-3 text-[13px] text-accent transition-colors hover:border-accent hover:bg-accent-light"
            >
              <span className="truncate font-mono text-[12px]">{product.url}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>
          )}

          {/* Description */}
          <div className="mt-5">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-400">Description</p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-700">
              {product.description || <span className="italic text-ink-400">No description added.</span>}
            </p>
          </div>

          {/* Date */}
          <div className="mt-5 flex items-center gap-2 text-[13px] text-ink-500">
            <Calendar className="h-3.5 w-3.5" />
            Added {new Date(product.date_added).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>

          {/* Notes - editable */}
          <div className="mt-5">
            <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-400">
              <Tag className="h-3 w-3" /> Notes
            </p>
            <textarea
              defaultValue={product.notes || ""}
              onBlur={(e) => onUpdateNotes(product.id, e.target.value)}
              placeholder="Add a quick note…"
              rows={4}
              className="mt-1.5 w-full resize-none rounded-md border border-ink-200 bg-white px-3 py-2.5 text-[13px] text-ink-800 placeholder:text-ink-400 focus:border-accent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-ink-100 px-6 py-4">
          <button
            onClick={() => { onDelete(product.id); onClose(); }}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete entry
          </button>
        </div>
      </aside>
    </div>
  );
}
