"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  ShoppingBag,
  Check,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<"details" | "payment" | "success">(
    "details"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const itemsPayload = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
      }));

      const { data: orderId, error: orderError } = await supabase.rpc("create_checkout_order", {
        p_name: formData.name,
        p_email: formData.email,
        p_phone: formData.phone,
        p_address: formData.address,
        p_items: itemsPayload,
      });

      if (orderError) throw orderError;

      // 3. Send Notification
      try {
        await fetch('/api/notifications', {
          method: 'POST',
          body: JSON.stringify({
            type: 'order',
            email: formData.email,
            name: formData.name,
            orderId: orderId,
            total: getTotalPrice(),
          }),
        });
      } catch (err) {
        console.error('Failed to send email notification:', err);
      }

      // 4. Success
      setStep("success");
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && step !== "success") {
    return (
      <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
        <Header />
        <div className="pt-28 pb-24 container mx-auto px-6 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">
              Your Cart is Empty
            </h1>
            <p className="text-text-muted text-sm mb-6">
              Add some neon magic before checking out.
            </p>
            <Link
              href="/collections"
              className="inline-block bg-primary text-black px-8 py-3 rounded-full font-black text-xs tracking-[0.2em] uppercase hover:scale-105 transition-transform"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (step === "success") {
    return (
      <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
        <Header />
        <div className="pt-28 pb-24 container mx-auto px-6 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 bg-accent-mint rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">
              Order Confirmed
            </h1>
            <p className="text-text-muted text-sm mb-8">
              Thank you for your order, {formData.name.split(' ')[0]}! We have received your order and will start handcrafted your neon magic soon.
            </p>
            <Link
              href="/collections"
              className="inline-block bg-primary text-black px-8 py-3 rounded-full font-black text-xs tracking-[0.2em] uppercase hover:scale-105 transition-transform"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
      <Header />
      <div className="pt-28 pb-24 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Checkout
            </h1>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-5">
                  <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">
                    Shipping Details
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-2">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-text-muted" />
                      <textarea
                        name="address"
                        required
                        rows={3}
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                        placeholder="Full shipping address..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-5">
                  <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">
                    Payment Method
                  </h2>
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-bold">Cash On Delivery / UPI</p>
                      <p className="text-[10px] font-mono text-text-muted">
                        Pay securely at your doorstep
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile sticky bottom bar */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-white/10 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] z-40">
                  <div className="container mx-auto max-w-4xl flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Total</p>
                      <p className="text-xl font-mono font-black text-primary">{formatPrice(getTotalPrice())}</p>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary text-black px-8 py-3 rounded-full font-black text-xs tracking-[0.2em] uppercase hover:scale-[1.02] transition-transform active:scale-95 neon-bloom-lime disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="hidden lg:flex w-full bg-primary text-black py-5 rounded-full font-black text-sm tracking-[0.2em] uppercase hover:scale-[1.02] transition-transform active:scale-95 neon-bloom-lime disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-3"
                >
                  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isSubmitting ? "Processing Order..." : `Place Order — ${formatPrice(getTotalPrice())}`}
                </button>
              </form>
            </div>

            {/* Summary */}
            <div className="lg:col-span-2 order-first lg:order-last">
              <div className="bg-surface border border-white/5 rounded-2xl p-6 lg:sticky lg:top-24">
                <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  {items.map(({ product, quantity, selectedSize, selectedPrice }) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-lg border border-white/5 flex items-center justify-center text-[10px] font-mono text-text-muted/40">
                          NEON
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-tight">
                            {product.title}
                          </p>
                          <p className="text-[10px] font-mono text-text-muted">
                            Qty: {quantity} • {selectedSize}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-mono">
                        {formatPrice(selectedPrice * quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-mono">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Shipping</span>
                    <span className="font-mono text-accent-mint">FREE</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-black pt-2 border-t border-white/5">
                    <span>Total</span>
                    <span className="font-mono text-primary">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
