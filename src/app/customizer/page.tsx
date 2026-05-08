"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Type, Palette, Ruler, Layers, User, Mail, Phone, Loader2, Check, X } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

const steps = [
  { id: "text", label: "Text", icon: Type },
  { id: "font", label: "Font", icon: Layers },
  { id: "color", label: "Colour", icon: Palette },
  { id: "size", label: "Size", icon: Ruler },
];

const neonColors = [
  { name: "Electric Lime", value: "#C6FF00" },
  { name: "Hot Pink", value: "#FF007A" },
  { name: "Cyan", value: "#00F0FF" },
  { name: "Mint", value: "#36F4A4" },
  { name: "White", value: "#FFFFFF" },
  { name: "Red", value: "#FF3333" },
];

const sizes = ["30cm", "45cm", "60cm", "90cm", "120cm"];

export default function CustomizerPage() {
  const [activeStep, setActiveStep] = useState("text");
  const [text, setText] = useState("YOUR TEXT");
  const [selectedColor, setSelectedColor] = useState(neonColors[0]);
  const [selectedSize, setSelectedSize] = useState("60cm");
  const [selectedFont, setSelectedFont] = useState("Bold Sans");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("custom_designs")
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          design_text: text,
          font_style: selectedFont,
          color_name: selectedColor.name,
          size_cm: selectedSize,
          estimated_price: getPrice(),
        });

      if (error) throw error;

      // Send Notification
      try {
        await fetch('/api/notifications', {
          method: 'POST',
          body: JSON.stringify({
            type: 'quote',
            email: formData.email,
            name: formData.name,
            text: text,
          }),
        });
      } catch (err) {
        console.error('Failed to send email notification:', err);
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSuccess(false);
        setFormData({ name: "", email: "", phone: "" });
      }, 3000);
    } catch (error) {
      console.error("Error submitting quote:", error);
      alert("Failed to submit quote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPrice = () => {
    switch (selectedSize) {
      case "30cm": return 2499;
      case "45cm": return 3999;
      case "60cm": return 5499;
      case "90cm": return 7999;
      case "120cm": return 10999;
      default: return 5499;
    }
  };

  return (
    <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
      <Header />
      <div className="pt-28 pb-24 container mx-auto px-6">
        <div className="mb-12">
          <span className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">
            Design Studio
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Neon Customiser
          </h1>
          <p className="text-text-muted text-sm mt-4 max-w-lg">
            Design your own neon sign in 4 simple steps. Preview in real time and
            order when you are ready.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Preview Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-[#050505] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
            <div className="relative z-10 text-center px-8">
              <div
                className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 break-words max-w-full"
                style={{
                  color: selectedColor.value,
                  textShadow: `0 0 20px ${selectedColor.value}80, 0 0 60px ${selectedColor.value}40`,
                  fontFamily: selectedFont === "Script" ? "cursive" : selectedFont === "Block" ? "Impact, sans-serif" : selectedFont === "Funky" ? "Comic Sans MS, cursive" : "var(--font-outfit)",
                }}
              >
                {text || "YOUR TEXT"}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-text-muted uppercase tracking-widest">
                <Ruler className="w-3 h-3" />
                {selectedSize}
              </div>
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-black tracking-widest uppercase">
                Live Preview
              </span>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="space-y-8">
            {/* Step Tabs */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeStep === step.id
                      ? "bg-primary text-black"
                      : "bg-surface border border-white/10 text-text-muted hover:text-white"
                  }`}
                >
                  <step.icon className="w-4 h-4" />
                  {step.label}
                </button>
              ))}
            </div>

            {/* Step Content */}
            <div className="bg-surface border border-white/5 rounded-2xl p-6">
              {activeStep === "text" && (
                <div className="space-y-4">
                  <label className="text-xs font-mono uppercase tracking-widest text-text-muted block">
                    Your Neon Text
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value.toUpperCase())}
                    maxLength={20}
                    className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-2xl font-black uppercase tracking-tighter focus:outline-none focus:border-primary transition-colors"
                    placeholder="TYPE HERE"
                  />
                  <p className="text-[10px] font-mono text-text-muted">
                    Max 20 characters for optimal glow density
                  </p>
                </div>
              )}

              {activeStep === "font" && (
                <div className="space-y-4">
                  <label className="text-xs font-mono uppercase tracking-widest text-text-muted block">
                    Select Style
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Bold Sans", "Script", "Block", "Funky"].map((font) => (
                      <button
                        key={font}
                        onClick={() => setSelectedFont(font)}
                        className={`py-4 rounded-xl border transition-all text-sm font-black uppercase tracking-tight ${
                          selectedFont === font
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeStep === "color" && (
                <div className="space-y-4">
                  <label className="text-xs font-mono uppercase tracking-widest text-text-muted block">
                    Neon Colour
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {neonColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color)}
                        className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition-all ${
                          selectedColor.value === color.value
                            ? "border-primary bg-primary/10"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white/10"
                          style={{
                            backgroundColor: color.value,
                            boxShadow: `0 0 12px ${color.value}60`,
                          }}
                        />
                        <span className="text-[10px] font-mono uppercase tracking-wider">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeStep === "size" && (
                <div className="space-y-4">
                  <label className="text-xs font-mono uppercase tracking-widest text-text-muted block">
                    Real-World Size
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-4 rounded-xl border text-sm font-mono font-bold transition-all ${
                          selectedSize === size
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price & CTA */}
            <div className="bg-surface border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">
                  Estimated Price
                </p>
                <p className="text-2xl font-mono font-black text-primary">
                  ₹{getPrice().toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-primary text-black px-8 py-4 rounded-full font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:scale-105 transition-transform active:scale-95 neon-bloom-lime"
              >
                Request Quote <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-md bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-accent-mint rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Quote Sent!</h3>
                  <p className="text-text-muted text-sm">We'll get back to you within 24 hours with a custom offer.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">Request Your Quote</h3>
                  <form onSubmit={handleSubmitQuote} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-2">Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="you@example.com"
                          className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 00000 00000"
                          className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <div className="bg-white/5 rounded-xl p-4 mb-6">
                        <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2">Design Summary</p>
                        <p className="text-xs font-bold uppercase tracking-tight text-primary">
                          {text} | {selectedFont} | {selectedColor.name} | {selectedSize}
                        </p>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-black py-4 rounded-full font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>Submit Quote Request <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
