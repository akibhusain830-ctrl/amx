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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

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
            className={`text-3xl md:text-5xl lg:text-7xl -rotate-2 transform -translate-y-1 mb-8 md:mb-6 neon-sign-text ${
              runFirstFlicker ? "neon-first-ignite" : "neon-steady-glow"
            }`}
          >
            neon lights brand
          </div>
          
          <p className="hidden md:block text-sm md:text-lg text-white/90 max-w-sm md:max-w-2xl mx-auto leading-relaxed mb-8">
            Premium handcrafted LED neon signs designed to elevate your space. High-impact lighting for your home, office, or cafe.
          </p>

          <div className="flex flex-row items-center justify-center gap-3 md:gap-4">
            <Link href="/collections">
              <button className="bg-primary text-black px-8 py-3.5 md:px-10 md:py-4 rounded-full font-black text-xs md:text-sm uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-[0_0_20px_rgba(198,255,0,0.3)]">
                Shop Now
              </button>
            </Link>
            <Link href="/collections/aesthetic">
              <button className="bg-transparent border border-white/20 text-white px-8 py-3.5 md:px-10 md:py-4 rounded-full font-black text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">
                Aesthetic
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
