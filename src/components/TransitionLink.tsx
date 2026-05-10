"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";

interface TransitionLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  useTransition?: boolean;
}

export function TransitionLink({ href, children, useTransition = false, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    
    if (useTransition && !e.defaultPrevented) {
      e.preventDefault();
      setIsNavigating(true);
      
      // Start prefetching
      router.prefetch(href);
      
      // Wait 1 second before actually navigating
      setTimeout(() => {
        router.push(href);
      }, 1000);
    }
  };

  return (
    <>
      <Link href={href} onClick={handleClick} {...props}>
        {children}
      </Link>
      
      {isNavigating && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center rounded-2xl">
          <div className="relative">
            <Zap className="w-12 h-12 text-primary neon-flicker" />
            <div className="absolute inset-0 bg-primary/25 blur-xl rounded-full neon-halo" />
          </div>
          <p className="mt-6 text-xs font-mono uppercase tracking-[0.3em] text-text-muted animate-pulse [animation-duration:1.8s]">
            Loading...
          </p>
        </div>
      )}
    </>
  );
}
