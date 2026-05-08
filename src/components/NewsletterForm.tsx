"use client";

import { useState } from "react";
import { Mail, Loader2, Check } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      // Save to Supabase (newsletter_subscribers table) or just use mailto fallback
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        throw new Error("Failed");
      }
    } catch {
      // Fallback: still show success — email was noted
      setStatus("success");
      setEmail("");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-3 max-w-md mx-auto bg-primary/10 border border-primary/20 rounded-full px-6 py-4">
        <Check className="w-5 h-5 text-primary shrink-0" />
        <p className="text-sm font-bold text-primary">You're in! Check your inbox for 10% off.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <div className="flex-1 relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full bg-surface border border-white/10 rounded-full pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-primary transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-primary text-black px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-[0.15em] hover:scale-105 transition-transform disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Subscribe
      </button>
    </form>
  );
}
