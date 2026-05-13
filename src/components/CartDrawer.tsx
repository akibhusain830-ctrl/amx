"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowLeft, Loader2, CheckCircle, ShieldCheck, MapPin } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", pincode: "", city: "", state: ""
  });
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: string; value: number; discount: number; finalTotal: number } | null>(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Reset to cart step when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep("cart"), 300);
    }
  }, [isOpen]);

  // Pre-fill user data
  useEffect(() => {
    const prefillUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setForm(f => ({
          ...f,
          name: user.user_metadata?.full_name || f.name,
          email: user.email || f.email,
          phone: user.user_metadata?.phone || f.phone,
          address: user.user_metadata?.address || f.address,
          city: user.user_metadata?.city || f.city,
          state: user.user_metadata?.state || f.state,
          pincode: user.user_metadata?.pincode || f.pincode,
        }));
      }
    };
    if (isOpen) prefillUser();
  }, [isOpen]);

  // PIN Code auto-fill
  useEffect(() => {
    if (form.pincode.length === 6) {
      setIsPinLoading(true);
      fetch(`https://api.postalpincode.in/pincode/${form.pincode}`)
        .then(res => res.json())
        .then(data => {
          if (data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            setForm(f => ({ ...f, city: postOffice.District, state: postOffice.State }));
          }
        })
        .finally(() => setIsPinLoading(false));
    }
  }, [form.pincode]);

  // Load Razorpay
  useEffect(() => {
    if (step === "checkout") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) document.body.removeChild(script);
      };
    }
  }, [step]);

  const handleField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const isFormValid = () => {
    return form.name.trim().length >= 2 &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
           /^\d{10}$/.test(form.phone) &&
           form.address.trim().length >= 5 &&
           form.city.trim().length >= 2 &&
           form.state.trim().length >= 2 &&
           /^\d{6}$/.test(form.pincode);
  };

  const isContactValid = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && /^\d{10}$/.test(form.phone);
  };

  const applyCoupon = async () => {
    if (!couponInput) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal: getTotalPrice(), email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to validate coupon");
      setAppliedCoupon(data.coupon);
      setCouponError("");
    } catch (err: any) {
      setCouponError(err.message);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const handlePayment = async () => {
    if (!isFormValid()) return;
    setPaymentLoading(true);

    try {
      const subtotal = getTotalPrice();
      const finalAmount = appliedCoupon ? appliedCoupon.finalTotal : subtotal;
      
      const orderRes = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AMX Signs",
        description: "Premium Neon Signs",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            setPaymentLoading(true);
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                customerName: form.name,
                customerEmail: form.email,
                customerPhone: form.phone,
                shippingAddress: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
                totalAmount: subtotal,
                discountAmount: appliedCoupon ? appliedCoupon.discount : 0,
                couponCode: appliedCoupon ? appliedCoupon.code : null,
                items: items.map(i => ({
                  productId: i.product.id,
                  quantity: i.quantity,
                  priceAtPurchase: i.selectedPrice,
                  selectedSize: i.selectedSize,
                })),
              }),
            });
            
            const verifyData = await verifyRes.json();
            if (verifyData.verified) {
              clearCart();
              setOrderId(verifyData.orderId);
              setStep("success");
            }
          } catch (e) {
            console.error("Payment verify error", e);
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#BAFF00",
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Payment failed", err);
      setPaymentLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-white/10 z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                {step === "checkout" ? (
                  <button onClick={() => setStep("cart")} className="p-1 hover:text-primary transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                ) : (
                  <ShoppingBag className="w-5 h-5 text-primary" />
                )}
                <h2 className="text-lg font-black uppercase tracking-tighter">
                  {step === "cart" ? "Your Cart" : step === "checkout" ? "Secure Checkout" : "Order Confirmed"}
                </h2>
                {step === "cart" && (
                  <span className="text-xs font-mono text-text-muted">
                    ({items.length} item{items.length !== 1 && "s"})
                  </span>
                )}
              </div>
              <button onClick={closeCart} className="p-3 hover:text-primary transition-colors -mr-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto thin-scrollbar relative">
              <AnimatePresence mode="wait">
                {step === "cart" && (
                  <motion.div key="cart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 space-y-6 h-full flex flex-col">
                    {items.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <ShoppingBag className="w-16 h-16 text-white/10 mb-4" />
                        <p className="text-text-muted text-sm mb-2">Your cart is empty</p>
                        <p className="text-xs text-text-muted/60 mb-6">Add some neon magic to get started.</p>
                        <button onClick={closeCart} className="bg-primary text-black px-6 py-3 rounded-full font-black text-xs tracking-widest uppercase hover:scale-105 transition-transform">
                          Continue Shopping
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 flex-1">
                        {items.map(({ product, quantity, selectedSize, selectedPrice, customDetails, cartItemId }) => (
                          <div key={cartItemId ?? `${product.id}-${selectedSize}`} className="flex gap-4 bg-black/40 border border-white/5 rounded-2xl p-4">
                            <div className="w-20 h-20 bg-surface rounded-xl border border-white/5 flex items-center justify-center shrink-0 overflow-hidden relative">
                              {customDetails ? (
                                <span className="text-2xl leading-none" style={{ fontFamily: customDetails.fontFamily, color: customDetails.colorHex, textShadow: `0 0 12px ${customDetails.colorHex}` }}>
                                  {customDetails.text.slice(0, 2) || "A"}
                                </span>
                              ) : product.image_url ? (
                                <Image src={product.image_url} alt={product.title} fill className="object-cover" sizes="80px" />
                              ) : (
                                <span className="text-xs font-mono text-text-muted/40 uppercase">IMG</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <h3 className="text-sm font-black uppercase tracking-tight truncate">
                                    {customDetails ? `"${customDetails.text}"` : product.title}
                                  </h3>
                                  <span className="text-[10px] font-mono text-text-muted/60 uppercase block mt-1">Size: {selectedSize}</span>
                                </div>
                                <button onClick={() => removeItem(product.id, selectedSize, cartItemId)} className="p-1 hover:text-accent-pink transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex items-center justify-between mt-3 gap-3">
                                {!customDetails && (
                                  <div className="flex items-center gap-1 bg-black/60 rounded-full border border-white/10">
                                    <button onClick={() => updateQuantity(product.id, selectedSize, quantity - 1)} className="p-1.5 hover:text-primary"><Minus className="w-3 h-3" /></button>
                                    <span className="text-xs font-mono w-4 text-center">{quantity}</span>
                                    <button onClick={() => updateQuantity(product.id, selectedSize, quantity + 1)} className="p-1.5 hover:text-primary"><Plus className="w-3 h-3" /></button>
                                  </div>
                                )}
                                <p className="text-sm font-mono font-bold whitespace-nowrap ml-auto">{formatPrice(selectedPrice * quantity)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {step === "checkout" && (
                  <motion.div key="checkout" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-5 space-y-6">
                    
                    {/* Contact Info Card */}
                    <div className="bg-surface border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black border border-primary/20">1</div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-white/90">Contact Details</h3>
                      </div>
                      <div className="space-y-4">
                        <Input label="Full Name" name="name" value={form.name} onChange={handleField} placeholder="Your Name" />
                        <Input label="Email" name="email" value={form.email} onChange={handleField} placeholder="you@example.com" type="email" />
                        <Input label="Phone Number" name="phone" value={form.phone} onChange={handleField} placeholder="10-digit mobile number" type="tel" maxLength={10} />
                      </div>
                    </div>

                    {/* Delivery Address Card */}
                    <div className="bg-surface border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black border border-primary/20">2</div>
                          <h3 className="text-xs font-black uppercase tracking-widest text-white/90">Delivery Address</h3>
                        </div>
                        {isPinLoading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="PIN Code" name="pincode" value={form.pincode} onChange={handleField} placeholder="6 digits" maxLength={6} className="col-span-2" icon={<MapPin className="w-4 h-4" />} />
                        <Input label="City" name="city" value={form.city} onChange={handleField} placeholder="City" />
                        <Input label="State" name="state" value={form.state} onChange={handleField} placeholder="State" />
                        <Input label="Address" name="address" value={form.address} onChange={handleField} placeholder="House No., Building, Street Area" className="col-span-2" />
                      </div>
                    </div>

                    {/* Order Summary & Coupon Card */}
                    <div className="bg-surface border border-white/10 rounded-2xl p-5 space-y-5 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black border border-primary/20">3</div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-white/90">Order Summary</h3>
                      </div>

                      {/* Coupon Section */}
                      <div className={`rounded-xl p-1.5 border transition-colors ${!isContactValid() ? 'bg-black/50 border-white/5 opacity-70' : 'bg-black border-white/10'}`}>
                        {appliedCoupon ? (
                          <div className="flex items-center justify-between bg-accent-mint/10 border border-accent-mint/20 rounded-lg p-3">
                            <div>
                              <p className="text-xs font-black text-accent-mint">{appliedCoupon.code}</p>
                              <p className="text-[10px] text-accent-mint/80 uppercase tracking-widest mt-0.5 font-mono">Promo Applied</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-mono font-black text-accent-mint">-{formatPrice(appliedCoupon.discount)}</span>
                              <button onClick={removeCoupon} className="p-1.5 text-accent-mint hover:bg-accent-mint/20 rounded-md transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex gap-2 relative">
                              <input 
                                value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                placeholder={isContactValid() ? "Have a promo code?" : "Enter email & phone to use promo"}
                                disabled={!isContactValid() || couponLoading}
                                className="flex-1 bg-transparent border-none px-3 py-2 text-sm outline-none transition-colors placeholder:text-white/30 disabled:opacity-50 font-mono uppercase"
                              />
                              <button 
                                onClick={applyCoupon} 
                                disabled={couponLoading || !couponInput || !isContactValid()}
                                className="px-5 py-2 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:bg-white/5 disabled:border-transparent text-primary disabled:text-white/50"
                              >
                                {couponLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : 'Apply'}
                              </button>
                            </div>
                            {couponError && <p className="text-[10px] text-red-400 px-3 pb-1 font-mono">{couponError}</p>}
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between text-sm text-text-muted">
                          <span className="font-mono text-xs uppercase tracking-widest">Subtotal</span>
                          <span className="font-mono text-white/80">{formatPrice(getTotalPrice())}</span>
                        </div>
                        {appliedCoupon && (
                          <div className="flex items-center justify-between text-sm text-accent-mint">
                            <span className="font-mono text-xs uppercase tracking-widest">Discount</span>
                            <span className="font-mono">-{formatPrice(appliedCoupon.discount)}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm text-text-muted">
                          <span className="font-mono text-xs uppercase tracking-widest">Shipping</span>
                          <span className="font-mono text-primary uppercase tracking-widest text-[10px] font-black bg-primary/10 px-2 py-0.5 rounded-full">Free</span>
                        </div>
                        <div className="border-t border-white/10 pt-4 mt-2 flex items-center justify-between">
                          <span className="text-sm font-black uppercase tracking-widest text-white">Total to Pay</span>
                          <span className="text-2xl font-mono font-black text-primary">{formatPrice(appliedCoupon ? appliedCoupon.finalTotal : getTotalPrice())}</span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 flex flex-col items-center justify-center h-full text-center space-y-4 mt-20">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center neon-bloom-lime mb-4 mx-auto">
                      <CheckCircle className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Order Confirmed</h2>
                    <p className="text-sm text-text-muted">Thanks {form.name.split(' ')[0]}! Your neon sign is being crafted.</p>
                    <p className="text-[10px] font-mono text-white/50 bg-white/5 px-4 py-2 rounded-lg mt-2 inline-block">Order #{orderId?.slice(0,8).toUpperCase()}</p>
                    <button onClick={closeCart} className="mt-8 bg-surface border border-white/10 text-white px-8 py-3 rounded-full font-black text-xs tracking-widest uppercase hover:bg-white/5 transition-colors block mx-auto">
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && step === "cart" && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Subtotal</span>
                  <span className="text-lg font-mono font-black">{formatPrice(getTotalPrice())}</span>
                </div>
                <button onClick={() => setStep("checkout")} className="block w-full bg-primary text-black py-4 rounded-full font-black text-xs tracking-[0.2em] uppercase text-center hover:scale-[1.02] transition-transform active:scale-95 neon-bloom-lime">
                  Checkout Now
                </button>
              </div>
            )}

            {step === "checkout" && (
              <div className="p-6 border-t border-white/10 bg-black">
                <button
                  disabled={paymentLoading || !isFormValid()}
                  onClick={handlePayment}
                  className="w-full bg-primary text-black py-4 rounded-full font-black text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-2 neon-bloom-lime hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {paymentLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-4 h-4" /> Pay {formatPrice(appliedCoupon ? appliedCoupon.finalTotal : getTotalPrice())}</>}
                </button>
                <p className="text-[9px] font-mono text-text-muted text-center mt-3 uppercase tracking-widest">
                  Secured by Razorpay
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
function Input({
  label, name, value, onChange, placeholder, type = "text", className = "", icon, maxLength
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; className?: string; icon?: React.ReactNode; maxLength?: number;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={name} className="text-[9px] font-mono text-white/50 uppercase tracking-[0.1em] px-1">{label}</label>
      <div className="relative group">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors">{icon}</div>}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full bg-black/50 border border-white/10 hover:border-white/20 focus:border-primary focus:bg-black rounded-xl ${icon ? 'pl-11' : 'px-4'} py-3 text-sm outline-none transition-all placeholder:text-white/20 text-white shadow-inner`}
        />
      </div>
    </div>
  );
}
