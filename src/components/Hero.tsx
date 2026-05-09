'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Hero = React.memo(() => {
  const [runFirstFlicker, setRunFirstFlicker] = useState(false);

  useEffect(() => {
    setRunFirstFlicker(true);
  }, []);

  return (
    <section className="relative pt-28 pb-12 overflow-hidden bg-black flex flex-col items-center">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Text Content */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-[2.5rem] leading-none md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-0">
            India&apos;s No. 1
          </h1>
          <div
            className={`text-[1.75rem] md:text-4xl lg:text-5xl font-bold italic text-primary -rotate-2 transform -translate-y-1 mb-4 neon-sign-text ${
              runFirstFlicker ? "neon-first-ignite" : "neon-steady-glow"
            }`}
          >
            neon lights brand
          </div>
          
          <p className="text-sm md:text-base text-white/90 max-w-sm md:max-w-lg mx-auto leading-relaxed">
            Experience world-class craftsmanship with LED Neon Signs that brighten up your space and match your aesthetic.
          </p>
        </motion.div>
      </div>

      {/* Promo Banner Placeholder */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full px-4 md:px-6 max-w-5xl mx-auto relative z-10"
      >
        <div className="relative aspect-[1/1.05] sm:aspect-square md:aspect-[16/9] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-surface border border-white/10 flex items-center justify-center shadow-2xl group">
          {/* Background image placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] via-[#001f3f] to-[#000000]" />
          <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          
          {/* Promo Content */}
          <div className="relative z-10 flex flex-col items-center text-center p-6 w-full max-w-lg">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6 md:mb-8 text-center max-w-[90%] mx-auto">
              <span className="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest text-white leading-tight">
                Add <span className="text-primary">1,000 Aura Points</span> To Your Space
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Flat</span>
              <span className="text-7xl md:text-9xl font-black text-primary leading-none tracking-tighter drop-shadow-[0_0_20px_rgba(198,255,0,0.4)]">20%</span>
              <span className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Off</span>
            </div>
            
            <p className="text-xs md:text-sm font-bold text-white/80 uppercase tracking-[0.2em] mb-8 md:mb-10">
              On India&apos;s #1 Neon Signs
            </p>

            <Link href="/collections" className="w-full sm:w-auto px-4 sm:px-0">
              <button className="w-full sm:w-auto bg-transparent border border-primary text-primary px-8 py-3.5 rounded-full font-black text-[11px] md:text-sm uppercase tracking-widest hover:bg-primary hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(198,255,0,0.3)]">
                + Get FREE Neon Sign
              </button>
            </Link>
          </div>
          
          {/* Decorative glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
