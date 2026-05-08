"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
      <span className="text-[100px] md:text-[140px] font-black leading-none text-accent-pink/10 select-none">
        ERR
      </span>
      <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
        Something Went Wrong
      </h1>
      <p className="text-text-muted text-sm max-w-md mb-8">
        An unexpected error occurred. Try refreshing the page or go back home.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-primary text-black px-8 py-3 rounded-full font-black text-xs tracking-[0.2em] uppercase hover:scale-105 transition-transform"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-white/10 text-white px-8 py-3 rounded-full font-black text-xs tracking-[0.2em] uppercase hover:border-white/20 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
      </div>
    </main>
  );
}
