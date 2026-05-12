"use client";

import React from "react";
import { Truck, Clock, Zap } from "lucide-react";

const AnnouncementBar = () => {
  return (
    <div className="bg-primary text-black py-2.5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3 h-3 shrink-0" />
            Free Shipping
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <Clock className="w-3 h-3 shrink-0" />
            Fast Dispatch Pan-India
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Zap className="w-3 h-3 shrink-0" />
            Handcrafted in India
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
