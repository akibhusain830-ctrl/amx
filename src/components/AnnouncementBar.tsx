"use client";

import React from "react";
import { Truck, Clock, Zap } from "lucide-react";

const AnnouncementBar = () => {
  return (
    <div className="bg-primary text-black py-2 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3 h-3" />
            Free Shipping on All Orders
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Fast Dispatch Pan-India
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Zap className="w-3 h-3" />
            Handcrafted in India
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
