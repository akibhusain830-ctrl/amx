"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Ticket, Check, X, Loader2, ChevronRight,
  Truck, ShieldCheck, Zap, ArrowLeft, Tag, Lock, UserPlus
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

type CouponResult = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  discount: number;
  finalTotal: number;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const emptyForm: FormData = {
  name: "", email: "", phone: "",
  address: "", city: "", state: "", pincode: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const subtotal = getTotalPrice();

  const [form, setForm] = useState<FormData>(emptyForm);
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Sign up state for success page
  const [successPassword, setSuccessPassword] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const discount = appliedCoupon?.discount ?? 0;
  const finalTotal = subtotal - discount;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // Pre-fill user data
  useEffect(() => {
    const prefillUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
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
    prefillUser();
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) router.replace("/collections");
  }, [items.length, orderSuccess, router]);

  const handleField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const applyCoupon = useCallback(async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError(null);
    setAppliedCoupon(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal, email: form.email }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCouponError(data.error ?? "Invalid coupon");
      } else {
        setAppliedCoupon(data.coupon as CouponResult);
      }
    } catch {
      setCouponError("Could not validate coupon. Try again.");
    } finally {
      setCouponLoading(false);
    }
  }, [couponInput, subtotal, form.email]);

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  };

  const isFormValid = () => {
    return (
      form.name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
      /^\d{10}$/.test(form.phone) &&
      form.address.trim().length >= 5 &&
      form.city.trim().length >= 2 &&
      form.state.trim().length >= 2 &&
      /^\d{6}$/.test(form.pincode)
    );
  };

  const handlePayment = async () => {
    if (!isFormValid()) return;
    setPaymentLoading(true);

    try {
      const orderRes = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      const shippingAddress = `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;

      setTimeout(async () => {
        try {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: orderData.orderId,
              razorpayPaymentId: `pay_mock_${Date.now()}`,
              razorpaySignature: "mock_signature",
              customerName: form.name,
              customerEmail: form.email,
              customerPhone: form.phone,
              shippingAddress,
              totalAmount: finalTotal,
              discountAmount: discount,
              couponCode: appliedCoupon?.code ?? null,
              items: items.map((i) => ({
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
            setOrderSuccess(verifyData.orderId);
          }
        } catch (e) {
          console.error("Mock checkout error", e);
        } finally {
          setPaymentLoading(false);
        }
      }, 1500);
      
    } catch (err) {
      console.error("Payment failed:", err);
      setPaymentLoading(false);
    }
  };

  const handleSuccessSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!successPassword || successPassword.length < 6) return;
    setSignUpLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: successPassword,
      options: {
        data: {
          full_name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        }
      }
    });

    if (!error) {
      setSignUpSuccess(true);
    }
    setSignUpLoading(false);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 neon-bloom-lime">
            <Check className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-3">Order Confirmed!</h1>
          <p className="text-text-muted text-sm mb-2">
            Thank you, <span className="text-white font-bold">{form.name}</span>. Your neon sign is being crafted.
          </p>
          <p className="text-xs font-mono text-text-muted mb-10">
            Confirmation sent to <span className="text-primary">{form.email}</span>
          </p>

          <div className="space-y-4">
            {/* Post-purchase Sign Up */}
            {!currentUser && !signUpSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-surface border border-white/10 rounded-3xl p-6 text-left mb-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <UserPlus className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Track your order</h3>
                </div>
                <p className="text-xs text-text-muted mb-5 leading-relaxed">
                  Set a password to create an account and track your neon journey in real-time. We've already saved your details!
                </p>
                <form onSubmit={handleSuccessSignUp} className="space-y-3">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="password"
                      placeholder="Enter a password"
                      value={successPassword}
                      onChange={(e) => setSuccessPassword(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                      required
                    />
                  </div>
                  <button 
                    disabled={signUpLoading}
                    className="w-full bg-white text-black py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  >
                    {signUpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                  </button>
                </form>
              </motion.div>
            )}

            {signUpSuccess && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary/10 border border-primary/20 rounded-3xl p-6 mb-8"
              >
                <div className="flex items-center gap-3 text-primary mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Account Created!</h3>
                </div>
                <p className="text-xs text-text-muted">You can now track your order in your new dashboard.</p>
              </motion.div>
            )}

            <div className="flex flex-col gap-3">
              <Link
                href="/collections"
                className="inline-flex items-center justify-center gap-2 bg-primary text-black px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
              >
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
              </Link>
              <Link
                href="/profile"
                className="text-xs font-black uppercase tracking-widest text-text-muted hover:text-white py-2"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
      <Header />
      <div className="pt-28 pb-24 container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex items-center gap-2 text-xs font-mono text-text-muted uppercase tracking-widest mb-10">
          <Link href="/collections" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Shop
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">Checkout</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">Checkout</h1>
              <p className="text-text-muted text-sm">Complete your order. Free shipping PAN-India.</p>
            </div>

            <Section title="Contact Information">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full Name" name="name" value={form.name} onChange={handleField} placeholder="Akib Husain" />
                <Input label="Email" name="email" type="email" value={form.email} onChange={handleField} placeholder="you@email.com" />
                <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={handleField} placeholder="10-digit mobile" className="sm:col-span-2" />
              </div>
            </Section>

            <Section title="Shipping Address">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Street Address" name="address" value={form.address} onChange={handleField} placeholder="House no, Street, Area" className="sm:col-span-2" />
                <Input label="City" name="city" value={form.city} onChange={handleField} placeholder="Mumbai" />
                <Input label="State" name="state" value={form.state} onChange={handleField} placeholder="Maharashtra" />
                <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleField} placeholder="400001" />
              </div>
            </Section>

            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-white/5">
              {[
                { icon: Truck, label: "Free Shipping", sub: "All orders, PAN-India" },
                { icon: ShieldCheck, label: "1Y Warranty", sub: "Hassle-free replacements" },
                { icon: Zap, label: "Handcrafted", sub: "Premium LED neon" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1">
                  <Icon className="w-5 h-5 text-primary mb-1" />
                  <p className="text-xs font-black uppercase tracking-wider">{label}</p>
                  <p className="text-[10px] text-text-muted">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-widest">Order Summary</h2>
                <span className="text-xs font-mono text-text-muted">{items.length} item{items.length !== 1 ? "s" : ""}</span>
              </div>

              <div className="divide-y divide-white/5">
                {items.map(({ product, quantity, selectedSize, selectedPrice }) => (
                  <div key={`${product.id}-${selectedSize}`} className="flex gap-3 p-4">
                    <div className="w-14 h-14 rounded-xl bg-black border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                      {product.image_url ? (
                        <Image src={product.image_url} alt={product.title} width={56} height={56} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-[8px] font-mono text-primary text-center uppercase leading-tight px-1">{product.title}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black uppercase tracking-tight truncate">{product.title}</p>
                      <p className="text-[10px] font-mono text-text-muted mt-0.5">Size: {selectedSize} · Qty: {quantity}</p>
                    </div>
                    <p className="text-xs font-mono font-bold shrink-0">{formatPrice(selectedPrice * quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-white/5 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest">Promo Code</span>
                </div>
                {!appliedCoupon && (
                  <span className="text-[10px] font-mono text-primary animate-pulse uppercase tracking-wider">
                    Use FIRSTSIGN for 20% off
                  </span>
                )}
              </div>

              <AnimatePresence mode="wait">
                {appliedCoupon ? (
                  <motion.div
                    key="applied"
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-primary">{appliedCoupon.code}</p>
                        <p className="text-[10px] font-mono text-text-muted">
                          {appliedCoupon.type === "percentage"
                            ? `${appliedCoupon.value}% off`
                            : `${formatPrice(appliedCoupon.value)} off`}
                          {" — "}
                          <span className="text-accent-mint">saving {formatPrice(appliedCoupon.discount)}</span>
                        </p>
                      </div>
                    </div>
                    <button onClick={removeCoupon} className="p-1 hover:text-red-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(null); }}
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                      placeholder="ENTER CODE"
                      className="flex-1 bg-black border border-white/10 focus:border-primary rounded-xl px-4 py-2.5 text-xs font-mono uppercase tracking-widest outline-none transition-colors placeholder:text-white/20"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="bg-primary text-black px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50 hover:scale-105 transition-transform flex items-center gap-1.5"
                    >
                      {couponLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {couponError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 font-mono flex items-center gap-1.5">
                  <X className="w-3 h-3" /> {couponError}
                </motion.p>
              )}
            </div>

            <div className="bg-surface border border-white/5 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between text-sm text-text-muted">
                <span>Subtotal</span>
                <span className="font-mono">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-text-muted">
                <span>Shipping</span>
                <span className="font-mono text-accent-mint font-bold">FREE</span>
              </div>
              {discount > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  className="flex justify-between text-sm text-accent-mint"
                >
                  <span className="flex items-center gap-1.5"><Ticket className="w-3.5 h-3.5" /> Coupon ({appliedCoupon?.code})</span>
                  <span className="font-mono font-bold">-{formatPrice(discount)}</span>
                </motion.div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-white/10">
                <span className="text-sm font-black uppercase tracking-widest">Total</span>
                <span className="text-xl font-mono font-black text-primary">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={paymentLoading || !isFormValid()}
              className="w-full bg-primary text-black py-4 rounded-full font-black text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3 neon-bloom-lime hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {paymentLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                <><ShieldCheck className="w-5 h-5" /> Pay {formatPrice(finalTotal)} Securely</>
              )}
            </motion.button>

            <p className="text-[10px] font-mono text-text-muted text-center">
              Secured by Razorpay · UPI, Cards & NetBanking
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-5 sm:p-6 space-y-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-primary">{title}</h2>
      {children}
    </div>
  );
}

function Input({
  label, name, value, onChange, placeholder, type = "text", className = "",
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={name} className="text-xs font-mono text-text-muted uppercase tracking-widest">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={name}
        className="bg-black border border-white/10 focus:border-primary rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/20"
      />
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
