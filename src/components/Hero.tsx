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
    <section className="relative pt-24 pb-8 md:pb-8 overflow-hidden bg-black flex flex-col items-center">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Text Content */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl leading-none md:text-5xl lg:text-7xl font-black text-white tracking-tight mb-1">
            India&apos;s #1
          </h1>
          <div
            className={`text-4xl md:text-5xl lg:text-7xl -rotate-2 transform -translate-y-1 mb-8 md:mb-6 neon-sign-text ${
              runFirstFlicker ? "neon-first-ignite" : "neon-steady-glow"
            }`}
            style={{ fontFamily: 'var(--nf-vibey), cursive', textTransform: 'none' }}
          >
            neon lights brand
          </div>
          
          <p className="text-xs sm:text-sm md:text-lg text-white/80 max-w-xs sm:max-w-sm md:max-w-2xl mx-auto leading-relaxed mb-8 px-2">
            Premium handcrafted LED neon signs designed to elevate your space. High-impact lighting for your home, office, or cafe.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-4 sm:px-0 max-w-sm sm:max-w-none mx-auto mt-2">
            <Link 
              href="/customizer"
              className="w-full sm:w-auto text-center bg-primary text-black px-6 py-3.5 sm:px-8 md:px-10 md:py-4 rounded-full font-black text-xs md:text-sm uppercase tracking-widest sm:tracking-[0.2em] hover:scale-105 transition-transform shadow-[0_0_20px_rgba(198,255,0,0.4)] whitespace-nowrap neon-bloom-lime"
            >
              Customise
            </Link>
            <Link 
              href="/collections"
              className="w-full sm:w-auto text-center bg-transparent border-2 border-primary/40 text-primary px-6 py-3 sm:px-8 md:px-10 md:py-3.5 rounded-full font-black text-xs md:text-sm uppercase tracking-widest sm:tracking-[0.2em] hover:bg-primary/10 transition-colors shadow-[0_0_15px_rgba(198,255,0,0.15)] whitespace-nowrap"
            >
              Shop All
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
