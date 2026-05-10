import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getProductsByCategory } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";

interface ProductPageProps {
  params: { slug: string };
}

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map(p => ({ slug: p.slug }));
  } catch {
    // Supabase env vars not available at build time (e.g. Vercel CI).
    return [];
  }
}


export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found | AMX Signs" };
  return {
    title: `${product.title} | AMX Signs`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();

  // Fetch related products from same category (exclude current)
  const related = (await getProductsByCategory(product.category))
    .filter((p) => p.id !== product.id)
    .slice(0, 8);

  return <ProductDetailClient product={product} related={related} />;
}
