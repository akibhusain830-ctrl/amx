import { createClient } from "@supabase/supabase-js";

export interface Product {
  id: string;
  slug: string;
  title: string;
  category: string;
  price: number;
  original_price?: number;
  rating: number;
  review_count: number;
  description: string;
  features: string[];
  in_stock: boolean;
  badge?: string;
  image_url?: string;
  images?: string[];
  addons?: Array<{ id: string; label: string; price: number }>;
  is_trending?: boolean;
  trending_order?: number | null;
  variants: {
    regular: { dimensions: string; price: number; original_price?: number };
    medium: { dimensions: string; price: number; original_price?: number };
    large: { dimensions: string; price: number; original_price?: number };
  };
}

export interface CategoryThumbnail {
  id: string;
  slug: string;
  label: string;
  image_url: string | null;
  updated_at: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getProducts = async (limit?: number): Promise<Product[]> => {
  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data as Product[];
};

export const getTrendingProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_trending", true)
    .order("trending_order", { ascending: true });

  if (error) {
    console.error("Error fetching trending products:", error);
    return [];
  }

  // Fallback: if no trending products configured, return 8 newest
  if (!data || data.length === 0) {
    return getProducts(8);
  }

  return data as Product[];
};

export const getCategoryThumbnails = async (): Promise<Record<string, string | null>> => {
  const { data, error } = await supabase
    .from("category_thumbnails")
    .select("slug, image_url");

  if (error) {
    console.error("Error fetching category thumbnails:", error);
    return {};
  }

  return Object.fromEntries((data ?? []).map((r) => [r.slug, r.image_url]));
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    return null;
  }

  return data as Product;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .ilike("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error fetching products by category ${category}:`, error);
    return [];
  }

  return data as Product[];
};

export const getProductsUnderPrice = async (maxPrice: number): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .lt("price", maxPrice)
    .order("price", { ascending: true });

  if (error) {
    console.error(`Error fetching products under price ${maxPrice}:`, error);
    return [];
  }

  return data as Product[];
};

export const getAllCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("category");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  const categories = data.map((p) => p.category);
  return Array.from(new Set(categories));
};
