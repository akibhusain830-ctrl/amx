"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

const CartDrawer = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getTotalPrice,
  } = useCartStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-white/10 z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-black uppercase tracking-tighter">
                  Your Cart
                </h2>
                <span className="text-xs font-mono text-text-muted">
                  ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-3 hover:text-primary transition-colors -mr-1"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-white/10 mb-4" />
                  <p className="text-text-muted text-sm mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-xs text-text-muted/60">
                    Add some neon magic to get started.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-6 bg-primary text-black px-6 py-3 rounded-full font-black text-xs tracking-widest uppercase hover:scale-105 transition-transform"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map(({ product, quantity, selectedSize, selectedPrice, customDetails, cartItemId }) => (
                  <div
                    key={cartItemId ?? `${product.id}-${selectedSize}`}
                    className="flex flex-col xs:flex-row gap-4 bg-black/40 border border-white/5 rounded-2xl p-4"
                  >
                    <div className="w-20 h-20 bg-surface rounded-xl border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                      {customDetails ? (
                        <span
                          className="text-2xl leading-none"
                          style={{ fontFamily: customDetails.fontFamily, color: customDetails.colorHex, textShadow: `0 0 12px ${customDetails.colorHex}` }}
                        >
                          {customDetails.text.slice(0, 2) || "A"}
                        </span>
                      ) : product.image_url ? (
                        <div className="relative w-full h-full">
                          <Image src={product.image_url} alt={product.title} fill className="object-cover" sizes="80px" />
                        </div>
                      ) : (
                        <span className="text-xs font-mono text-text-muted/40 uppercase">
                          IMG
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[10px] font-mono text-primary uppercase tracking-widest">
                            {customDetails ? "Custom Sign" : product.category}
                          </p>
                          <h3 className="text-sm font-black uppercase tracking-tight truncate">
                            {customDetails ? `"${customDetails.text}"` : product.title}
                          </h3>
                          {customDetails ? (
                            <div className="mt-1 space-y-0.5">
                              <span className="text-[10px] font-mono text-text-muted/60 uppercase block">Size: {selectedSize} · {customDetails.dimensions}</span>
                              <span className="text-[10px] font-mono text-text-muted/60 uppercase block">Font: {customDetails.fontName} · Color: {customDetails.color}</span>
                              <span className="text-[10px] font-mono text-text-muted/60 uppercase block">Backing: {customDetails.backing}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono text-text-muted/60 uppercase">Size: {selectedSize}</span>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(product.id, selectedSize, cartItemId)}
                          className="p-2 hover:text-accent-pink transition-colors shrink-0 -mt-1 -mr-1"
                          aria-label={`Remove from cart`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3 gap-3">
                        {!customDetails && (
                          <div className="flex items-center gap-1 bg-black/60 rounded-full border border-white/10">
                            <button
                              onClick={() =>
                                updateQuantity(product.id, selectedSize, quantity - 1)
                              }
                              className="p-2.5 hover:text-primary transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono w-5 text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(product.id, selectedSize, quantity + 1)
                              }
                              className="p-2.5 hover:text-primary transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <p className="text-sm font-mono font-bold whitespace-nowrap ml-auto">
                          {formatPrice(selectedPrice * quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Subtotal</span>
                  <span className="text-lg font-mono font-black">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <p className="text-[10px] text-accent-mint text-center font-mono uppercase tracking-wider">
                  Free shipping on all orders
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-primary text-black py-4 rounded-full font-black text-xs tracking-[0.2em] uppercase text-center hover:scale-[1.02] transition-transform active:scale-95 neon-bloom-lime"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full text-center text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors py-2"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
