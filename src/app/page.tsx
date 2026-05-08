import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProductCard from "@/components/ProductCard";
import { getProducts, getAllCategories } from "@/lib/products";
import { ArrowRight, Star, ShieldCheck, Truck, Zap, Mail, MapPin, Phone, Camera, Play } from "lucide-react";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const products = await getProducts(50); // Limit to 50 products for performance
  const trending = products.slice(0, 8);

  // Dynamic category counts
  const categoryMap: Record<string, number> = {};
  products.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  });
  const totalCount = products.length;

  return (
    <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
      <AnnouncementBar />
      <Header />
      <Hero products={products} />
      <TrustBar />

      {/* USP Grid */}
      <section className="py-24 border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Handmade", desc: "Premium handcrafted LED neon" },
              { icon: Truck, title: "Free Shipping", desc: "On all orders, PAN-India" },
              { icon: ShieldCheck, title: "1Y Warranty", desc: "Hassle-free replacements" },
              { icon: Star, title: "COD Available", desc: "Pay on delivery" },
            ].map((usp, i) => (
              <div key={i} className="flex items-center gap-4 bg-surface/50 border border-white/5 rounded-2xl p-5">
                <usp.icon className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wide">{usp.title}</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">{usp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Pulse — dynamic counts */}
      <section className="py-24 border-b border-white/5" aria-labelledby="category-heading">
        <div className="container mx-auto px-6">
          <h2 id="category-heading" className="sr-only">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { title: "Shop All", count: `${totalCount} Designs`, color: "from-primary/20", href: "/collections" },
              { title: "Customise", count: "Your Design", color: "from-accent-mint/20", href: "/customizer" },
              { title: "Wings", count: `${categoryMap["Wings"] || 0} Designs`, color: "from-accent-pink/20", href: "/collections/wings" },
              { title: "Cars", count: `${categoryMap["Cars"] || 0} Designs`, color: "from-accent-cyan/20", href: "/collections/cars" },
              { title: "F1", count: `${categoryMap["F1"] || 0} Designs`, color: "from-primary/20", href: "/collections/f1" },
            ].map((cat, i) => (
              <Link
                key={i}
                href={cat.href}
                className="relative h-52 md:h-64 rounded-3xl overflow-hidden bg-surface border border-white/5 p-6 flex flex-col justify-end group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="relative z-10">
                  <span className="text-[10px] font-mono text-primary tracking-[0.3em] uppercase mb-2 block">{cat.count}</span>
                  <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">{cat.title}</h3>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                    Explore Collection <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-24 container mx-auto px-6" aria-labelledby="trending-heading">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-surface/30">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">Stay in the Loop</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Join The Glow</h2>
            <p className="text-text-muted text-sm mb-8">Get 10% off your first order + early access to new drops.</p>
            <NewsletterForm />
            <p className="text-[10px] font-mono text-text-muted mt-4">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <h3 className="text-lg font-black uppercase tracking-tighter mb-4">AMX Signs</h3>
              <p className="text-xs text-text-muted leading-relaxed mb-6">
                Handcrafted LED neon signs for the boldest spaces. Shipped free across India.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/amxsigns"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-surface border border-white/10 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
                  aria-label="AMX Signs on Instagram"
                >
                  <Camera className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com/@amxsigns"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-surface border border-white/10 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
                  aria-label="AMX Signs on YouTube"
                >
                  <Play className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-5">Shop</h4>
              <ul className="space-y-3">
                <li><Link href="/collections" className="text-xs text-text-muted hover:text-primary transition-colors">All Products</Link></li>
                <li><Link href="/collections/wings" className="text-xs text-text-muted hover:text-primary transition-colors">Wings</Link></li>
                <li><Link href="/collections/cars" className="text-xs text-text-muted hover:text-primary transition-colors">Cars</Link></li>
                <li><Link href="/collections/f1" className="text-xs text-text-muted hover:text-primary transition-colors">F1</Link></li>
                <li><Link href="/customizer" className="text-xs text-text-muted hover:text-primary transition-colors">Custom Design</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-5">Support</h4>
              <ul className="space-y-3">
                <li><Link href="/shipping" className="text-xs text-text-muted hover:text-primary transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="text-xs text-text-muted hover:text-primary transition-colors">Returns &amp; Warranty</Link></li>
                <li><Link href="/installation" className="text-xs text-text-muted hover:text-primary transition-colors">Installation Guide</Link></li>
                <li><Link href="/faq" className="text-xs text-text-muted hover:text-primary transition-colors">FAQ</Link></li>
                <li>
                  <a href="mailto:hello@amxsigns.com" className="text-xs text-text-muted hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-5">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-xs text-text-muted">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <a href="mailto:hello@amxsigns.com" className="hover:text-primary transition-colors">hello@amxsigns.com</a>
                </li>
                <li className="flex items-center gap-2 text-xs text-text-muted">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <a href="tel:+919999999999" className="hover:text-primary transition-colors">+91 99999 99999</a>
                </li>
                <li className="flex items-start gap-2 text-xs text-text-muted">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  Mumbai, Maharashtra, India
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em]">
              &copy; {new Date().getFullYear()} AMX Signs. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-[10px] font-mono text-text-muted uppercase tracking-widest hover:text-primary transition-colors">Privacy</Link>
              <Link href="/terms" className="text-[10px] font-mono text-text-muted uppercase tracking-widest hover:text-primary transition-colors">Terms</Link>
              <Link href="/returns" className="text-[10px] font-mono text-text-muted uppercase tracking-widest hover:text-primary transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
