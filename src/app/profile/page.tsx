"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Zap,
  Package,
  Settings,
  LogOut,
  ArrowLeft,
  ShoppingBag,
  Loader2,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  User,
  MapPin,
  Lock,
} from "lucide-react";
import Image from "next/image";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "details">("orders");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  // Form States
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser(user);
      
      // Pre-fill form from metadata
      setProfileForm({
        fullName: user.user_metadata?.full_name || "",
        phone: user.user_metadata?.phone || "",
        address: user.user_metadata?.address || "",
        city: user.user_metadata?.city || "",
        state: user.user_metadata?.state || "",
        pincode: user.user_metadata?.pincode || "",
      });

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: profileForm.fullName,
        phone: profileForm.phone,
        address: profileForm.address,
        city: profileForm.city,
        state: profileForm.state,
        pincode: profileForm.pincode,
      }
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    }
    setUpdateLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    setUpdateLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      password: passwordForm.newPassword
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordForm({ newPassword: "", confirmPassword: "" });
    }
    setUpdateLoading(false);
  };

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
      <div className="pt-24 pb-24 container mx-auto px-6">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sidebar Controls */}
            <div className="space-y-4">
              <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden p-3 space-y-1">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                    activeTab === "orders" 
                      ? "bg-primary text-black font-black" 
                      : "text-text-muted hover:bg-white/5"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest">My Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                    activeTab === "details" 
                      ? "bg-primary text-black font-black" 
                      : "text-text-muted hover:bg-white/5"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest">Account Details</span>
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {message && (
                <div className={`mb-6 p-4 rounded-xl text-xs font-bold uppercase tracking-wider ${
                  message.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}>
                  {message.text}
                </div>
              )}

              {activeTab === "orders" ? (
                <div className="space-y-6">
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

                            <div className="space-y-3">
                              {order.order_items.map((item: any, i: number) => (
                                <div key={i} className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-black rounded-lg border border-white/5 overflow-hidden flex-shrink-0 relative">
                                    {item.products?.image_url ? (
                                      <Image src={item.products.image_url} alt="" fill className="object-cover" sizes="48px" />
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
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Profile & Address Form */}
                  <form onSubmit={handleUpdateProfile} className="bg-surface border border-white/5 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest">Profile & Address</h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Full Name</label>
                        <input
                          type="text"
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Phone Number</label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Street Address</label>
                        <input
                          type="text"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">City</label>
                        <input
                          type="text"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">State</label>
                        <input
                          type="text"
                          value={profileForm.state}
                          onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Pincode</label>
                        <input
                          type="text"
                          value={profileForm.pincode}
                          onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="bg-primary text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50"
                    >
                      {updateLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </form>

                  {/* Password Change Form */}
                  <form onSubmit={handleUpdatePassword} className="bg-surface border border-white/5 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                        <Lock className="w-4 h-4 text-red-500" />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest">Change Password</h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">New Password</label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Confirm Password</label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50"
                    >
                      {updateLoading ? "Updating..." : "Update Password"}
                    </button>
                  </form>
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
