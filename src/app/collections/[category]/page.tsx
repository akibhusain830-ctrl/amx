import {
  getProductsByCategory,
  getAllCategories,
  getProductsUnderPrice,
} from "@/lib/products";
import Header from "@/components/Header";
import Link from "next/link";
import { mapDbCategoryToLabel, mapSlugToDbCategory } from "@/lib/categories";
import CollectionGrid from "./CollectionGrid";

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
  let categoryName;
  if (params.category.toLowerCase() === "under-4000") {
    categoryName = "Under 4000";
  } else {
    categoryName = mapDbCategoryToLabel(dbCategory);
  }

  const title = `${categoryName} Neon Signs | Custom LED Neon India | AMX Signs`;
  const description = `Shop our premium ${categoryName} neon sign collection. Handcrafted, energy-efficient LED neon signs for your space. Free PAN-India shipping and 1-year warranty.`;
  const canonicalUrl = `https://amxsigns.com/collections/${params.category}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
  };
}

// Category content map — makes category pages content-rich for SEO (Phase 2B)
const categoryContent: Record<string, { h1: string; h2: string; intro: string }> = {
  'cars': {
    h1: 'Car & Automotive Neon Signs',
    h2: 'Handcrafted LED Art for Garages & Showrooms',
    intro: 'Transform your garage, home showroom, or man cave with our automotive neon collection. Each sign features a precision-cut LED silhouette of iconic cars — from BMW and Ferrari to F1 racing machinery. Designed for car enthusiasts who want their passion on the wall. Handcrafted in India with 12V low-voltage LEDs, silent operation, and free PAN-India shipping.',
  },
  'gaming': {
    h1: 'Gaming Neon Signs India',
    h2: 'Level Up Your Setup with Custom LED Neon',
    intro: 'Elevate your gaming setup, streaming background, or bedroom with our gaming neon collection. From controller silhouettes to iconic game logos, each piece is handcrafted with high-quality LED neon flex. Built for gamers who take their space as seriously as their builds. Fast delivery across India, plug-and-play installation, and a 1-year warranty.',
  },
  'anime': {
    h1: 'Anime Neon Signs India',
    h2: 'Display Your Passion with LED Neon Wall Art',
    intro: 'Show your love for Japanese animation with our anime neon sign collection. Featuring iconic characters and symbols from Dragon Ball, Naruto, and more — each sign is a handcrafted LED art piece. Perfect for bedrooms, study rooms, and collectors. All signs are made with silent, cool-running 12V LEDs and ship free across India.',
  },
  'f1': {
    h1: 'F1 & Racing Neon Signs',
    h2: 'Premium Formula 1 LED Wall Art for Race Fans',
    intro: 'Bring the racetrack home with our Formula 1 neon collection. Featuring iconic circuit layouts, team logos, and racing car silhouettes — these signs are designed for F1 fans, home offices, and premium man caves. Every piece is handcrafted in India with precision-cut LED neon and delivered free across the country.',
  },
  'aesthetic': {
    h1: 'Aesthetic Neon Signs India',
    h2: 'Minimalist LED Wall Art for Modern Interiors',
    intro: 'Our aesthetic neon collection features clean lines, mood-setting phrases, and visual art that works with minimalist and modern interiors. Ideal for bedrooms, cafés, photo studios, and creative workspaces. Each sign is handcrafted with low-heat, silent LEDs and ships free across India with a 1-year warranty.',
  },
  'love': {
    h1: 'Love & Gift Neon Signs India',
    h2: 'Meaningful LED Neon for Anniversaries & Birthdays',
    intro: 'Our love and gifting neon collection is designed for moments that matter. Heart signs, romantic phrases, and personalised designs that make for unforgettable anniversary, birthday, or Valentine\'s Day gifts. Every sign is handcrafted in India, wrapped in secure packaging, and delivered free across the country.',
  },
  'wings': {
    h1: 'Wings Neon Signs India',
    h2: 'Statement LED Wall Art for Bedrooms & Photo Backdrops',
    intro: 'Our wings neon collection is a statement piece for bedrooms, dressing rooms, and photography backdrops. Each design captures the elegance of wing art in glowing LED form. Handcrafted with precision, these signs are silent, cool-running, and come with a full mounting kit for DIY installation.',
  },
  'cafe': {
    h1: 'Café & Restaurant Neon Signs India',
    h2: 'Professional LED Signage for Hospitality Businesses',
    intro: 'Attract customers and define your brand identity with our café and restaurant neon collection. From coffee cup silhouettes to custom phrases, these signs are designed for commercial environments — cafés, bars, reception walls, and pop-up events. Built for continuous use with energy-efficient 12V LEDs and free shipping across India.',
  },
  'under-4000': {
    h1: 'Neon Signs Under ₹4000',
    h2: 'Premium LED Neon Art at Affordable Prices',
    intro: 'Premium neon art does not have to cost a premium. Our under ₹4000 collection features handcrafted LED neon signs that deliver the same quality and impact as our full-price range. Free PAN-India shipping included on all orders. Browse our bestsellers and find your perfect piece within budget.',
  },
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const dbCategory = mapSlugToDbCategory(params.category);
  
  let categoryProducts;
  let categoryName;

  if (params.category.toLowerCase() === "under-4000") {
    categoryProducts = await getProductsUnderPrice(4000);
    categoryName = "Under 4000";
  } else {
    categoryProducts = await getProductsByCategory(dbCategory);
    categoryName = mapDbCategoryToLabel(categoryProducts[0]?.category || dbCategory);
  }

  const siteUrl = 'https://amxsigns.com';
  const catSlug = params.category.toLowerCase();
  const content = categoryContent[catSlug];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": "Collections", "item": `${siteUrl}/collections` },
      { "@type": "ListItem", "position": 3, "name": categoryName, "item": `${siteUrl}/collections/${params.category}` }
    ]
  };

  // ItemList schema — enables Google carousel-style rich results for this category
  const itemListSchema = categoryProducts.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${categoryName} Neon Signs`,
    "url": `${siteUrl}/collections/${params.category}`,
    "itemListElement": categoryProducts.slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${siteUrl}/products/${p.slug}`,
      "name": `${p.title} Neon Sign`,
    }))
  } : null;

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
              {content?.h1 || categoryName}
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <div className="pt-24 pb-24 container mx-auto px-4 sm:px-6">
        <div className="mb-6 md:mb-12">
          <span className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">
            Collection
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            {content?.h1 || categoryName}
          </h1>
          {content?.h2 && (
            <h2 className="text-lg md:text-xl font-semibold text-text-muted mt-2 tracking-tight">
              {content.h2}
            </h2>
          )}
          {content?.intro && (
            <p className="text-text-muted text-sm leading-relaxed mt-4 max-w-2xl">
              {content.intro}
            </p>
          )}
        </div>

        <CollectionGrid products={categoryProducts} />
      </div>
    </main>
  );
}
