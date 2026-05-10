"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

export default function CategoryFilterDropdown({
  categories,
  defaultValue = "",
}: {
  categories: string[];
  defaultValue?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);

  const displayValue = selected || "All Categories";

  return (
    <div className="relative">
      <input type="hidden" name="category" value={selected} />
      
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2.5 h-[42px] border transition-all duration-200 rounded-xl px-4 text-xs font-black uppercase tracking-widest ${
          open
            ? "bg-primary/10 border-primary/50 text-primary"
            : "bg-surface border-white/10 hover:border-white/20 text-white"
        }`}
      >
        <span>{displayValue}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180 text-primary" : "text-text-muted"}`} />
      </button>

      {open && (
        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
      )}

      {open && (
        <div
          className="absolute left-0 top-full mt-2 z-20 w-48 rounded-xl overflow-hidden
            border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]"
          style={{ background: "rgba(10,10,10,0.97)", backdropFilter: "blur(24px)" }}
        >
          <div className="max-h-60 overflow-y-auto thin-scrollbar p-2">
            {[ { label: "All Categories", value: "" }, ...categories.map(c => ({ label: c, value: c }))].map((opt) => {
              const isActive = selected === opt.value;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => { setSelected(opt.value); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left group ${
                    isActive ? "bg-primary/10 border border-primary/20" : "border border-transparent hover:bg-white/[0.04]"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center transition-all ${
                    isActive ? "bg-primary" : "border border-white/20 group-hover:border-white/40"
                  }`}>
                    {isActive && (
                      <svg width="6" height="4" viewBox="0 0 7 5" fill="none">
                        <path d="M1 2.5L2.8 4.2L6 1" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <span className={`text-[11px] font-bold tracking-wide ${isActive ? "text-primary" : "text-white/90 group-hover:text-white"}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>
      )}
    </div>
  );
}
