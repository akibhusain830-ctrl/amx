import { Zap } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
      <div className="relative">
        <Zap className="w-12 h-12 text-primary animate-pulse" />
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
      </div>
      <p className="mt-6 text-xs font-mono uppercase tracking-[0.3em] text-text-muted animate-pulse">
        Loading...
      </p>
    </div>
  );
}
