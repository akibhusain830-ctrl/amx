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
  variants: {
    regular: { dimensions: string; price: number; original_price?: number };
    medium: { dimensions: string; price: number; original_price?: number };
    large: { dimensions: string; price: number; original_price?: number };
  };
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
