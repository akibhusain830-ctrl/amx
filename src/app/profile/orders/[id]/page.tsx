"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Zap,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag,
  Loader2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import Header from "@/components/Header";

type OrderItem = {
  id: string;
  quantity: number;
  price_at_purchase: number;
  selected_size: string;
  products: {
    title: string;
    image_url: string;
  };
};

type Order = {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  shipping_address: string;
  payment_status: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  order_items: OrderItem[];
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq("id", id)
        .eq("customer_email", user.email)
        .single();

      if (error || !data) {
        console.error("Error fetching order:", error);
      } else {
        setOrder(data);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [id, router]);

  const getStatusStep = (status: string) => {
    const steps = ["Pending", "Handcrafting", "Quality Check", "Shipped", "Delivered"];
    const currentIdx = steps.findIndex(s => s.toLowerCase() === status.toLowerCase());
    return currentIdx === -1 ? 0 : currentIdx;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "text-amber-500";
      case "handcrafting": return "text-primary";
      case "quality check": return "text-accent-mint";
      case "shipped": return "text-blue-500";
      case "delivered": return "text-green-500";
      default: return "text-text-muted";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-4">Order Not Found</h1>
        <p className="text-text-muted text-sm mb-8 text-center max-w-xs">
          We couldn't find the order you're looking for, or you don't have permission to view it.
        </p>
        <Link 
          href="/profile"
          className="bg-primary text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
        >
          Back to Profile
        </Link>
      </main>
    );
  }

  const currentStep = getStatusStep(order.status);

  return (
    <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
      <Header />
      <div className="pt-24 pb-24 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted uppercase tracking-widest mb-8">
            <Link href="/profile" className="hover:text-primary transition-colors">Profile</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Order Details</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-muted">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {order.order_items.length} Item{order.order_items.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full border border-white/10 bg-white/5 flex items-center gap-2 text-xs font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
              {order.status === "Delivered" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4 animate-pulse" />}
              {order.status}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Tracking Progress */}
              <div className="bg-surface border border-white/5 rounded-2xl p-6 sm:p-8">
                <h3 className="text-sm font-black uppercase tracking-widest mb-10 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" /> Delivery Progress
                </h3>
                
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-white/5 md:left-0 md:right-0 md:top-[15px] md:bottom-auto md:w-auto md:h-0.5" />
                  <div 
                    className="absolute left-[15px] top-0 w-0.5 bg-primary transition-all duration-1000 md:left-0 md:top-[15px] md:h-0.5" 
                    style={{ 
                      height: typeof window !== 'undefined' && window.innerWidth < 768 ? `${(currentStep / 4) * 100}%` : '0.5',
                      width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${(currentStep / 4) * 100}%` : '0.5'
                    }}
                  />

                  <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 relative">
                    {["Pending", "Handcrafting", "Quality Check", "Shipped", "Delivered"].map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;
                      
                      return (
                        <div key={step} className="flex md:flex-col items-center gap-4 md:gap-3 text-left md:text-center group">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                            isCompleted ? "bg-primary text-black neon-bloom-lime scale-110" : "bg-surface border-2 border-white/10 text-text-muted"
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />}
                          </div>
                          <div className="flex flex-col md:items-center">
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                              isCompleted ? "text-white" : "text-text-muted"
                            }`}>
                              {step}
                            </span>
                            {isCurrent && (
                              <span className="text-[8px] font-mono text-primary animate-pulse uppercase mt-0.5">In Progress</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                  <h3 className="text-xs font-black uppercase tracking-widest">Order Items</h3>
                </div>
                <div className="divide-y divide-white/5">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="p-6 flex gap-4 sm:gap-6">
                      <div className="w-20 h-20 bg-black rounded-xl border border-white/5 overflow-hidden flex-shrink-0 relative">
                        {item.products.image_url ? (
                          <Image src={item.products.image_url} alt={item.products.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-white/10 uppercase">Neon</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <h4 className="text-sm font-black uppercase tracking-tight truncate">{item.products.title}</h4>
                          <span className="text-sm font-mono font-bold text-white whitespace-nowrap">
                            {formatPrice(item.price_at_purchase * item.quantity)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                          <div className="text-[10px] font-mono text-text-muted uppercase">
                            Size: <span className="text-white">{item.selected_size}</span>
                          </div>
                          <div className="text-[10px] font-mono text-text-muted uppercase">
                            Qty: <span className="text-white">{item.quantity}</span>
                          </div>
                          <div className="text-[10px] font-mono text-text-muted uppercase">
                            Price: <span className="text-white">{formatPrice(item.price_at_purchase)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Order Summary */}
              <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/5 pb-3">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-text-muted font-mono uppercase">
                    <span>Subtotal</span>
                    <span className="text-white">{formatPrice(order.total_amount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-text-muted font-mono uppercase">
                    <span>Shipping</span>
                    <span className="text-accent-mint font-bold">FREE</span>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-primary">Total Paid</span>
                    <span className="text-xl font-mono font-black text-primary">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/5 pb-3">Shipping Details</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <MapPin className="w-4 h-4 text-text-muted shrink-0" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Delivery Address</p>
                      <p className="text-xs leading-relaxed text-white/80">{order.shipping_address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/5 pb-3">Payment Information</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <CreditCard className="w-4 h-4 text-text-muted shrink-0" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Payment Status</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-accent-mint">
                          {order.payment_status}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-mint neon-bloom-lime" />
                      </div>
                    </div>
                  </div>
                  {order.razorpay_payment_id && (
                    <div className="pt-2">
                      <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">Razorpay Payment ID</p>
                      <p className="text-[10px] font-mono text-white/40 break-all">{order.razorpay_payment_id}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Help Support */}
              <Link 
                href="https://wa.me/91XXXXXXXXXX" 
                target="_blank"
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest">Need help?</p>
                    <p className="text-[8px] font-mono text-text-muted">Chat with our support team</p>
                  </div>
                </div>
                <ExternalLink className="w-3 h-3 text-text-muted group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
