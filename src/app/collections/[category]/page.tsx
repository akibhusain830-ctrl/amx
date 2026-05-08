import { notFound } from "next/navigation";
import {
  getProductsByCategory,
  getAllCategories,
} from "@/lib/products";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";

interface CategoryPageProps {
  params: { category: string };
}

export const revalidate = 60; // Revalidate every minute
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const categoryProducts = await getProductsByCategory(params.category);
  const categoryName = categoryProducts[0]?.category || params.category;
  return {
    title: `${categoryName} | Premium Neon Signs | AMX Signs`,
    description: `Discover our exclusive ${categoryName} neon sign collection. Handcrafted premium LED neon for your space. Free shipping India-wide.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryProducts = await getProductsByCategory(params.category);
  if (categoryProducts.length === 0) return notFound();

  const categoryName = categoryProducts[0].category;

  return (
    <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
      <Header />
      <div className="pt-28 pb-24 container mx-auto px-6">
        <div className="mb-12">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
