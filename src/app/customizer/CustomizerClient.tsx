"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Info } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import {
  NEON_FONTS,
  NEON_COLORS,
  SIZE_OPTIONS,
  BACKING_OPTIONS,
  BackingId,
  calcPrice,
  calcDimensions,
  NeonFont,
  NeonColor,
} from "@/lib/customizerConfig";

const CUSTOM_PRODUCT = {
  id: "custom-neon-sign",
  slug: "custom-neon-sign",
  title: "Custom Neon Sign",
  category: "Custom",
  price: 0,
  rating: 5,
  review_count: 0,
  description: "Handcrafted custom neon sign",
  features: [],
  in_stock: true,
  variants: {
    regular: { dimensions: "", price: 0 },
    medium:  { dimensions: "", price: 0 },
    large:   { dimensions: "", price: 0 },
  },
};

const BG_OPTIONS = [
  { id: "black",   label: "Black",   bg: "#000000" },
  { id: "charcoal",label: "Charcoal",bg: "#111111" },
  { id: "navy",    label: "Navy",    bg: "#050A18" },
];

export default function CustomizerClient() {
  const [text, setText] = useState("YOUR TEXT");
  const [selectedFont, setSelectedFont] = useState<NeonFont>(NEON_FONTS[0]);
  const [selectedColor, setSelectedColor] = useState<NeonColor>(NEON_COLORS[4]); // green default
  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[0]);
  const [selectedBacking, setSelectedBacking] = useState<BackingId>("cut-to-shape");
  const [previewBg, setPreviewBg] = useState(BG_OPTIONS[0]);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const addedTimer = useRef<NodeJS.Timeout | null>(null);

  const price = calcPrice(text, selectedSize.id, selectedBacking);
  const dimensions = calcDimensions(text, selectedSize.id);
  const charCount = text.replace(/\s/g, "").length;
  const MAX_CHARS = 30;

  const handleAddToCart = useCallback(() => {
    if (!text.trim() || charCount === 0) return;
    addItem(
      CUSTOM_PRODUCT as any,
      selectedSize.label,
      price,
      {
        text: text.trim(),
        fontName: selectedFont.name,
        fontFamily: selectedFont.fontFamily,
        color: selectedColor.name,
        colorHex: selectedColor.hex,
        backing: selectedBacking === "cut-to-shape" ? "Cut to Shape" : "Rectangle Board",
        dimensions,
      }
    );
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => {
      setAdded(false);
      openCart();
    }, 800);
  }, [text, selectedSize, price, selectedFont, selectedColor, selectedBacking, dimensions, addItem, openCart, charCount]);

  const neonTextStyle: React.CSSProperties = {
    fontFamily: selectedFont.fontFamily,
    color: "#fff",
    textShadow: [
      `0 0 1px #fff`,
      `0 0 3px #fff`,
      `0 0 6px #fff`,
      `0 0 12px ${selectedColor.hex}`,
      `0 0 22px ${selectedColor.hex}`,
      `0 0 38px ${selectedColor.glow}`,
    ].join(", "),
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-mono uppercase tracking-[0.4em] text-primary mb-3">Design Studio</p>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Customise Your <span className="text-primary">Neon Sign</span>
          </h1>
          <p className="mt-3 text-text-muted text-sm max-w-lg mx-auto">
            Type your text, pick a font and colour, and watch your sign come to life in real-time.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* ─── LEFT: Live Preview ─── */}
          <div className="xl:w-[55%] sticky top-20 xl:top-28 z-30 bg-black xl:bg-transparent pb-4 xl:pb-0 xl:self-start space-y-4">
            {/* Preview canvas */}
            <div
              className="relative rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center"
              style={{ background: previewBg.bg, minHeight: 320 }}
            >
              {/* Scanline overlay for atmosphere */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)",
                }}
              />
              <div className="relative z-10 flex items-center justify-center py-8 md:py-14 px-6 md:px-8">
                {text.trim() ? (
                  <p
                    className="text-center break-words leading-none select-none transition-all duration-300"
                    style={{ ...neonTextStyle, fontSize: "clamp(1.8rem, 8vw, 5.5rem)", maxWidth: "100%" }}
                  >
                    {text}
                  </p>
                ) : (
                  <p className="text-white/20 text-xl md:text-2xl font-mono text-center px-4">Your text will glow here…</p>
                )}
              </div>
            </div>

            {/* Dimension pill (Desktop only, mobile has it in sticky) */}
            <div className="hidden md:flex items-center justify-between px-4 py-3 bg-white/[0.04] rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Dimensions</span>
              </div>
              <span className="text-sm font-mono font-bold text-white">{dimensions}</span>
            </div>

            {/* Background toggle (Desktop only) */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs font-mono text-text-muted uppercase tracking-widest shrink-0">Background:</span>
              <div className="flex gap-2">
                {BG_OPTIONS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setPreviewBg(bg)}
                    className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-all ${
                      previewBg.id === bg.id
                        ? "border-primary text-primary bg-primary/10"
                        : "border-white/15 text-text-muted hover:border-white/30"
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Controls ─── */}
          <div className="xl:w-[45%] space-y-6">

            {/* 1. Text input */}
            <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-primary">Your Text</h2>
              <textarea
                value={text}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.replace(/\s/g, "").length <= MAX_CHARS) setText(val);
                }}
                onFocus={() => { if (text === "YOUR TEXT") setText(""); }}
                onBlur={() => { if (!text.trim()) setText("YOUR TEXT"); }}
                rows={2}
                placeholder="Type your text..."
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-white text-lg font-bold tracking-wide resize-none outline-none focus:border-primary transition-colors placeholder:text-white/20"
              />
              <div className="flex justify-between">
                <span className="text-[11px] text-text-muted font-mono">Excluding spaces</span>
                <span className={`text-[11px] font-mono ${charCount >= MAX_CHARS ? "text-red-400" : "text-text-muted"}`}>
                  {charCount} / {MAX_CHARS} chars
                </span>
              </div>
            </section>

            {/* 2. Font picker */}
            <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-primary">Choose Font</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-2">
                {NEON_FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setSelectedFont(font)}
                    className={`relative px-3 py-3 rounded-xl border text-left transition-all duration-200 overflow-hidden ${
                      selectedFont.id === font.id
                        ? "border-primary bg-primary/10"
                        : "border-white/10 hover:border-white/30 bg-black/30"
                    }`}
                  >
                    <span
                      className="block text-base leading-none mb-1 truncate"
                      style={{ fontFamily: font.fontFamily, color: selectedFont.id === font.id ? selectedColor.hex : "white" }}
                    >
                      {font.name}
                    </span>
                    <span className="text-[9px] font-mono text-text-muted/60 uppercase tracking-wider">{font.category}</span>
                    {selectedFont.id === font.id && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* 3. Colour picker */}
            <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-primary">Choose Colour</h2>
              <div className="flex flex-wrap gap-4">
                {NEON_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                    className={`flex flex-col items-center gap-1.5 group`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        selectedColor.id === color.id ? "scale-110" : "border-white/20 hover:scale-105"
                      }`}
                      style={{
                        background: color.hex,
                        borderColor: selectedColor.id === color.id ? color.hex : undefined,
                        boxShadow: selectedColor.id === color.id ? `0 0 18px ${color.glow}, 0 0 32px ${color.glow}` : undefined,
                      }}
                    />
                    <span className={`text-[10px] font-mono ${selectedColor.id === color.id ? "text-white" : "text-text-muted"}`}>
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* 4. Size selector */}
            <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-primary">Choose Size</h2>
              <div className="grid grid-cols-3 gap-3">
                {SIZE_OPTIONS.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-2 rounded-xl border text-center transition-all ${
                      selectedSize.id === size.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/10 text-white/70 hover:border-white/30 bg-black/30"
                    }`}
                  >
                    <span className="block text-sm font-black uppercase tracking-tight">{size.label}</span>
                    <span className="block text-[10px] font-mono text-text-muted mt-0.5">{size.heightInch}" height</span>
                  </button>
                ))}
              </div>
            </section>

            {/* 5. Backing style */}
            <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-primary">Backing Style</h2>
              <div className="space-y-3">
                {BACKING_OPTIONS.map((backing) => {
                  const isRectangle = backing.id === "rectangle-board";
                  const discount = isRectangle ? selectedSize.backingDiscount : 0;
                  return (
                    <button
                      key={backing.id}
                      onClick={() => setSelectedBacking(backing.id)}
                      className={`w-full flex items-start gap-4 px-4 py-3 rounded-xl border text-left transition-all ${
                        selectedBacking === backing.id
                          ? "border-primary bg-primary/10"
                          : "border-white/10 hover:border-white/20 bg-black/30"
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                        selectedBacking === backing.id ? "border-primary" : "border-white/30"
                      }`}>
                        {selectedBacking === backing.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold">{backing.label}</span>
                          {isRectangle && (
                            <span className="text-[10px] font-mono text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                              Save ₹{discount}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-text-muted mt-0.5">{backing.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 6. Price + CTA (Desktop) */}
            <div className="hidden xl:block bg-[#0d0d0d] border border-white/15 rounded-2xl p-6 space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-mono text-text-muted uppercase tracking-widest">Total Price</p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={price}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="text-3xl font-black font-mono"
                      style={{ color: selectedColor.hex, textShadow: `0 0 20px ${selectedColor.glow}` }}
                    >
                      {formatPrice(price)}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-mono text-text-muted">{selectedSize.label} · {selectedBacking === "cut-to-shape" ? "Cut to Shape" : "Rectangle"}</p>
                  <p className="text-[11px] font-mono text-text-muted">{dimensions}</p>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!text.trim() || charCount === 0}
                className={`w-full py-4 rounded-full font-black text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all duration-300 ${
                  added
                    ? "bg-green-400 text-black scale-[0.98]"
                    : charCount === 0
                    ? "bg-white/10 text-text-muted cursor-not-allowed"
                    : "bg-primary text-black hover:scale-[1.02] active:scale-95 neon-bloom-lime"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {added ? "Added to Cart ✓" : "Add to Cart"}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ─── MOBILE STICKY BAR ─── */}
      <div className="xl:hidden fixed bottom-0 left-0 w-full z-40 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 pb-safe-bottom animate-slide-up">
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">{dimensions}</span>
            <span className="text-xl font-black font-mono" style={{ color: selectedColor.hex }}>
              {formatPrice(price)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!text.trim() || charCount === 0}
            className={`flex-1 py-3.5 rounded-full font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
              added
                ? "bg-green-400 text-black"
                : charCount === 0
                ? "bg-white/10 text-text-muted cursor-not-allowed"
                : "bg-primary text-black neon-bloom-lime"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
