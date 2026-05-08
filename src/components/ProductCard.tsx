"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Zap, Truck } from "lucide-react";
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
    <div className="group h-full flex flex-col transition-transform duration-300 hover:-translate-y-2">
      <Link href={`/products/${product.slug}`} className="block relative">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface border border-white/5 group-hover:border-primary/20 transition-all duration-500 mb-6 flex items-center justify-center">
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
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="relative px-6 py-3">
                  <span className="text-xl font-black uppercase tracking-widest text-primary drop-shadow-[0_0_12px_rgba(198,255,0,0.8)] text-center block">
                    {product.title}
                  </span>
                  <div className="absolute inset-0 bg-primary/5 blur-xl -z-10 rounded-lg" />
                </div>
                <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-2">Room Mockup</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-4 left-4 bg-primary text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              {product.badge}
            </div>
          )}

          {/* Free Shipping Badge */}
          <div className="absolute top-4 right-4 bg-accent-mint/90 text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">
            <Truck className="w-3 h-3" />
            Free Ship
          </div>

          {/* Quick Add — always visible */}
          {product.in_stock && (
            <button
              onClick={handleQuickAdd}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2.5 min-h-[40px] rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-colors shadow-lg"
              aria-label={`Quick add ${product.title} to cart`}
            >
              Add to Cart
            </button>
          )}

          {!product.in_stock && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white/60 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest backdrop-blur-md border border-white/10">
              Sold Out
            </div>
          )}
        </div>
      </Link>

      <Link href={`/products/${product.slug}`} className="block mt-auto">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-1 block">
              {product.category}
            </span>
            <h3 className="text-lg font-black uppercase tracking-tighter group-hover:text-primary transition-colors truncate">
              {product.title}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center justify-end gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-primary fill-current' : 'text-white/20'}`} />
              ))}
            </div>
            <div className="flex flex-col items-end">
              {product.original_price && (
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-mono text-text-muted line-through">
                    {formatPrice(product.original_price)}
                  </span>
                  <span className="text-[9px] font-black bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                    SAVE {formatPrice(product.original_price - product.price)}
                  </span>
                </div>
              )}
              <p className="font-mono text-sm text-primary">{formatPrice(product.price)}</p>
              <span className="text-[9px] font-mono text-accent-mint uppercase tracking-wider mt-0.5">+ Free Shipping</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
