"use client";

import { useState, useEffect } from "react";
import { Search, Filter, SlidersHorizontal, Grid2X2, LayoutList } from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Product, getProducts } from "@/lib/products";

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

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

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
      <Header />
      <div className="pt-28 pb-24 container mx-auto px-6">
        {/* Header Section */}
        <div className="mb-12">
          <span className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">
            Catalogue
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            All Products
          </h1>
        </div>

        {/* Filters Toolbar */}
        <div className="mb-12 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between border-y border-white/5 py-6">
          {/* Search */}
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

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* Category Filter */}
            <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-full px-4 py-2">
              <Filter className="w-3.5 h-3.5 text-primary" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs font-black uppercase tracking-widest outline-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-surface">{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
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
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
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
