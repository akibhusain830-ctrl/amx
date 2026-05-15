"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CategoryCard from "./CategoryCard";

interface CategoryCarouselProps {
  categories: Array<{
    title: string;
    image: string | undefined;
    href: string;
  }>;
}

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll);
      // Initial check
      checkScroll();
      
      // Re-check on window resize
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/carousel">
      {/* Navigation Buttons - Only visible on desktop and when scrolling is possible */}
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className={`hidden md:flex absolute -left-6 lg:-left-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full bg-black/80 border border-white/10 text-white transition-all duration-300 hover:border-primary hover:text-primary disabled:opacity-0 disabled:pointer-events-none group-hover/carousel:translate-x-2 shadow-2xl backdrop-blur-md`}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className={`hidden md:flex absolute -right-6 lg:-right-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full bg-black/80 border border-white/10 text-white transition-all duration-300 hover:border-primary hover:text-primary disabled:opacity-0 disabled:pointer-events-none group-hover/carousel:-translate-x-2 shadow-2xl backdrop-blur-md`}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide"
      >
        {categories.map((cat, i) => (
          <CategoryCard key={i} cat={cat} useTransition={true} />
        ))}
      </div>
    </div>
  );
}
