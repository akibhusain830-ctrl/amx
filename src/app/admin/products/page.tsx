import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import DeleteProductButton from "./components/DeleteProductButton";
import StockToggle from "./components/StockToggle";
import CategoryFilterDropdown from "./components/CategoryFilterDropdown";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  if (searchParams.q) {
    query = query.ilike("title", `%${searchParams.q}%`);
  }
  if (searchParams.category) {
    query = query.ilike("category", `%${searchParams.category}%`);
  }

  const { data: products, error } = await query;

  // Standard categories for filter
  const categories = ["Cafe", "Aesthetic", "Love", "Wings", "Gaming", "Pop Culture", "Cars"];

  if (error) console.error("Error fetching products:", error);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Products</h1>
          <p className="text-text-muted mt-1 text-sm">
            {products?.length || 0} product{products?.length !== 1 ? "s" : ""} in your catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-primary text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform flex items-center justify-center gap-2 sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <form method="GET" className="flex flex-wrap gap-3">
        <input
          type="text"
          name="q"
          defaultValue={searchParams.q}
          placeholder="Search products..."
          className="flex-1 min-w-[200px] bg-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-text-muted"
        />
        <CategoryFilterDropdown
          categories={categories}
          defaultValue={searchParams.category}
        />
        <button
          type="submit"
          className="bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors"
        >
          Search
        </button>
        {(searchParams.q || searchParams.category) && (
          <Link
            href="/admin/products"
            className="bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors text-text-muted"
          >
            Clear
          </Link>
        )}
      </form>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-surface border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Product</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Category</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Price</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Stock</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-lg border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-[8px] font-mono text-primary uppercase text-center leading-tight px-1">No Img</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{product.title}</p>
                          <p className="text-xs text-text-muted font-mono mt-0.5">/{product.slug}</p>
                          {product.badge && (
                            <span className="text-[9px] font-black uppercase tracking-widest bg-primary/20 text-primary px-1.5 py-0.5 rounded mt-1 inline-block">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-white/5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider text-text-muted">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-sm">
                        {formatPrice(product.price)}
                        {product.original_price && (
                          <span className="block text-xs text-text-muted line-through">
                            {formatPrice(product.original_price)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <StockToggle productId={product.id} inStock={product.in_stock} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-text-muted"
                          title="View on Store"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/50 rounded-lg transition-all text-white hover:text-primary font-bold text-xs uppercase tracking-widest"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                        <DeleteProductButton productId={product.id} productTitle={product.title} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-text-muted">
                    <p className="text-lg font-black uppercase tracking-tight mb-2">No products found</p>
                    <p className="text-sm">
                      {searchParams.q || searchParams.category
                        ? "Try a different search term."
                        : 'Click "Add Product" to create your first neon sign.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-surface border border-white/5 rounded-2xl p-4 flex flex-col gap-4 relative overflow-hidden">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-black rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-[10px] font-mono text-primary uppercase text-center leading-tight px-1">No Img</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-base leading-tight">{product.title}</p>
                  <p className="text-[10px] text-text-muted font-mono mt-1 mb-2 truncate max-w-[150px]">/{product.slug}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider text-text-muted border border-white/5">
                      {product.category}
                    </span>
                    {product.badge && (
                      <span className="bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-black/50 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                <div className="font-mono text-sm font-bold">
                  {formatPrice(product.price)}
                  {product.original_price && (
                    <span className="block text-[10px] text-text-muted line-through font-normal">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                </div>
                <div className="scale-90 origin-right">
                  <StockToggle productId={product.id} inStock={product.in_stock} />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="w-full flex items-center justify-center gap-3 p-3 bg-primary/10 hover:bg-primary/20 border border-primary/50 rounded-xl transition-all active:scale-[0.98] font-bold text-xs uppercase tracking-[0.2em] text-primary"
                >
                  <Edit className="w-4 h-4" />
                  Edit Product
                </Link>
                <div className="flex gap-2">
                  <Link
                    href={`/products/${product.slug}`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-text-muted border border-white/5 text-[10px] font-bold uppercase tracking-widest"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    View Store
                  </Link>
                  <div className="flex-1 flex">
                    <DeleteProductButton productId={product.id} productTitle={product.title} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-surface border border-white/5 rounded-2xl text-text-muted">
            <p className="text-lg font-black uppercase tracking-tight mb-2">No products</p>
            <p className="text-xs">Nothing found for this query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
