"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Zap, Truck, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/products";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard = React.memo(({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const regPrice = product.variants?.regular?.price ?? product.price;
    addItem(product, "Regular", regPrice);
    openCart();
  };

  return (
    <div className="group h-full flex flex-col bg-surface border border-white/5 rounded-2xl p-3.5 sm:p-3 transition-transform duration-300 hover:-translate-y-1 hover:border-primary/20">
      <Link href={`/products/${product.slug}`} className="block relative">
        <div className="relative aspect-[9/10] sm:aspect-square rounded-xl overflow-hidden bg-black border border-white/5 transition-all duration-500 mb-4 flex items-center justify-center">
          {/* Product Image or Room Mockup Placeholder */}
          {product.image_url ? (
            <Image 
              src={product.image_url} 
              alt={product.title} 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f1a] flex items-center justify-center">
              {/* Wall texture */}
              <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(198,255,0,0.08) 0%, transparent 70%)'}} />
              {/* Neon sign glow */}
              <div className="relative z-10 flex flex-col items-center justify-center p-4">
                <div className="relative px-4 py-2 text-center">
                  <span className="text-sm font-black uppercase tracking-widest text-primary drop-shadow-[0_0_8px_rgba(198,255,0,0.8)] block line-clamp-2 leading-tight">
                    {product.title}
                  </span>
                  <div className="absolute inset-0 bg-primary/5 blur-xl -z-10 rounded-lg" />
                </div>
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-1">Mockup</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 bg-primary text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
              {product.badge}
            </div>
          )}

          {/* Free Shipping Badge */}
          <div className="absolute bottom-2 left-2 bg-accent-mint/90 text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg backdrop-blur-md">
            <Truck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Free Ship</span>
          </div>

          {/* Quick Add — Icon only */}
          {product.in_stock && (
            <button
              onClick={handleQuickAdd}
              className="absolute bottom-2 right-2 bg-white text-black w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary hover:scale-110 transition-all shadow-lg"
              aria-label={`Quick add ${product.title} to cart`}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}

          {!product.in_stock && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white/60 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest backdrop-blur-md border border-white/10">
              Sold Out
            </div>
          )}
        </div>
      </Link>

      <Link href={`/products/${product.slug}`} className="flex flex-col flex-1 mt-auto">
        <div className="flex flex-col flex-1">
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-mono text-primary uppercase tracking-[0.2em]">
                {product.category}
              </span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? 'text-primary fill-current' : 'text-white/20'}`} />
                ))}
              </div>
            </div>
            <h3 className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[40px] leading-tight">
              {product.title}
            </h3>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-2">
              <p className="font-mono text-sm font-bold">{formatPrice(product.price)}</p>
              {product.original_price && (
                <span className="text-[10px] font-mono text-text-muted line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            
            {product.original_price && (
              <div className="inline-flex items-center gap-1 bg-accent-mint/10 text-accent-mint text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded">
                <Zap className="w-3 h-3" />
                Get it for {formatPrice(product.price * 0.8)}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
