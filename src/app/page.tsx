import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { getTrendingProducts, getCategoryThumbnails } from "@/lib/products";
import { Star, ShieldCheck, Truck, Zap } from "lucide-react";
import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const trending = await getTrendingProducts();
  const categoryThumbs = await getCategoryThumbnails();

  const categories = [
    { title: "Shop All",   image: categoryThumbs["shop-all"],   href: "/collections" },
    { title: "Cafe",        image: categoryThumbs["cafe"],        href: "/collections/cafe" },
    { title: "Aesthetic",   image: categoryThumbs["aesthetic"],   href: "/collections/aesthetic" },
    { title: "Love",        image: categoryThumbs["love"],        href: "/collections/love" },
    { title: "Wings",       image: categoryThumbs["wings"],       href: "/collections/wings" },
    { title: "Gaming",      image: categoryThumbs["gaming"],      href: "/collections/gaming" },
    { title: "Pop Culture", image: categoryThumbs["pop-culture"], href: "/collections/pop-culture" },
    { title: "Cars",        image: categoryThumbs["cars"],        href: "/collections/cars" },
    { title: "Under 4000",  image: categoryThumbs["under-4000"],  href: "/collections/under-4000" },
    { title: "Bestsellers", image: categoryThumbs["bestsellers"] ?? trending[0]?.image_url, href: "/collections" },
  ];

  return (
    <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
      <AnnouncementBar />
      <Header />
      <Hero />


      {/* USP Strip */}
      <section className="py-4 md:py-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
          {/* Mobile: compact single row scroll */}
          <div className="flex overflow-x-auto gap-3 scrollbar-hide md:hidden -mx-6 px-6 pb-2">
            {[
              { icon: Zap, title: "Handmade" },
              { icon: Truck, title: "Free Shipping" },
              { icon: ShieldCheck, title: "1Y Warranty" },
              { icon: Star, title: "Easy Install" },
            ].map((usp, i) => (
              <div key={i} className="flex items-center gap-2 bg-surface/50 border border-white/5 rounded-full px-3 py-2.5 shrink-0">
                <usp.icon className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs font-black uppercase tracking-wide whitespace-nowrap">{usp.title}</span>
              </div>
            ))}
          </div>
          {/* Desktop: 4-column grid */}
          <div className="hidden md:grid grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Handmade", desc: "Premium handcrafted LED neon" },
              { icon: Truck, title: "Free Shipping", desc: "On all orders, PAN-India" },
              { icon: ShieldCheck, title: "1Y Warranty", desc: "Hassle-free replacements" },
              { icon: Star, title: "Easy Installation", desc: "Plug & play setup" },
            ].map((usp, i) => (
              <div key={i} className="flex items-center gap-4 bg-surface/50 border border-white/5 rounded-2xl p-5">
                <usp.icon className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wide">{usp.title}</h4>
                  <p className="text-xs text-text-muted mt-0.5">{usp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Pulse — dynamic counts */}
      <section className="py-6 border-b border-white/5" aria-labelledby="category-heading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-6">
            <span className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-3 block">Explore</span>
            <h2 id="category-heading" className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              Categories
            </h2>
          </div>
          {/* Mobile: Carousel | Desktop: 5x2 Grid */}
          <div className="md:hidden grid grid-cols-2 gap-4 pb-8">
            {categories.map((cat, i) => (
              <CategoryCard key={i} cat={cat} useTransition={true} />
            ))}
          </div>

          <div className="hidden md:grid grid-cols-5 gap-6">
            {categories.map((cat, i) => (
              <CategoryCard key={i} cat={cat} useTransition={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-10 md:py-12 container mx-auto px-4 sm:px-6" aria-labelledby="trending-heading">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-6">
          <div>
            <span className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">Hottest Picks</span>
            <h2 id="trending-heading" className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              Trending <br /> Collections
            </h2>
          </div>
          <Link href="/collections" className="text-xs font-black uppercase tracking-[0.2em] border-b-2 border-primary pb-2 hover:text-primary transition-colors">
            View All Products
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-6 sm:gap-x-8 sm:gap-y-16">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} useTransition={true} />
          ))}
        </div>
      </section>



    </main>
  );
}
