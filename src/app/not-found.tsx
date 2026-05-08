import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
      <span className="text-[120px] md:text-[180px] font-black leading-none text-primary/10 select-none">
        404
      </span>
      <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
        Lost in the Dark
      </h1>
      <p className="text-text-muted text-sm max-w-md mb-8">
        The page you are looking for does not exist. It might have been moved
        or deleted.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-primary text-black px-8 py-3 rounded-full font-black text-xs tracking-[0.2em] uppercase hover:scale-105 transition-transform"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </main>
  );
}
