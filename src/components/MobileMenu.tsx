"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, User, LogOut } from "lucide-react";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  isAdmin: boolean;
  onSignOut: () => void;
}

const navLinks = [
  { href: "/customizer", label: "✦ Customise" },
  { href: "/collections", label: "Shop All" },
  { href: "/collections/cafe", label: "Cafe" },
  { href: "/collections/aesthetic", label: "Aesthetic" },
  { href: "/collections/love", label: "Love" },
  { href: "/collections/wings", label: "Wings" },
  { href: "/collections/gaming", label: "Gaming" },
  { href: "/collections/cars", label: "Cars" },
  { href: "/collections/under-4000", label: "Under 4000" },
];

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, user, isAdmin, onSignOut }) => {
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
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full max-w-sm bg-surface border-r border-white/10 z-[70] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Zap className="text-black w-5 h-5 fill-current" />
                </div>
                <span className="text-xl font-black tracking-tighter font-outfit uppercase">
                  AMX<span className="text-primary">Signs</span>
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:text-primary transition-colors -mr-1"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-5 sm:p-6 space-y-0.5 sm:space-y-1 overflow-y-auto scrollbar-hide" aria-label="Mobile navigation">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block py-2.5 sm:py-3 text-lg sm:text-xl font-black uppercase tracking-tight hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-4 mt-2 sm:pt-6 sm:mt-4 border-t border-white/10"
              >
                {!user ? (
                  <Link
                    href="/auth"
                    onClick={onClose}
                    className="flex items-center gap-3 py-2.5 sm:py-3 text-base sm:text-lg font-black uppercase tracking-tight text-white/80 hover:text-white transition-colors"
                  >
                    <User className="w-5 h-5" />
                    Sign In
                  </Link>
                ) : (
                  <div className="space-y-0.5">
                    <div className="pb-2 mb-1">
                      <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Account</p>
                      <p className="text-xs font-bold text-white/90 truncate">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={onClose}
                        className="flex items-center gap-3 py-2.5 sm:py-3 text-base sm:text-lg font-black uppercase tracking-tight text-primary transition-colors"
                      >
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      onClick={onClose}
                      className="flex items-center gap-3 py-2.5 sm:py-3 text-base sm:text-lg font-black uppercase tracking-tight text-white/80 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        onSignOut();
                        onClose();
                      }}
                      className="flex items-center gap-3 w-full py-2.5 sm:py-3 text-base sm:text-lg font-black uppercase tracking-tight text-red-500 hover:text-red-400 transition-colors"
                    >
                      <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </motion.div>
            </nav>

            <div className="p-6 border-t border-white/10 shrink-0">
              <Link
                href="/collections"
                onClick={onClose}
                className="block w-full bg-primary text-black py-4 rounded-full font-black text-xs tracking-[0.2em] uppercase text-center hover:scale-[1.02] transition-transform active:scale-95 neon-bloom-lime"
              >
                Shop Now
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
