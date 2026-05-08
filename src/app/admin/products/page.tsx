import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import DeleteProductButton from "./components/DeleteProductButton";
import StockToggle from "./components/StockToggle";

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

  // Get unique categories for filter
  const { data: allProducts } = await supabase.from("products").select("category");
  const categories = Array.from(new Set(allProducts?.map((p) => p.category) || [])).filter(Boolean);

  if (error) console.error("Error fetching products:", error);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Products</h1>
          <p className="text-text-muted mt-1 text-sm">
            {products?.length || 0} product{products?.length !== 1 ? "s" : ""} in your catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-primary text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform flex items-center gap-2"
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
        <select
          name="category"
          defaultValue={searchParams.category}
          className="bg-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
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

      {/* Products Table */}
      <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
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
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
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
    </div>
  );
}
