"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/products";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useParams } from "next/navigation";

const LOAD_MORE_SIZE = 16;

type SortKey = "default" | "price-asc" | "price-desc" | "newest";

const SORT_OPTIONS: { key: SortKey; label: string; desc: string }[] = [
  { key: "default",    label: "Featured",          desc: "Our top picks" },
  { key: "newest",     label: "Newest First",       desc: "Latest arrivals" },
  { key: "price-asc",  label: "Price: Low → High",  desc: "Budget friendly first" },
  { key: "price-desc", label: "Price: High → Low",  desc: "Premium first" },
];

export default function CollectionGrid({ products }: { products: Product[] }) {
  const params   = useParams();
  const category = (params?.category as string) || "default";

  const SK_SORT   = `cat_sort_${category}`;
  const SK_LIMIT  = `cat_limit_${category}`;

  // ── Initialise state with server-consistent defaults ──────────────────────
  const [sort,  setSort]  = useState<SortKey>("default");
  const [limit, setLimit] = useState(LOAD_MORE_SIZE);

  const [sortOpen,      setSortOpen]      = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [scrollReady,   setScrollReady]   = useState(false); // Start false to prevent scroll jump

  const sentinelRef        = useRef<HTMLDivElement>(null);

  // ── Initial Restoration on Mount ──────────────────────────────────────────
  useEffect(() => {
    const savedSort  = sessionStorage.getItem(SK_SORT) as SortKey;
    const savedLimit = parseInt(sessionStorage.getItem(SK_LIMIT) ?? String(LOAD_MORE_SIZE));

    if (savedSort && savedSort !== "default") setSort(savedSort);
    if (savedLimit > LOAD_MORE_SIZE) setLimit(savedLimit);
    
    setScrollReady(true);
  }, [SK_SORT, SK_LIMIT]);

  // ── Persist sort + limit ──────────────────────────────────────────────────
  useEffect(() => { sessionStorage.setItem(SK_SORT, sort); }, [sort, SK_SORT]);



  // ── Sort products ─────────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    const arr = [...products];
    if (sort === "price-asc")  arr.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [products, sort]);

  // ── Visible slice — limit is already correct on first render ──────────────
  const visible = sorted.slice(0, limit);
  const hasMore = visible.length < sorted.length;
  const current = SORT_OPTIONS.find((o) => o.key === sort)!;

  // ── Persist limit ─────────────────────────────────────────────────────────
  useEffect(() => {
    sessionStorage.setItem(SK_LIMIT, String(visible.length));
  }, [visible.length, SK_LIMIT]);



  // ── Infinite scroll — only after restoration ──────────────────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || !scrollReady) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => { setLimit(l => l + LOAD_MORE_SIZE); setIsLoadingMore(false); }, 300);
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, scrollReady]);

  return (
    <div>
      {/* Sort Bar */}
      <div className="flex items-center justify-between mb-6 md:mb-10">
        <p className="text-text-muted text-sm">
          <span className="text-white font-bold">{sorted.length}</span> designs
        </p>

        <div className="relative">
          <button
            onClick={() => setSortOpen((o) => !o)}
            className={`flex items-center gap-2.5 border transition-all duration-200 rounded-full px-4 py-2.5 text-xs font-black uppercase tracking-widest ${
              sortOpen ? "bg-primary/10 border-primary/50 text-primary" : "bg-white/5 border-white/10 hover:border-primary/40 text-white"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            <span>{current.label}</span>
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
                  const isActive = sort === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => { setSort(opt.key); setLimit(LOAD_MORE_SIZE); setSortOpen(false); }}
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

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-6 sm:gap-x-8 sm:gap-y-16">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Sentinel — only mounted after scroll restoration */}
      {scrollReady && (
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
          {!hasMore && !isLoadingMore && sorted.length > LOAD_MORE_SIZE && (
            <p className="text-text-muted text-xs font-mono tracking-widest py-4">
              — You&apos;ve seen all {sorted.length} designs —
            </p>
          )}
        </div>
      )}
    </div>
  );
}
