"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Lock, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if we have a session (the recovery link should provide one)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If no session, they shouldn't be here unless they just clicked a link
        // Sometimes session takes a moment to hydrate from the URL hash
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      setSuccess(true);
      
      // Redirect after a delay
      setTimeout(() => {
        router.push("/auth");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
      <Header />
      <div className="pt-28 pb-24 container mx-auto px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 neon-bloom-lime">
              <Lock className="text-black w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
              New Password
            </h1>
            <p className="text-text-muted text-sm">
              Create a strong new password for your account.
            </p>
          </div>

          <div className="bg-surface border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            {success ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 bg-accent-mint/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-accent-mint w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Password Updated!</h2>
                <p className="text-text-muted text-xs">Your password has been changed successfully. Redirecting you to login...</p>
                <Link href="/auth" className="inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest mt-4">
                  Sign In Now <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-wider p-4 rounded-xl">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-black py-4 rounded-full font-black text-xs tracking-[0.2em] uppercase hover:scale-[1.02] transition-transform active:scale-95 neon-bloom-lime flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Password
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
