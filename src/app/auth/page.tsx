"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowLeft, Mail, Lock, User, Loader2, X, Check } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.refresh();
        router.push("/");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setSuccess("Check your email for the confirmation link!");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset`,
        });
        if (error) throw error;
        setSuccess("Password reset link has been sent to your email!");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication");
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
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 neon-bloom-lime">
              <Zap className="text-black w-7 h-7 fill-current" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
              {mode === "signin" ? "Welcome Back" : mode === "signup" ? "Join AMX" : "Reset Password"}
            </h1>
            <p className="text-text-muted text-sm px-4">
              {mode === "signin"
                ? "Sign in to access your orders and saved designs."
                : mode === "signup"
                ? "Create an account to save designs and track orders."
                : "Enter your email and we'll send you a link to reset your password."}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-surface border border-white/5 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl"
          >
            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-wider p-4 rounded-xl flex items-center gap-3">
                <X className="w-4 h-4 shrink-0" /> {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-accent-mint/10 border border-accent-mint/20 text-accent-mint text-[10px] font-bold uppercase tracking-wider p-4 rounded-xl flex items-center gap-3">
                <Check className="w-4 h-4 shrink-0" /> {success}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              <div className="space-y-5">
                {mode === "signup" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {mode !== "forgot" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Password</label>
                      {mode === "signin" && (
                        <button type="button" onClick={() => setMode("forgot")} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                          Forgot?
                        </button>
                      )}
                    </div>
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
                  </motion.div>
                )}
              </div>
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black py-4 rounded-full font-black text-xs tracking-[0.2em] uppercase hover:scale-[1.02] transition-transform active:scale-95 neon-bloom-lime flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            {mode === "forgot" ? (
              <button onClick={() => setMode("signin")} className="text-primary font-bold hover:underline flex items-center gap-1 mx-auto">
                <ArrowLeft className="w-3 h-3" /> Back to Sign In
              </button>
            ) : mode === "signin" ? (
              <>
                New here?{" "}
                <button onClick={() => setMode("signup")} className="text-primary font-bold hover:underline">
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setMode("signin")} className="text-primary font-bold hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>

          <div className="mt-8 text-center border-t border-white/5 pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
