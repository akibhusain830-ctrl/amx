"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/products";
import { useProductStore } from "@/store/productStore";

export default function CollectionsPage() {
  const { products, isLoading, fetchProducts } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [isRestoring, setIsRestoring] = useState(true);

  // Initialize state from sessionStorage if available
  useEffect(() => {
    const savedSearch = sessionStorage.getItem("collections_search");
    const savedCategory = sessionStorage.getItem("collections_category");
    const savedSort = sessionStorage.getItem("collections_sort");

    if (savedSearch) setSearchQuery(savedSearch);
    if (savedCategory) setSelectedCategory(savedCategory);
    if (savedSort) setSortBy(savedSort);
    
    fetchProducts();
  }, [fetchProducts]);

  // Save filters and scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!isRestoring) {
        sessionStorage.setItem("collections_scroll_pos", window.scrollY.toString());
      }
    };
    
    sessionStorage.setItem("collections_search", searchQuery);
    sessionStorage.setItem("collections_category", selectedCategory);
    sessionStorage.setItem("collections_sort", sortBy);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [searchQuery, selectedCategory, sortBy, isRestoring]);

  useEffect(() => {
    let result = products;

    // Search filter
    if (searchQuery) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Sorting
    if (sortBy === "Price: Low to High") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "Alphabetical") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, sortBy, products]);

  // Restore scroll position after products are rendered and filtered
  useLayoutEffect(() => {
    if (filteredProducts.length > 0 && isRestoring) {
      const savedScrollPos = sessionStorage.getItem("collections_scroll_pos");
      if (savedScrollPos) {
        // Use a slightly longer timeout to ensure content has rendered and height is correct
        const timeoutId = setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedScrollPos),
            behavior: 'auto'
          });
          setIsRestoring(false);
        }, 150);
        return () => clearTimeout(timeoutId);
      } else {
        setIsRestoring(false);
      }
    } else if (!isLoading && filteredProducts.length === 0 && isRestoring) {
      setIsRestoring(false);
    }
  }, [filteredProducts, isRestoring, isLoading]);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
      <Header />
      <div className="pt-24 pb-24 container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-6 md:mb-12">
          <span className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">
            Catalogue
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            All Products
          </h1>
        </div>

        {/* Filters Toolbar */}
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
                    selectedCategory === cat 
                      ? 'bg-primary text-black' 
                      : 'bg-surface border border-white/10 text-white hover:border-primary/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-full px-4 py-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-black uppercase tracking-widest outline-none cursor-pointer"
              >
                <option value="Newest" className="bg-surface">Newest First</option>
                <option value="Price: Low to High" className="bg-surface">Price: Low to High</option>
                <option value="Price: High to Low" className="bg-surface">Price: High to Low</option>
                <option value="Alphabetical" className="bg-surface">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading && products.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-6 sm:gap-x-6 sm:gap-y-12 transition-opacity duration-300 ${isRestoring ? 'opacity-0' : 'opacity-100'}`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-surface/30 rounded-3xl border border-dashed border-white/10">
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">No products found</h3>
            <p className="text-text-muted text-sm mb-6">Try adjusting your filters or search query.</p>
            <button 
              onClick={() => {setSearchQuery(""); setSelectedCategory("All"); setSortBy("Newest")}}
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
