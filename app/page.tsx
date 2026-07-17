"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Category, Product } from "@/lib/types";
import Sidebar from "@/components/Sidebar";
import ProductTable from "@/components/ProductTable";
import InfoPanel from "@/components/InfoPanel";
import { Loader2, AlertTriangle } from "lucide-react";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [infoProduct, setInfoProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [catsRes, prodsRes] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order", { ascending: true }),
      supabase.from("products").select("*").order("created_at", { ascending: false }),
    ]);

    if (catsRes.error || prodsRes.error) {
      setError(catsRes.error?.message || prodsRes.error?.message || "Failed to load data.");
      setLoading(false);
      return;
    }

    setCategories(catsRes.data as Category[]);
    setProducts(prodsRes.data as Product[]);
    if (!activeCategoryId && catsRes.data && catsRes.data.length > 0) {
      setActiveCategoryId(catsRes.data[0].id);
    }
    setLoading(false);
  }, [activeCategoryId]);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddCategory = async (name: string) => {
    const { data, error } = await supabase
      .from("categories")
      .insert({ name, icon: "Folder", sort_order: categories.length + 1 })
      .select()
      .single();
    if (!error && data) {
      setCategories((prev) => [...prev, data as Category]);
      setActiveCategoryId((data as Category).id);
    }
  };

  const handleAddProduct = async () => {
    if (!activeCategoryId) return;
    const { data, error } = await supabase
      .from("products")
      .insert({
        category_id: activeCategoryId,
        url: "",
        title: "",
        description: "",
        platform: "",
        status: "Not started",
        date_added: new Date().toISOString().slice(0, 10),
        notes: "",
      })
      .select()
      .single();
    if (!error && data) {
      setProducts((prev) => [data as Product, ...prev]);
    }
  };

  const handleUpdateProduct = async (id: string, field: keyof Product, value: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    await supabase.from("products").update({ [field]: value }).eq("id", id);
  };

  const handleDeleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await supabase.from("products").delete().eq("id", id);
  };

  const counts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category_id] = (acc[p.category_id] || 0) + 1;
    return acc;
  }, {});

  const activeCategory = categories.find((c) => c.id === activeCategoryId) || null;
  const categoryProducts = products.filter((p) => p.category_id === activeCategoryId);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-paper">
        <Loader2 className="h-5 w-5 animate-spin text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-paper px-6 text-center">
        <AlertTriangle className="h-6 w-6 text-red-500" />
        <p className="max-w-sm text-[14px] text-ink-600">
          Couldn&apos;t connect to Supabase. Check that <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[12.5px]">.env.local</code> has your project URL and anon key, then restart the dev server.
        </p>
        <p className="max-w-sm text-[12px] text-ink-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-paper">
      <Sidebar
        categories={categories}
        activeId={activeCategoryId}
        onSelect={setActiveCategoryId}
        onAddCategory={handleAddCategory}
        counts={counts}
      />
      <main className="flex-1 overflow-hidden">
        {activeCategory ? (
          <ProductTable
            categoryName={activeCategory.name}
            products={categoryProducts}
            onAdd={handleAddProduct}
            onUpdate={handleUpdateProduct}
            onOpenInfo={setInfoProduct}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-400">
            Select or create a category to get started.
          </div>
        )}
      </main>
      <InfoPanel
        product={infoProduct}
        categoryName={activeCategory?.name || ""}
        onClose={() => setInfoProduct(null)}
        onDelete={handleDeleteProduct}
        onUpdateNotes={(id, notes) => handleUpdateProduct(id, "notes", notes)}
      />
    </div>
  );
}
