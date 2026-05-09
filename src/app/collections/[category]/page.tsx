import {
  getProductsByCategory,
  getAllCategories,
} from "@/lib/products";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { mapDbCategoryToLabel, mapSlugToDbCategory } from "@/lib/categories";

interface CategoryPageProps {
  params: { category: string };
}

export const revalidate = 60; // Revalidate every minute
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const categories = await getAllCategories();
    return categories.map((category) => ({
      category: category.toLowerCase(),
    }));
  } catch {
    // Supabase env vars not available at build time (e.g. Vercel CI).
    // Pages will be rendered dynamically at request time instead.
    return [];
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const dbCategory = mapSlugToDbCategory(params.category);
  const categoryProducts = await getProductsByCategory(dbCategory);
  const categoryName = mapDbCategoryToLabel(categoryProducts[0]?.category || dbCategory);
  return {
    title: `${categoryName} | Premium Neon Signs | AMX Signs`,
    description: `Discover our exclusive ${categoryName} neon sign collection. Handcrafted premium LED neon for your space. Free shipping India-wide.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const dbCategory = mapSlugToDbCategory(params.category);
  const categoryProducts = await getProductsByCategory(dbCategory);
  const categoryName = mapDbCategoryToLabel(categoryProducts[0]?.category || dbCategory);

  if (categoryProducts.length === 0) {
    return (
      <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
        <Header />
        <div className="pt-24 pb-24 container mx-auto px-4 sm:px-6">
          <div className="mb-6 md:mb-12">
            <span className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">
              Collection
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              {categoryName}
            </h1>
          </div>
          <div className="rounded-2xl border border-white/10 bg-surface p-8 text-center">
            <h2 className="text-xl font-black uppercase tracking-tight mb-2">No Products Yet</h2>
            <p className="text-text-muted text-sm mb-6">
              We are adding new {categoryName} designs soon.
            </p>
            <Link
              href="/collections"
              className="inline-block bg-primary text-black px-6 py-3 rounded-full font-black text-xs tracking-widest uppercase"
            >
              Browse All Collections
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
      <Header />
      <div className="pt-24 pb-24 container mx-auto px-4 sm:px-6">
        <div className="mb-6 md:mb-12">
          <span className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">
            Collection
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            {categoryName}
          </h1>
          <p className="text-text-muted text-sm mt-4 max-w-lg">
            {categoryProducts.length} premium designs in the {categoryName}{" "}
            category.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-6 sm:gap-x-8 sm:gap-y-16">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
