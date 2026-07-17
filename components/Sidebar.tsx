"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { Plus, Library } from "lucide-react";
import type { Category } from "@/lib/types";

function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as any)[name] || Icons.Folder;
  return <Icon className={className} strokeWidth={1.75} />;
}

interface SidebarProps {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAddCategory: (name: string) => Promise<void>;
  counts: Record<string, number>;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const ICON_CHOICES = [
  "FileText", "GraduationCap", "Wrench", "FileType", "Sheet",
  "Video", "Music", "Image", "Archive", "Bookmark",
  "Code", "Presentation", "Folder", "BookOpen", "Link2",
];

export default function Sidebar({
  categories,
  activeId,
  onSelect,
  onAddCategory,
  counts,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const [addingOpen, setAddingOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("Folder");
  const [saving, setSaving] = useState(false);

  const handleSelect = (id: string) => {
    onSelect(id);
    onCloseMobile();
  };

  const handleAdd = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setSaving(true);
    await onAddCategory(trimmed);
    setSaving(false);
    setNewName("");
    setNewIcon("Folder");
    setAddingOpen(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 pb-5 pt-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-dark text-paper shadow-glass-lg">
          <Library className="h-4 w-4" strokeWidth={2} />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display text-[15px] font-medium tracking-tight text-ink-900">Catalogue</span>
          <span className="mt-0.5 text-[10.5px] uppercase tracking-[0.14em] text-ink-400">Digital Index</span>
        </div>
      </div>

      <div className="mx-5 mb-2 h-px bg-ink-100" />

      {/* Category list */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <p className="px-2.5 pb-2 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-400">
          Categories
        </p>
        <ul className="flex flex-col gap-0.5">
          {categories.map((cat) => {
            const active = cat.id === activeId;
            return (
              <li key={cat.id}>
                <button
                  onClick={() => handleSelect(cat.id)}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] transition-all ${
                    active
                      ? "bg-accent text-paper shadow-glass-lg"
                      : "text-ink-700 hover:bg-ink-100"
                  }`}
                >
                  <CategoryIcon
                    name={cat.icon}
                    className={`h-[16px] w-[16px] shrink-0 ${active ? "text-paper" : "text-ink-500 group-hover:text-ink-700"}`}
                  />
                  <span className="flex-1 truncate font-medium">{cat.name}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums ${
                      active ? "bg-white/20 text-paper" : "bg-ink-100 text-ink-500"
                    }`}
                  >
                    {counts[cat.id] ?? 0}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Add category */}
      <div className="border-t border-ink-100 p-3">
        {!addingOpen ? (
          <button
            onClick={() => setAddingOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-ink-300 px-3 py-2.5 text-[13px] font-medium text-ink-500 transition-colors hover:border-accent hover:text-accent"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add category
          </button>
        ) : (
          <div className="fade-in flex flex-col gap-2 rounded-lg border border-ink-200 bg-ink-50 p-2.5">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Category name"
              className="rounded-md border border-ink-200 bg-white px-2.5 py-1.5 text-[13px] text-ink-900 placeholder:text-ink-400 focus:border-accent"
            />
            <div className="flex flex-wrap gap-1">
              {ICON_CHOICES.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setNewIcon(icon)}
                  className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
                    newIcon === icon
                      ? "border-accent bg-accent-light text-accent"
                      : "border-ink-200 bg-white text-ink-400 hover:text-ink-600"
                  }`}
                >
                  <CategoryIcon name={icon} className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAdd}
                disabled={saving || !newName.trim()}
                className="flex-1 rounded-md bg-accent px-3 py-1.5 text-[12.5px] font-semibold text-paper transition-colors hover:bg-accent-dark disabled:opacity-40"
              >
                {saving ? "Adding…" : "Add"}
              </button>
              <button
                onClick={() => { setAddingOpen(false); setNewName(""); }}
                className="rounded-md px-3 py-1.5 text-[12.5px] font-medium text-ink-500 hover:bg-ink-100"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside className="hidden w-[260px] shrink-0 border-r border-ink-100 bg-ink-50/60 md:flex">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fade-in absolute inset-0 bg-ink-950/40 backdrop-blur-[2px]"
            onClick={onCloseMobile}
          />
          <aside className="panel-in absolute left-0 top-0 h-full w-[280px] bg-paper shadow-pop">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
