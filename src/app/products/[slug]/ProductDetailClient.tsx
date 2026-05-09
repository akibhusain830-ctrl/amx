'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ShieldCheck,
  Truck,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  Zap,
  Package,
  Sparkles,
  Wrench,
  Info,
  Mail,
  Loader2,
} from 'lucide-react';
import { Product } from '@/lib/products';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Header from '@/components/Header';

interface ProductDetailClientProps {
  product: Product;
}

// Notify-me form for sold-out products
function SoldOutNotify({ productTitle, productId }: { productTitle: string; productId: string }) {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'done'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await fetch('/api/notify-restock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, productId, productTitle }),
      });
    } catch {
      /* silent */
    } finally {
      setStatus('done');
    }
  };

  if (status === 'done') {
    return (
      <div className="w-full py-4 rounded-2xl bg-accent-mint/10 border border-accent-mint/20 flex items-center justify-center gap-2 text-accent-mint">
        <Check className="w-5 h-5" />
        <span className="text-sm font-black uppercase tracking-widest">You&apos;ll be notified when it&apos;s back!</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-muted font-mono">This item is sold out. Drop your email and we&apos;ll let you know when it&apos;s back.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Notify Me'}
        </button>
      </form>
    </div>
  );
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [activeTab, setActiveTab] = useState<'details' | 'box' | 'install' | 'faq'>('details');
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [added, setAdded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = product.images || (product.image_url ? [product.image_url] : []);

  const variants = {
    regular: product.variants?.regular ?? { dimensions: '14" x 12"', price: product.price, original_price: product.original_price },
    medium: product.variants?.medium ?? { dimensions: '20" x 16"', price: product.price + 1500, original_price: null },
    large: product.variants?.large ?? { dimensions: '28" x 22"', price: product.price + 3500, original_price: null },
  };

  const currentVariant = selectedSize.toLowerCase() === 'regular'
    ? variants.regular
    : selectedSize.toLowerCase() === 'medium'
      ? variants.medium
      : variants.large;

  const finalPrice = currentVariant.price;
  const finalOriginalPrice = currentVariant.original_price;
  const savings = finalOriginalPrice ? finalOriginalPrice - finalPrice : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, finalPrice);
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 600);
  };

  return (
    <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
      <Header />
      <div className="pt-24 pb-24 container mx-auto px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-text-muted uppercase tracking-widest">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li className="text-white/20">/</li>
            <li>
              <Link href="/collections" className="hover:text-primary transition-colors">
                Shop
              </Link>
            </li>
            <li className="text-white/20">/</li>
            <li>
              <Link href={`/collections/${product.category.toLowerCase()}`} className="hover:text-primary transition-colors">
                {product.category}
              </Link>
            </li>
            <li className="text-white/20">/</li>
            <li className="text-white">{product.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Area with Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            {/* Main Image */}
            <div className="relative aspect-[9/10] rounded-3xl overflow-hidden border border-white/10 bg-surface flex items-center justify-center">
              {images.length > 0 && images[selectedImageIndex] ? (
                <img src={images[selectedImageIndex]} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f1a] flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(198,255,0,0.08) 0%, transparent 70%)' }} />
                  <div className="relative z-10 flex flex-col items-center justify-center px-8">
                    <div className="relative px-8 py-4 border border-primary/30 rounded-xl bg-primary/5">
                      <span className="text-2xl md:text-3xl font-black uppercase tracking-widest text-primary drop-shadow-[0_0_16px_rgba(198,255,0,0.8)] text-center block">
                        {product.title}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-4">Room Mockup Preview</p>
                  </div>
                </div>
              )}
              {product.badge && <div className="absolute top-4 left-4 bg-primary text-black text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">{product.badge}</div>}
              {!product.in_stock && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-2xl font-black uppercase tracking-tighter text-white/60">Sold Out</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-[9/10] w-16 sm:w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? 'border-primary' : 'border-white/10 hover:border-white/30'
                      }`}
                  >
                    <img src={img} alt={`${product.title} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            <span className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] mb-3">{product.category}</span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">{product.title}</h1>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-mono font-black text-primary">{formatPrice(finalPrice)}</span>
              {finalOriginalPrice && <span className="text-lg font-mono text-text-muted line-through">{formatPrice(finalOriginalPrice)}</span>}
              {savings > 0 && (
                <span className="text-[10px] font-black bg-primary/20 text-primary px-2 py-1 rounded uppercase tracking-wider">
                  SAVE {formatPrice(savings)}
                </span>
              )}
            </div>
            {product.original_price && (
              <div className="mb-6">
                <span className="inline-flex text-[10px] font-black bg-primary text-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                  EXTRA 20% OFF - USE COUPON FIRSTSIGN
                </span>
              </div>
            )}

            <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-lg">Product color may slightly vary from the images due to the difference in lighting.</p>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-text-muted">Size</span>
                <span className="text-[10px] font-mono text-primary">{(currentVariant.dimensions?.replace(/""+/g, '"') || '') + ' inches'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Regular', data: variants.regular },
                  { name: 'Medium', data: variants.medium },
                  { name: 'Large', data: variants.large },
                ].map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    className={`relative py-3.5 px-3 rounded-xl text-sm font-black uppercase tracking-wider border transition-all ${selectedSize === size.name ? 'bg-primary text-black border-primary' : 'bg-surface border-white/10 text-text-muted hover:border-white/30'
                      }`}
                  >
                    {size.name}
                    <span className="block text-xs font-mono mt-1 opacity-80">{formatPrice(size.data.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            {product.in_stock ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-text-muted">Quantity</span>
                  <div className="flex items-center gap-2 bg-surface rounded-full border border-white/10">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-primary transition-colors" aria-label="Decrease quantity">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-mono w-8 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-primary transition-colors" aria-label="Increase quantity">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className={`w-full py-5 rounded-full font-black text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all ${added ? 'bg-accent-mint text-black' : 'bg-primary text-black neon-bloom-lime'
                    }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" /> Add to Cart
                    </>
                  )}
                </motion.button>
              </div>
            ) : (
              <SoldOutNotify productTitle={product.title} productId={product.id} />
            )}

            {/* Trust Badges */}
            <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4 border-t border-white/10">
              <div className="flex items-center sm:flex-col gap-3 sm:gap-2 sm:text-center">
                <ShieldCheck className="text-primary w-6 h-6 shrink-0" />
                <span className="text-xs sm:text-[10px] font-mono text-text-muted uppercase tracking-widest">1 Year Warranty</span>
              </div>
              <div className="flex items-center sm:flex-col gap-3 sm:gap-2 sm:text-center">
                <Truck className="text-primary w-6 h-6 shrink-0" />
                <span className="text-xs sm:text-[10px] font-mono text-text-muted uppercase tracking-widest">Free Shipping</span>
              </div>
              <div className="flex items-center sm:flex-col gap-3 sm:gap-2 sm:text-center">
                <Check className="text-primary w-6 h-6 shrink-0" />
                <span className="text-xs sm:text-[10px] font-mono text-text-muted uppercase tracking-widest">Handcrafted</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabbed Content */}
        <div className="mt-20">
          <div className="flex gap-4 border-b border-white/10 mb-6 overflow-x-auto scrollbar-hide">
            {[
              { id: 'details', label: 'Product Details', icon: Info },
              { id: 'box', label: 'In The Box', icon: Package },
              { id: 'install', label: 'Installation', icon: Wrench },
              { id: 'faq', label: 'FAQs', icon: Sparkles },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 pb-3 text-[11px] font-black uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-white'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'details' && (
              <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="rounded-2xl border border-white/10 bg-surface/70 p-5 md:p-6 mb-5">
                  <p className="text-primary font-mono text-[10px] uppercase tracking-[0.3em] mb-2">Product Details</p>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">About This Sign</h3>
                  <p className="text-text-muted leading-relaxed text-base md:text-lg max-w-3xl">{product.description}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                  {product.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 bg-surface border border-white/10 rounded-xl p-4 hover:border-primary/30 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm md:text-base text-white/90">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {activeTab === 'box' && (
              <motion.div key="box" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: Zap, label: 'Neon Sign', desc: 'Your chosen design in LED neon' },
                    { icon: Package, label: 'Mounting Kit', desc: 'Screws, wall anchors & brackets' },
                    { icon: ShieldCheck, label: '1Y Warranty Card', desc: 'Register for full coverage' },
                    { icon: Sparkles, label: '12V Power Adapter', desc: '12V safe low-voltage adapter' },
                    { icon: Wrench, label: 'Install Guide', desc: 'Step-by-step manual included' },
                    { icon: Truck, label: 'Protective Packaging', desc: 'Foam-lined corrugated box' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-white/5 rounded-xl p-5">
                      <item.icon className="w-6 h-6 text-primary mb-3" />
                      <h4 className="text-sm font-black uppercase tracking-wide mb-1">{item.label}</h4>
                      <p className="text-[11px] text-text-muted">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {activeTab === 'install' && (
              <motion.div key="install" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
                  {[
                    { step: '01', title: 'Mark & Drill', desc: 'Use included template to mark holes. Drill with 6mm bit.' },
                    { step: '02', title: 'Insert Anchors', desc: 'Push wall anchors into drilled holes.' },
                    { step: '03', title: 'Mount Brackets', desc: 'Screw brackets flush to wall.' },
                    { step: '04', title: 'Hang & Plug', desc: 'Slide sign onto brackets. Connect 12V adapter.' },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 bg-surface border border-white/5 rounded-xl p-5">
                      <span className="text-2xl font-black text-primary/30">{item.step}</span>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-wide mb-1">{item.title}</h4>
                        <p className="text-[11px] text-text-muted">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-mono text-text-muted mt-6">Installation time: ~10 minutes. No electrician required.</p>
              </motion.div>
            )}
            {activeTab === 'faq' && (
              <motion.div key="faq" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl space-y-4">
                {[
                  { q: 'Is it safe for bedrooms?', a: 'Yes. Our signs use 12V low-voltage LEDs that stay cool to the touch and consume very little power.' },
                  { q: 'Can I use it outdoors?', a: 'Our signs are designed for indoor use.' },
                  { q: 'What\'s the return policy?', a: '7-day no-questions return. If the sign arrives damaged, we replace it free — no return needed.' },
                  { q: 'How long does shipping take?', a: 'We provide fast dispatch. Metro cities: 3-5 days. Others: 5-8 days.' },
                  { q: 'Can I customise the text?', a: 'Absolutely. Contact us with your idea and our team will help craft a custom neon design for you.' },
                ].map((faq, i) => (
                  <div key={i} className="bg-surface border border-white/5 rounded-xl p-5">
                    <h4 className="text-sm font-black uppercase tracking-wide mb-2">{faq.q}</h4>
                    <p className="text-[11px] text-text-muted leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sticky Mobile Add to Cart */}
      {product.in_stock && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:hidden z-50">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-lg font-mono font-black text-primary">{formatPrice(finalPrice)}</p>
              {finalOriginalPrice && <p className="text-[10px] font-mono text-text-muted line-through">{formatPrice(finalOriginalPrice)}</p>}
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              className={`px-8 py-3.5 rounded-full font-black text-xs tracking-[0.15em] uppercase flex items-center gap-2 ${added ? 'bg-accent-mint text-black' : 'bg-primary text-black'
                }`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              {added ? 'Added' : 'Add to Cart'}
            </motion.button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductDetailClient;
