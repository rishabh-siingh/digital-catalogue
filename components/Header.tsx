"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X, Search, Plus } from "lucide-react";

interface HeaderProps {
  categoryName: string;
  entryCount: number;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddEntry: () => void;
}

export default function Header({
  categoryName,
  entryCount,
  mobileMenuOpen,
  onToggleMobileMenu,
  searchQuery,
  onSearchChange,
  onAddEntry,
}: HeaderProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mobileSearchOpen) {
      // wait for the element to render/expand before focusing
      requestAnimationFrame(() => mobileInputRef.current?.focus());
    }
  }, [mobileSearchOpen]);

  const closeMobileSearch = () => {
    setMobileSearchOpen(false);
    onSearchChange("");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100/80 bg-paper/75 backdrop-blur-xl backdrop-saturate-150 shadow-glass">
      <div className="flex h-16 items-center gap-2 px-3 md:h-[70px] md:gap-4 md:px-8">
        {/* Hamburger — mobile only, fixed small footprint, hidden while search is open */}
        {!mobileSearchOpen && (
          <button
            onClick={onToggleMobileMenu}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-ink-100 active:scale-95 md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" strokeWidth={2} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={2} />
            )}
          </button>
        )}

        {/* ===== MOBILE: title OR expanded search, mutually exclusive ===== */}
        <div className="flex min-w-0 flex-1 items-center md:hidden">
          {!mobileSearchOpen ? (
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-[17px] font-medium leading-tight text-ink-900">
                {categoryName || "Catalogue"}
              </h1>
              <p className="text-[11px] leading-tight text-ink-400">
                {entryCount} {entryCount === 1 ? "entry" : "entries"}
              </p>
            </div>
          ) : (
            <div className="fade-in flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2 shadow-sm">
              <Search className="h-4 w-4 shrink-0 text-ink-400" strokeWidth={2} />
              <input
                ref={mobileInputRef}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={`Search ${categoryName.toLowerCase()}…`}
                className="w-full min-w-0 bg-transparent text-[14px] text-ink-800 placeholder:text-ink-400 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Mobile search toggle / close — occupies the same slot */}
        <button
          onClick={() => (mobileSearchOpen ? closeMobileSearch() : setMobileSearchOpen(true))}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-ink-100 active:scale-95 md:hidden"
          aria-label={mobileSearchOpen ? "Close search" : "Open search"}
        >
          {mobileSearchOpen ? (
            <X className="h-5 w-5" strokeWidth={2} />
          ) : (
            <Search className="h-[18px] w-[18px]" strokeWidth={2} />
          )}
        </button>

        {/* Mobile new entry — icon-only circular button */}
        {!mobileSearchOpen && (
          <button
            onClick={onAddEntry}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-paper shadow-glass-lg transition-transform active:scale-95 md:hidden"
            aria-label="New entry"
          >
            <Plus className="h-5 w-5" strokeWidth={2.25} />
          </button>
        )}

        {/* ===== DESKTOP: title + search + button, all inline ===== */}
        <div className="hidden min-w-0 flex-1 md:flex md:flex-col md:justify-center">
          <h1 className="truncate font-display text-[22px] font-medium leading-tight text-ink-900">
            {categoryName || "Catalogue"}
          </h1>
          <p className="text-[12.5px] leading-tight text-ink-400">
            {entryCount} {entryCount === 1 ? "entry" : "entries"}
          </p>
        </div>

        <div className="hidden shrink-0 md:flex md:w-[280px] md:items-center md:gap-2 md:rounded-lg md:border md:border-ink-200 md:bg-white/80 md:px-3 md:py-2.5 md:shadow-sm md:transition-colors md:focus-within:border-accent">
          <Search className="h-4 w-4 shrink-0 text-ink-400" strokeWidth={2} />
          <input
            ref={desktopInputRef}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search this category…"
            className="w-full min-w-0 bg-transparent text-[13.5px] text-ink-800 placeholder:text-ink-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="shrink-0 text-ink-300 hover:text-ink-600"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={onAddEntry}
          className="hidden shrink-0 items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-[13.5px] font-semibold text-paper shadow-glass-lg transition-all hover:bg-accent-dark hover:shadow-lg active:scale-[0.98] md:flex"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          New entry
        </button>
      </div>
    </header>
  );
}
