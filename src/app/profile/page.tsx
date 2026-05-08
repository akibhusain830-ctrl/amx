"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  Package,
  Heart,
  Settings,
  LogOut,
  ArrowLeft,
  ShoppingBag,
  Loader2,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
} from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser(user);

      // Fetch user's orders
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq("customer_email", user.email)
        .order("created_at", { ascending: false });

      if (!error && ordersData) {
        setOrders(ordersData);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return <Clock className="w-4 h-4 text-amber-500" />;
      case "handcrafting": return <Zap className="w-4 h-4 text-primary" />;
      case "quality check": return <CheckCircle2 className="w-4 h-4 text-accent-mint" />;
      case "shipped": return <Truck className="w-4 h-4 text-blue-500" />;
      case "delivered": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return <Package className="w-4 h-4 text-text-muted" />;
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
      <Header />
      <div className="pt-28 pb-24 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">
                Account Dashboard
              </span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                Welcome, {user?.user_metadata?.full_name?.split(' ')[0] || "User"}
              </h1>
              <p className="text-text-muted text-sm mt-2">{user?.email}</p>
            </div>
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar Controls */}
            <div className="space-y-4">
              <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden p-3">
                {[
                  { icon: Package, label: "My Orders", active: true },
                  { icon: Heart, label: "Saved Designs", href: "/customizer" },
                  { icon: Settings, label: "Account Details" },
                ].map((item, i) => (
                  <Link
                    key={i}
                    href={item.href || "#"}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                      item.active 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-text-muted hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Main Content Area: Orders */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
                <ShoppingBag className="w-3 h-3" /> Recent Orders ({orders.length})
              </h2>

              {orders.length === 0 ? (
                <div className="bg-surface border border-white/5 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-white/10" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-2">No orders yet</h3>
                  <p className="text-text-muted text-xs mb-6">Your neon journey hasn't started yet.</p>
                  <Link 
                    href="/collections" 
                    className="inline-block bg-primary text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="bg-surface border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition-colors"
                    >
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                          <div>
                            <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">Order ID</p>
                            <p className="text-sm font-mono font-bold">#{order.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                            {getStatusIcon(order.status)}
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">
                              {order.status}
                            </span>
                          </div>
                          <div className="text-right sm:text-right">
                            <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">Amount Paid</p>
                            <p className="text-sm font-mono font-black text-primary">{formatPrice(order.total_amount)}</p>
                          </div>
                        </div>

                        {/* Order Items Snippet */}
                        <div className="space-y-3">
                          {order.order_items.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-black rounded-lg border border-white/5 overflow-hidden flex-shrink-0">
                                {item.products?.image_url ? (
                                  <img src={item.products.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[8px] font-mono text-white/20">NEON</div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold uppercase truncate">{item.products?.title || "Custom Sign"}</p>
                                <p className="text-[10px] text-text-muted font-mono">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white/[0.02] border-t border-white/5 px-6 py-3 flex items-center justify-between">
                        <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <Link 
                          href={`/profile/orders/${order.id}`}
                          className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-1 group-hover:gap-2 transition-all"
                        >
                          Details <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="mt-16 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
