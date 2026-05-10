"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Trash2, ArrowUp, ArrowDown, Plus, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  image_url?: string;
  is_trending: boolean;
  trending_order: number | null;
}

export default function TrendingManagerPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("id, title, category, price, image_url, is_trending, trending_order")
      .order("created_at", { ascending: false });
    if (data) {
      const sorted = [...data].sort((a, b) =>
        a.is_trending && b.is_trending
          ? (a.trending_order ?? 999) - (b.trending_order ?? 999)
          : 0
      );
      setAllProducts(data);
      setTrending(sorted.filter((p) => p.is_trending));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const addToTrending = (product: Product) => {
    if (trending.find((p) => p.id === product.id)) return;
    setTrending((prev) => [...prev, { ...product, is_trending: true, trending_order: prev.length + 1 }]);
  };

  const removeFromTrending = (id: string) => {
    setTrending((prev) => prev.filter((p) => p.id !== id).map((p, i) => ({ ...p, trending_order: i + 1 })));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setTrending((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next.map((p, i) => ({ ...p, trending_order: i + 1 }));
    });
  };

  const moveDown = (index: number) => {
    setTrending((prev) => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next.map((p, i) => ({ ...p, trending_order: i + 1 }));
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Clear all trending flags first
      await supabase.from("products").update({ is_trending: false, trending_order: null }).neq("id", "00000000-0000-0000-0000-000000000000");

      // Set new trending flags
      for (const product of trending) {
        await supabase
          .from("products")
          .update({ is_trending: true, trending_order: product.trending_order })
          .eq("id", product.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const notInTrending = allProducts.filter(
    (p) => !trending.find((t) => t.id === p.id) &&
    (search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-1">Admin</p>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Trending Manager</h1>
          <p className="text-text-muted text-sm mt-1">Pick and order the products shown in "Trending Collections" on the homepage.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : null}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: All Products */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4">All Products — click to add</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by name or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 thin-scrollbar">
              {notInTrending.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToTrending(product)}
                  className="w-full flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-lg bg-surface overflow-hidden shrink-0">
                    {product.image_url ? (
                      <Image src={product.image_url} alt={product.title} width={48} height={48} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-primary font-black uppercase">{product.category[0]}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{product.title}</p>
                    <p className="text-[10px] text-text-muted">{product.category} · ₹{product.price.toLocaleString("en-IN")}</p>
                  </div>
                  <Plus className="w-4 h-4 text-text-muted group-hover:text-primary shrink-0 transition-colors" />
                </button>
              ))}
              {notInTrending.length === 0 && (
                <p className="text-center text-text-muted text-sm py-8">No products found.</p>
              )}
            </div>
          </div>

          {/* Right: Trending List */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4">
              Trending on Homepage <span className="text-primary">({trending.length} selected)</span>
            </h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 thin-scrollbar">
              {trending.length === 0 && (
                <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-text-muted text-sm">
                  Add products from the left to feature them in Trending Collections.
                </div>
              )}
              {trending.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-3"
                >
                  <span className="text-primary font-black font-mono text-sm w-5 text-center shrink-0">{index + 1}</span>
                  <div className="w-12 h-12 rounded-lg bg-surface overflow-hidden shrink-0">
                    {product.image_url ? (
                      <Image src={product.image_url} alt={product.title} width={48} height={48} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-primary font-black uppercase">{product.category[0]}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{product.title}</p>
                    <p className="text-[10px] text-text-muted">{product.category} · ₹{product.price.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => moveUp(index)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30" disabled={index === 0}>
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => moveDown(index)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30" disabled={index === trending.length - 1}>
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => removeFromTrending(product.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-text-muted hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
