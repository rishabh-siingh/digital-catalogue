export interface Category {
  id: string;
  name: string;
  icon: string; // lucide icon name, stored as string
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  url: string;
  title: string;
  description: string | null;
  platform: string | null;
  status: string | null;
  favicon_url: string | null;
  date_added: string; // ISO date
  notes: string | null;
  created_at: string;
}

export const PLATFORM_OPTIONS = [
  "Google Drive",
  "Telegram",
  "Local File",
  "Udemy",
  "YouTube",
  "Other",
] as const;

export const STATUS_OPTIONS = ["Not started", "In progress", "Done"] as const;

// Distinct accent per platform so the "Visit" capsule and platform chip
// carry a bit of recognizable color while staying inside the blue theme family.
export const PLATFORM_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  "Google Drive": { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
  "Telegram": { bg: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-200" },
  "Local File": { bg: "bg-slate-100", text: "text-slate-600", ring: "ring-slate-200" },
  "Udemy": { bg: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-200" },
  "YouTube": { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200" },
  "Other": { bg: "bg-accent-light", text: "text-accent-dark", ring: "ring-accent/20" },
};

export function getPlatformColor(platform: string | null | undefined) {
  return PLATFORM_COLORS[platform || ""] || PLATFORM_COLORS["Other"];
}

/**
 * Derives a favicon image URL for a given product URL using Google's
 * public favicon service. No backend/storage needed — this just builds
 * a URL string that resolves to the site's icon at request time.
 */
export function getFaviconUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
  } catch {
    return null;
  }
}
