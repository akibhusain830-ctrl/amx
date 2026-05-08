# DESIGN.md: AMX Signs - The Neon Attack Evolution

## 1. Vision & Strategy
AMX Signs is pivoting to a **High-Energy, Premium Neon Gallery**. This design takes the high-conversion energy and vibrant "glow-first" philosophy of **Neon Attack** and elevates it with professional, structured layouts. We are moving away from "Quiet Minimalism" toward **"Vibrant Immersion."**

### Strategic Pillars
- **Neon Attack Core:** Absolute Black backgrounds (#000000), Electric Lime CTAs (#C6FF00), and aggressive trust signaling.
- **AMX Refinement:** We solve the "Mobile Clutter" found on competitor sites by using a cleaner "Digital Theatre" UI with more whitespace and optimized font legibility.
- **Conversion UX:** Every page is designed with a single, high-intent action in mind (the "Lime Path").

---

## 2. Visual Foundation

### Color Palette: "Electric Noir"
- **Background (Base):** `#000000` (Absolute Void) - The ultimate canvas for light.
- **Surface (Cards/Modals):** `#0B0B0B` (Stealth Gray) - Subtly lighter to create hierarchy.
- **Primary CTA:** `#C6FF00` (Electric Lime) - High-visibility, high-energy green.
- **Sale/Highlight:** `#36F4A4` (Mint Glow) - For prices and technical status.
- **Error/Hot:** `#FF007A` (Hot Pink) - For urgent alerts or emotional products.

### Typography: "Impact & Clarity"
- **Headlines:** `Outfit` (Weight: 700-900). Geometric and modern. 
- **Body:** `Inter` (Weight: 400-500). High legibility in both light and dark.
- **Utility:** `JetBrains Mono`. For pricing, dimensions, and warranty details.

---

## 3. Page Architectures & UX Hooks

### A. Homepage: The "Authority" Reveal
- **Hero:** Full-bleed cinematic product video. "START CUSTOMISING" in Electric Lime.
- **Trust Ticker:** Sticky horizontal bar at the top or bottom of the hero showing:
  - `[Shark Tank Logo] Approved` | `2 Year Warranty` | `Free Shipping Pan-India` | `Installation in 2 Mins`
- **Category Bubbles:** Circular navigation icons for "Bedroom," "Office," "Cafe," etc., for frictionless browsing.

### B. Product Detail Page (PDP): The "Conversion Engine"
- **Visuals:** Gallery with 5+ images + 1 Product Demo Video.
- **The "Lime Path" CTA:** Massive, sticky "ADD TO CART" button (100% width on mobile).
- **Price Display:** Large font, Electric Lime for the sale price, white for regular (strikethrough).
- **Trust Badges:** 4 clean, line-art icons directly below the "Add to Cart" button.

### C. The "Theatre" Customizer (Core Tool)
- **Stage (Top/Left):** 3D-like preview in a dark architectural room. Toggle for "Lights Off/On."
- **Controls (Bottom/Right):** 5-Step Logic:
  1. **TEXT:** Large input field with auto-scaling preview.
  2. **FONT:** Grid of previews. Fonts sorted by style (Script, Sans, Funky).
  3. **COLOR:** Circular color swatches that "glow" when selected.
  4. **SIZE:** Interactive slider showing real-world dimensions.
  5. **BACKING:** Visual options for "Cut to Shape" vs "Full Board."
- **Mobile Fix:** Hide the preview behind a "View Preview" button on mobile to give more room to the controls, or use a 50/50 vertical split with a sticky price bar.

---

## 4. Design Guardrails (Anti-Vibecoding)
1. **NO Low-Contrast Text:** Primary text is always #FFFFFF. Secondary is #A0A0A0.
2. **Surgical Bloom:** Shadows are replaced by `drop-shadow` glows. Only one element (the active neon) should have an intense bloom at any time.
3. **Pill Buttons:** All primary buttons are `rounded-full`. All secondary buttons are `outline`.
4. **No Clutter:** Remove all "sales-y" popups. Use subtle slide-ins or persistent bars instead.

---

## 5. Technical Requirements
- **Next.js 14** with App Router.
- **Tailwind CSS** for rapid, consistent styling.
- **Framer Motion** for "Electric" entrance animations (flicker-on, fade-in).
- **Lucide-react** for thin, professional iconography.
