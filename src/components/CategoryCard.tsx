"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getRandomNeonShape, NeonShape } from "@/lib/shapes";

interface CategoryCardProps {
  cat: any;
  useTransition?: boolean;
}

export default function CategoryCard({ cat, useTransition = false }: CategoryCardProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [navShape, setNavShape] = useState<NeonShape | null>(null);

  const handleNavigate = (e: React.MouseEvent) => {
    if (useTransition) {
      e.preventDefault();
      setNavShape(getRandomNeonShape());
      setIsNavigating(true);
      router.prefetch(cat.href);
      setTimeout(() => {
        router.push(cat.href);
      }, 1000);
    }
  };

  return (
    <div className="group flex flex-col gap-3 w-full shrink-0 snap-start">
      <Link href={cat.href} onClick={handleNavigate} className="relative aspect-square rounded-2xl overflow-hidden bg-surface border border-white/5 transition-transform duration-500 group-hover:border-primary/30 flex items-center justify-center">
        {cat.image ? (
          <Image src={cat.image} alt={cat.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 20vw" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] flex items-center justify-center">
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(198,255,0,0.08) 0%, transparent 70%)'}} />
            <span className="text-xl font-black uppercase tracking-widest text-primary drop-shadow-[0_0_12px_rgba(198,255,0,0.8)] relative z-10">{cat.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
        
        {/* Loading Overlay */}
        {isNavigating && navShape && (
          <div className="absolute -inset-px bg-black z-[100] flex flex-col items-center justify-center rounded-2xl" style={{ "--neon-color-rgb": navShape.rgb } as React.CSSProperties}>
            <div className="relative">
              <navShape.icon className={`w-12 h-12 ${navShape.colorClass} neon-flicker`} />
              <div className={`absolute inset-0 ${navShape.bgClass} blur-xl rounded-full neon-halo`} />
            </div>
            <p className="mt-6 text-xs font-mono uppercase tracking-[0.3em] text-text-muted animate-pulse [animation-duration:1.8s]">
              Loading...
            </p>
          </div>
        )}
      </Link>
      
      <Link href={cat.href} onClick={handleNavigate} className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-tight">{cat.title}</h3>
        </div>
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(198,255,0,0.5)] transition-all">
          <ArrowRight className="w-3.5 h-3.5 text-black" />
        </div>
      </Link>
    </div>
  );
}
