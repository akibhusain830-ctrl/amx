"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/products";
import { useProductStore } from "@/store/productStore";

const PAGE_SIZE = 8;

type SortKey = "Newest" | "Price: Low to High" | "Price: High to Low" | "Alphabetical";

const SORT_OPTIONS: { key: SortKey; label: string; desc: string }[] = [
  { key: "Newest",              label: "Newest First",      desc: "Latest arrivals" },
  { key: "Price: Low to High",  label: "Price: Low → High", desc: "Budget friendly first" },
  { key: "Price: High to Low",  label: "Price: High → Low", desc: "Premium first" },
  { key: "Alphabetical",        label: "Alphabetical",      desc: "A to Z" },
];

export default function CollectionsPage() {
  const { products, isLoading, fetchProducts } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("Newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedSearch = sessionStorage.getItem("collections_search");
    const savedCategory = sessionStorage.getItem("collections_category");
    const savedSort = sessionStorage.getItem("collections_sort");
    if (savedSearch) setSearchQuery(savedSearch);
    if (savedCategory) setSelectedCategory(savedCategory);
    if (savedSort) setSortBy(savedSort as SortKey);
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const handleScroll = () => {
      if (!isRestoring) sessionStorage.setItem("collections_scroll_pos", window.scrollY.toString());
    };
    sessionStorage.setItem("collections_search", searchQuery);
    sessionStorage.setItem("collections_category", selectedCategory);
    sessionStorage.setItem("collections_sort", sortBy);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [searchQuery, selectedCategory, sortBy, isRestoring]);

  useEffect(() => {
    let result = products;
    if (searchQuery) result = result.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (selectedCategory !== "All") result = result.filter(p => p.category === selectedCategory);
    if (sortBy === "Price: Low to High") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "Price: High to Low") result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === "Alphabetical") result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    setFilteredProducts(result);
    setPage(1);
  }, [searchQuery, selectedCategory, sortBy, products]);

  useLayoutEffect(() => {
    if (filteredProducts.length > 0 && isRestoring) {
      const savedScrollPos = sessionStorage.getItem("collections_scroll_pos");
      if (savedScrollPos) {
        const id = setTimeout(() => { window.scrollTo({ top: parseInt(savedScrollPos), behavior: "auto" }); setIsRestoring(false); }, 150);
        return () => clearTimeout(id);
      } else setIsRestoring(false);
    } else if (!isLoading && filteredProducts.length === 0 && isRestoring) setIsRestoring(false);
  }, [filteredProducts, isRestoring, isLoading]);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  const visible = filteredProducts.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filteredProducts.length;
  const currentSort = SORT_OPTIONS.find(o => o.key === sortBy)!;

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => { setPage(p => p + 1); setIsLoadingMore(false); }, 500);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore]);

  return (
    <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
      <Header />
      <div className="pt-24 pb-24 container mx-auto px-4 sm:px-6">
        <div className="mb-6 md:mb-12">
          <span className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">Catalogue</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">All Products</h1>
        </div>

        <div className="mb-6 md:mb-12 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between border-y border-white/5 py-4 md:py-6">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 sm:pb-0 sm:max-w-md md:max-w-lg lg:max-w-xl flex-1 items-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${
                    selectedCategory === cat ? "bg-primary text-black" : "bg-surface border border-white/10 text-white hover:border-primary/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Premium Sort Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setSortOpen(o => !o)}
                className={`flex items-center gap-2.5 border transition-all duration-200 rounded-full px-4 py-2.5 text-xs font-black uppercase tracking-widest ${
                  sortOpen ? "bg-primary/10 border-primary/50 text-primary" : "bg-surface border-white/10 hover:border-primary/40 text-white"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                <span>{currentSort.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${sortOpen ? "rotate-180 text-primary" : "text-text-muted"}`} />
              </button>

              {sortOpen && <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />}

              {sortOpen && (
                <div
                  className="absolute right-0 top-full mt-3 z-20 w-64 rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]"
                  style={{ background: "rgba(10,10,10,0.97)", backdropFilter: "blur(24px)" }}
                >
                  <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-white/[0.06]">
                    <SlidersHorizontal className="w-3 h-3 text-primary" />
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted">Sort By</p>
                  </div>
                  <div className="p-2">
                    {SORT_OPTIONS.map((opt) => {
                      const isActive = sortBy === opt.key;
                      return (
                        <button
                          key={opt.key}
                          onClick={() => { setSortBy(opt.key); setSortOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 text-left group ${
                            isActive ? "bg-primary/10 border border-primary/20" : "border border-transparent hover:bg-white/[0.04]"
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center ${
                            isActive ? "bg-primary" : "border border-white/20 group-hover:border-white/40"
                          }`}>
                            {isActive && (
                              <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                                <path d="M1 2.5L2.8 4.2L6 1" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[11px] font-black uppercase tracking-widest leading-none ${isActive ? "text-primary" : "text-white/80 group-hover:text-white"}`}>
                              {opt.label}
                            </p>
                            <p className="text-[9px] text-text-muted mt-1 font-mono">{opt.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading && products.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-6 sm:gap-x-6 sm:gap-y-12 transition-opacity duration-300 ${isRestoring ? "opacity-0" : "opacity-100"}`}>
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Sentinel + Loader */}
            <div ref={sentinelRef} className="mt-16 flex flex-col items-center gap-3">
              {isLoadingMore && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
                    <div className="absolute inset-[6px] rounded-full bg-primary/10" />
                  </div>
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Loading more...</p>
                </div>
              )}
              {!hasMore && !isLoadingMore && filteredProducts.length > PAGE_SIZE && (
                <p className="text-text-muted text-xs font-mono tracking-widest py-4">
                  — You&apos;ve seen all {filteredProducts.length} designs —
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-24 bg-surface/30 rounded-3xl border border-dashed border-white/10">
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">No products found</h3>
            <p className="text-text-muted text-sm mb-6">Try adjusting your filters or search query.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSortBy("Newest"); }}
              className="text-primary text-xs font-black uppercase tracking-widest border-b border-primary pb-1"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
