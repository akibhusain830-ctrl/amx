'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  AlertCircle,
} from 'lucide-react';
import { Product } from '@/lib/products';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Header from '@/components/Header';

interface ProductDetailClientProps {
  product: Product;
  related?: Product[];
}

// Notify-me form for sold-out products
function SoldOutNotify({ productTitle, productId }: { productTitle: string; productId: string }) {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/notify-restock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, productId, productTitle }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('done');
    } catch {
      setStatus('error');
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

  if (status === 'error') {
    return (
      <div className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center gap-2 text-red-400">
        <AlertCircle className="w-5 h-5" />
        <span className="text-sm font-black uppercase tracking-widest">Failed to register — try again.</span>
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

// Category-specific use-case sentence — seals search intent match
const useCaseByCategory: Record<string, string> = {
  'Cars':      'A reliable choice for garage walls, home showrooms, or as a gift for automotive enthusiasts.',
  'Gaming':    'Designed for gaming setups, streaming backgrounds, and bedroom accent lighting.',
  'Anime':     'Popular among collectors and fans looking to display their passion for Japanese animation.',
  'F1':        'Ideal for race fans, home offices, and premium man caves.',
  'Aesthetic': 'Pairs well with minimalist interiors, café setups, and creative studio spaces.',
  'Love':      'A meaningful personalised gift for anniversaries, Valentine\'s Day, or home décor.',
  'Wings':     'Works as a statement wall piece for bedrooms, dressing rooms, and photo backdrops.',
  'Cafe':      'Designed for café environments, reception walls, and hospitality interiors.',
};

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product, related = [] }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [activeTab, setActiveTab] = useState<'details' | 'box' | 'install' | 'faq'>('details');
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [added, setAdded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = product.images && product.images.length > 0 ? product.images : (product.image_url ? [product.image_url] : []);

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
    <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary" itemScope itemType="https://schema.org/Product">
      <Header />
      <div className="pt-24 pb-28 lg:pb-16 container mx-auto px-4 lg:px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-text-muted uppercase tracking-widest">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" className="hover:text-primary transition-colors" itemProp="item">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li className="text-white/20">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/collections" className="hover:text-primary transition-colors" itemProp="item">
                <span itemProp="name">Shop</span>
              </Link>
              <meta itemProp="position" content="2" />
            </li>
            <li className="text-white/20">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href={`/collections/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary transition-colors" itemProp="item">
                <span itemProp="name">{product.category}</span>
              </Link>
              <meta itemProp="position" content="3" />
            </li>
            <li className="text-white/20">/</li>
            <li className="text-white" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name">{product.title}</span>
              <meta itemProp="position" content="4" />
            </li>
          </ol>
        </nav>

        <article className="grid lg:grid-cols-[56px_1fr_1fr] xl:grid-cols-[64px_1fr_1fr] gap-4 lg:gap-6 xl:gap-10">
          {/* Vertical Thumbnail Strip — desktop only */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex flex-col gap-2.5"
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative aspect-square w-full rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  selectedImageIndex === idx
                    ? 'border-primary shadow-[0_0_10px_rgba(198,255,0,0.4)]'
                    : 'border-white/10 hover:border-white/30'
                }`}
                title={`View ${product.title} Detail ${idx + 1}`}
              >
                <Image 
                  src={img} 
                  alt={`${product.title} LED Neon Sign Detail View - ${idx + 1}`} 
                  fill 
                  className="object-cover" 
                  sizes="64px" 
                />
              </button>
            ))}
          </motion.div>

          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-3"
          >
            <div className="relative aspect-square lg:max-h-[calc(100vh-180px)] rounded-2xl lg:rounded-3xl overflow-hidden border border-white/10 bg-surface flex items-center justify-center">
              {images.length > 0 && images[selectedImageIndex] ? (
                <Image 
                  src={images[selectedImageIndex]} 
                  alt={`${product.title} ${product.category} LED Neon Wall Art - Handcrafted Premium Decor`}
                  title={`${product.title} | AMX Signs High Quality LED Neon`}
                  fill 
                  className="object-cover" 
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  itemProp="image"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f1a] flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(198,255,0,0.08) 0%, transparent 70%)' }} />
                  <div className="relative z-10 flex flex-col items-center justify-center px-8 text-center">
                    <span className="text-2xl md:text-3xl font-black uppercase tracking-widest text-primary drop-shadow-[0_0_16px_rgba(198,255,0,0.8)] block">
                      {product.title}
                    </span>
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-4">Premium Handcrafted Neon Art</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Thumbnails */}
            {images.length > 1 && (
              <div className="flex lg:hidden gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-square w-14 sm:w-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-primary' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <Image src={img} alt={`${product.title} view ${idx + 1}`} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <div className="flex flex-col lg:pr-1">
            <span className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-2">{product.category} Collection</span>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4" itemProp="name">{product.title}</h1>
            <meta itemProp="brand" content="AMX Signs" />
            <meta itemProp="manufacturer" content="AMX Signs" />

            <div className="flex items-baseline gap-3 mb-1" itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <span className="text-3xl font-mono font-black text-primary" itemProp="price" content={finalPrice.toString()}>{formatPrice(finalPrice)}</span>
              <meta itemProp="priceCurrency" content="INR" />
              {finalOriginalPrice && <span className="text-lg font-mono text-text-muted line-through">{formatPrice(finalOriginalPrice)}</span>}
            </div>
            
            <p className="text-white/80 text-xs leading-relaxed mb-6 max-w-lg">Handcrafted with high quality LED technology. Perfect for garages, gaming setups, and modern home decor.</p>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-text-muted">Available Sizes</span>
                <span className="text-[10px] font-mono text-primary">{(currentVariant.dimensions?.replace(/""+/g, '"') || '')}</span>
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

            {/* Add to Cart Section */}
            {product.in_stock ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-text-muted">Quantity</span>
                  <div className="flex items-center gap-2 bg-surface rounded-full border border-white/10">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-primary transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-mono w-8 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-primary transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleAddToCart}
                  className={`w-full py-5 rounded-full font-black text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all ${added ? 'bg-accent-mint text-black' : 'bg-primary text-black neon-bloom-lime'
                    }`}
                >
                  {added ? <><Check className="w-5 h-5" /> Added to Cart</> : <><ShoppingBag className="w-5 h-5" /> Add to Cart</>}
                </motion.button>
              </div>
            ) : (
              <SoldOutNotify productTitle={product.title} productId={product.id} />
            )}

            {/* Trust Badges */}
            <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10">
              <div className="flex items-center sm:flex-col gap-3 sm:gap-2 sm:text-center">
                <ShieldCheck className="text-primary w-6 h-6 shrink-0" />
                <span className="text-xs sm:text-[10px] font-mono text-text-muted uppercase tracking-widest">1 Year Warranty</span>
              </div>
              <div className="flex items-center sm:flex-col gap-3 sm:gap-2 sm:text-center">
                <Truck className="text-primary w-6 h-6 shrink-0" />
                <span className="text-xs sm:text-[10px] font-mono text-text-muted uppercase tracking-widest">Fast India Shipping</span>
              </div>
              <div className="flex items-center sm:flex-col gap-3 sm:gap-2 sm:text-center">
                <Check className="text-primary w-6 h-6 shrink-0" />
                <span className="text-xs sm:text-[10px] font-mono text-text-muted uppercase tracking-widest">Handcrafted in India</span>
              </div>
            </div>
          </div>
        </article>

        {/* Tabbed Content */}
        <div className="mt-20">
          <div className="flex gap-4 border-b border-white/10 mb-6 overflow-x-auto scrollbar-hide">
            {[
              { id: 'details', label: 'Product Information', icon: Info },
              { id: 'box', label: 'What is In The Box', icon: Package },
              { id: 'install', label: 'Easy Installation', icon: Wrench },
              { id: 'faq', label: 'Product FAQs', icon: Sparkles },
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

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'details' && (
                <motion.section key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="rounded-2xl border border-white/10 bg-surface/70 p-5 md:p-6 mb-5">
                    <span className="text-primary font-mono text-[10px] uppercase tracking-[0.3em] mb-2 block">Product Details</span>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">About {product.title} Neon Wall Art</h2>
                    <p className="text-text-muted leading-relaxed text-base md:text-lg max-w-3xl" itemProp="description">{product.description}</p>
                    {useCaseByCategory[product.category] && (
                      <p className="text-text-muted/70 text-sm leading-relaxed mt-3 italic max-w-3xl">
                        {useCaseByCategory[product.category]}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mb-6">
                    {product.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 bg-surface border border-white/10 rounded-xl p-4 hover:border-primary/30 transition-colors">
                        <Check className="w-4 h-4 text-primary" />
                        <span className="text-sm md:text-base text-white/90">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technical Specifications Table — increases dwell time */}
                  <div className="rounded-xl border border-white/10 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10 bg-surface/50">
                      <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Technical Specifications</h3>
                    </div>
                    <table className="w-full text-sm">
                      <tbody>
                        {[
                          ['Power Supply', '12V DC Adapter (included)'],
                          ['Operation', 'Silent — no hum, no heat'],
                          ['Mounting', 'Screws & brackets (included)'],
                          ['Lifespan', '50,000+ hours'],
                          ['Installation', 'DIY — under 10 minutes'],
                          ['Country of Origin', 'India'],
                        ].map(([label, value]) => (
                          <tr key={label} className="border-b border-white/5 last:border-0">
                            <td className="px-4 py-3 text-text-muted text-xs uppercase tracking-wider font-mono w-1/2">{label}</td>
                            <td className="px-4 py-3 text-white/90 text-sm">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.section>
              )}
              {activeTab === 'box' && (
                <motion.section key="box" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { icon: Zap, label: `${product.title} Neon Sign`, desc: 'Your handcrafted design in premium LED neon' },
                      { icon: Package, label: 'Standard Mounting Kit', desc: 'Screws, wall anchors & mounting brackets' },
                      { icon: ShieldCheck, label: 'Official 1Y Warranty', desc: 'Peace of mind with full coverage' },
                      { icon: Sparkles, label: '12V Power Adapter', desc: 'Safe low-voltage adapter for Indian outlets' },
                      { icon: Wrench, label: 'Step-by-Step Guide', desc: 'Easy manual for DIY setup' },
                      { icon: Truck, label: 'Secure Packaging', desc: 'Foam-lined box for zero-damage transit' },
                    ].map((item, i) => (
                      <div key={i} className="bg-surface border border-white/5 rounded-xl p-5">
                        <item.icon className="w-6 h-6 text-primary mb-3" />
                        <h3 className="text-sm font-black uppercase tracking-wide mb-1">{item.label}</h3>
                        <p className="text-[11px] text-text-muted">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}
              {activeTab === 'install' && (
                <motion.section key="install" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h2 className="text-xl font-black uppercase mb-6">How to Install Your Neon Sign</h2>
                  <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
                    {[
                      { step: '01', title: 'Mark & Drill', desc: 'Use the included template to mark holes. Drill with a 6mm bit.' },
                      { step: '02', title: 'Insert Anchors', desc: 'Gently push wall anchors into the drilled holes.' },
                      { step: '03', title: 'Mount Brackets', desc: 'Screw the wall brackets flush to your surface.' },
                      { step: '04', title: 'Hang & Glow', desc: 'Slide the sign onto brackets and connect the 12V adapter.' },
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
                </motion.section>
              )}
              {activeTab === 'faq' && (
                <motion.section key="faq" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl space-y-4">
                  <h2 className="text-xl font-black uppercase mb-6">Common Questions about {product.title}</h2>
                  {[
                    { q: 'Is this LED neon safe for my bedroom?', a: 'Yes. AMX Signs use safe, 12V low-voltage technology. They stay cool to the touch and are 100% silent.' },
                    { q: 'What is your shipping time for metro cities?', a: 'We offer fast dispatch. Most metro cities (Mumbai, Delhi, Bangalore) receive delivery in 3-5 days.' },
                    { q: 'What happens if it arrives damaged?', a: 'We have a zero-risk policy. If the sign is damaged in transit, we will replace it free of charge.' },
                    { q: 'Does it come with a dimmer?', a: 'All our signs are dimmer-compatible. You can purchase a separate dimmer remote to adjust brightness.' },
                  ].map((faq, i) => (
                    <div key={i} className="bg-surface border border-white/5 rounded-xl p-5">
                      <h4 className="text-sm font-black uppercase tracking-wide mb-2">{faq.q}</h4>
                      <p className="text-[11px] text-text-muted leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Add to Cart */}
      {product.in_stock && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden z-50">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-lg font-mono font-black text-primary">{formatPrice(finalPrice)}</p>
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

      {/* You May Also Like */}
      {related.length > 0 && (
        <section className="bg-black border-t border-white/5 pt-10 pb-32 md:py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="mb-8">
              <span className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-3 block">Related Designs</span>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">You May Also Like</h2>
            </div>
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 scroll-px-4 lg:-mx-6 lg:px-6 lg:scroll-px-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className="group shrink-0 w-[160px] sm:w-[200px] md:w-[220px] snap-start"
                  title={`View ${item.title} Neon Sign`}
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface border border-white/5 group-hover:border-primary/30 transition-all duration-300 mb-3">
                    {item.image_url ? (
                       <Image 
                         src={item.image_url} 
                         alt={`${item.title} LED Neon Sign - Handcrafted Art`} 
                         fill 
                         className="object-cover group-hover:scale-105 transition-transform duration-500" 
                         sizes="220px" 
                       />
                     ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-primary font-black uppercase text-sm tracking-widest">{item.category[0]}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wide truncate">{item.title}</p>
                  <p className="text-primary font-mono text-sm font-black mt-0.5">{formatPrice(item.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetailClient;
