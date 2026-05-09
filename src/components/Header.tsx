"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, Zap, User, LogOut, Package, ChevronDown, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import MobileMenu from "./MobileMenu";
import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    // Check if user has closed the banner
    const bannerHidden = localStorage.getItem("amx_banner_hidden");
    if (!bannerHidden) {
      setShowBanner(true);
      document.body.classList.add("has-banner");
    } else {
      document.body.classList.remove("has-banner");
    }

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUser();
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
    document.body.classList.remove("has-banner");
    localStorage.setItem("amx_banner_hidden", "true");
  };

  const displayName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Account";
  const navLinks = [
    { href: "/collections", label: "Shop All", match: "/collections" },
    { href: "/collections/cafe", label: "Cafe", match: "/collections/cafe" },
    { href: "/collections/gaming", label: "Gaming", match: "/collections/gaming" },
    { href: "/collections/wings", label: "Wings", match: "/collections/wings" },
    { href: "/collections/cars", label: "Cars", match: "/collections/cars" },
    { href: "/collections/aesthetic", label: "Aesthetic", match: "/collections/aesthetic" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      {showBanner && (
        <div className="fixed top-0 left-0 w-full z-[60] bg-primary py-2 px-4 shadow-lg flex items-center justify-between">
          <div className="flex-1 flex justify-center">
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-black text-center animate-pulse">
              ✨ EXTRA 20% OFF ON YOUR FIRST ORDER — USE CODE: <span className="underline decoration-2 underline-offset-4">FIRSTSIGN</span>
            </p>
          </div>
          <button 
            onClick={handleCloseBanner}
            className="text-black/50 hover:text-black transition-colors p-1"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <header 
        className={`fixed left-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl transition-all duration-300 ${
          showBanner ? "top-[36px]" : "top-0"
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent_0%,rgba(198,255,0,0.95)_18%,rgba(0,240,255,0.65)_50%,rgba(198,255,0,0.95)_82%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-[radial-gradient(ellipse_at_top,rgba(198,255,0,0.28),transparent_65%)]" />
        
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center neon-bloom-lime transition-transform group-hover:scale-110">
              <Zap className="text-black w-4 h-4 md:w-6 md:h-6 fill-current" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter font-outfit uppercase">
              AMX<span className="text-primary">Signs</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav
            className="hidden xl:flex items-center gap-1 text-sm font-medium tracking-widest uppercase rounded-full border border-white/10 bg-white/[0.03] px-2 py-1.5"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.match || (link.match === "/collections" && pathname === "/collections");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full transition-all ${
                    isActive
                      ? "text-primary bg-primary/10 shadow-[0_0_16px_rgba(198,255,0,0.25)]"
                      : "text-white hover:text-primary"
                  }`}
                >
                  {link.label}
                  {isActive && <span className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-primary shadow-[0_0_12px_rgba(198,255,0,0.9)]" />}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-4 shrink-0">
            {!user ? (
              <Link href="/auth" className="hover:text-primary transition-colors p-2">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm"
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-black text-[10px] font-black uppercase">
                      {displayName[0]}
                    </span>
                  </div>
                  <span className="hidden xl:block text-xs font-bold uppercase tracking-wider max-w-[80px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-text-muted transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-xs font-black uppercase tracking-widest truncate">{displayName}</p>
                      <p className="text-[10px] font-mono text-text-muted truncate mt-0.5">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Zap className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors border-t border-white/5"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              className="relative p-2 hover:text-primary transition-colors"
              onClick={openCart}
              aria-label={`Open cart, ${totalItems} items`}
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              className="xl:hidden p-2 hover:text-primary transition-colors"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link
              href="/collections"
              className="hidden xl:block bg-primary text-black px-6 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase hover:scale-105 transition-transform active:scale-95 neon-bloom-lime"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Header;
