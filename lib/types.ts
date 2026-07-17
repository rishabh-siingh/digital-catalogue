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
