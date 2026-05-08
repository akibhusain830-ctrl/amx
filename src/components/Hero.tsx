'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Truck, Zap, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
interface HeroProps {
  products: any[];
}

const Hero = React.memo(({ products }: HeroProps) => {
  const featured = React.useMemo(() => 
    products?.find(p => p.slug === 'angel-wings') || products?.[0] || {
      title: 'Neon Sign',
      slug: 'neon-sign',
      price: 0,
      category: 'Premium',
      rating: 5,
      badge: 'Popular'
    }, [products]);
  
  const formatPrice = React.useCallback((p: number) => `₹${p.toLocaleString('en-IN')}`, []);

  return (
    <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden bg-black">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-pink/10 rounded-full blur-[60px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content - Conversion Focused */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Social Proof Bar */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-primary fill-current" />
                ))}
              </div>
              <span className="text-[11px] font-mono text-text-muted">
                Premium Quality
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[0.95] mb-4 uppercase tracking-tighter mt-4">
              Neon Signs That<br />
              <span className="text-primary">Transform</span><br />
              Your Space.
            </h1>

            {/* Value Props */}
            <p className="text-base text-text-muted max-w-md mb-6 leading-relaxed">
              Handcrafted LED neon signs shipped free across India. Premium acrylic backing, 1-year warranty, COD available.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/collections">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto bg-primary text-black px-8 py-4 rounded-full font-black text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-2 neon-bloom-lime"
                >
                  Shop Best Sellers <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/customizer">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto border border-white/20 hover:border-primary/50 text-white px-8 py-4 rounded-full font-black text-sm tracking-[0.15em] uppercase transition-colors"
                >
                  Design Your Own
                </motion.button>
              </Link>
            </div>

            {/* Trust Bar */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-primary w-4 h-4" />
                <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">1Y Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="text-primary w-4 h-4" />
                <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="text-primary w-4 h-4" />
                <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Fast Dispatch</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Featured Product Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              {/* Badge */}
              {featured.badge && (
                <div className="inline-flex bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                  {featured.badge}
                </div>
              )}

              {/* Product Visual */}
              <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex flex-col items-center justify-center mb-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-pink/5" />
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-xl font-black uppercase tracking-tight">{featured.title}</p>
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mt-1">{featured.category} Collection</p>
                </div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-20 bg-primary/30 rounded-full blur-[40px]" />
              </div>

              {/* Product Info */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-black text-lg uppercase tracking-tight mb-1">{featured.title}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(featured.rating) ? 'text-primary fill-current' : 'text-white/20'}`} />
                      ))}
                    </div>
                    <span className="text-[11px] text-text-muted">Premium Quality</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-primary">{formatPrice(featured.price)}</p>
                  {featured.original_price && (
                    <p className="text-sm text-text-muted line-through">{formatPrice(featured.original_price)}</p>
                  )}
                </div>
              </div>

              {/* CTA */}
              <Link href={`/products/${featured.slug}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-black py-3 rounded-xl font-black text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-primary transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  View Product
                </motion.button>
              </Link>

              {/* Mini Thumbnails */}
              <div className="flex gap-2 mt-4 justify-center">
                {products.slice(0, 4).map((p) => (
                  <Link key={p.id} href={`/products/${p.slug}`} className="group/thumb">
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover/thumb:border-primary/50 transition-colors">
                      <span className="text-[8px] font-black uppercase text-center leading-tight text-text-muted group-hover/thumb:text-white transition-colors">{p.category.slice(0, 3)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
