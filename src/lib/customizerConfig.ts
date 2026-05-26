// Centralised font config for the neon customizer
// Each entry maps a friendly name to the CSS variable set in layout.tsx

export interface NeonFont {
  id: string;
  name: string;
  category: string;
  cssVar: string;        // CSS custom property, e.g. var(--nf-passionate)
  fontFamily: string;    // raw family name passed to style={{ fontFamily }}
}

export const NEON_FONTS: NeonFont[] = [
  // Single-stroke scripts — consistent stroke width, replicates neon tube bends
  { id: "passionate", name: "Passionate", category: "Script",      cssVar: "var(--nf-passionate)", fontFamily: "var(--nf-passionate)" },
  { id: "flowy",      name: "Flowy",      category: "Script",      cssVar: "var(--nf-flowy)",      fontFamily: "var(--nf-flowy)" },
  { id: "vibey",      name: "Vibey",      category: "Script",      cssVar: "var(--nf-vibey)",      fontFamily: "var(--nf-vibey)" },
  // Handwritten — even stroke weight, single-path letterforms
  { id: "funky",      name: "Funky",      category: "Handwritten", cssVar: "var(--nf-funky)",      fontFamily: "var(--nf-funky)" },
  // Neon-specific — designed to simulate a continuous neon tube
  { id: "retro",      name: "Retro",      category: "Neon",        cssVar: "var(--nf-retro)",      fontFamily: "var(--nf-retro)" },
  // Thin display — tall, even single stroke, physically accurate for strip lights
  { id: "skinny",     name: "Skinny",     category: "Thin",        cssVar: "var(--nf-skinny)",     fontFamily: "var(--nf-skinny)" },
];


export interface NeonColor {
  id: string;
  name: string;
  hex: string;
  glow: string; // rgba for box-shadow/text-shadow
}

export const NEON_COLORS: NeonColor[] = [
  { id: "red",   name: "Red",   hex: "#FF1744", glow: "rgba(255, 23, 68, 0.7)" },
  { id: "warm",  name: "Warm",  hex: "#FF8C00", glow: "rgba(255, 140, 0, 0.75)" },
  { id: "blue",  name: "Blue",  hex: "#2979FF", glow: "rgba(41, 121, 255, 0.7)" },
  { id: "pink",  name: "Pink",  hex: "#FF4081", glow: "rgba(255, 64, 129, 0.7)" },
  { id: "green", name: "Green", hex: "#00E676", glow: "rgba(0, 230, 118, 0.7)" },
  { id: "white", name: "White", hex: "#FFFFFF", glow: "rgba(255, 255, 255, 0.85)" },
];

export interface SizeOption {
  id: string;
  label: string;
  heightInch: number;
  widthPerChar: number; // inches per character
  basePrice: number;
  pricePerChar: number;
  backingDiscount: number; // discount for rectangle board
}

export const SIZE_OPTIONS: SizeOption[] = [
  { id: "regular", label: "Regular", heightInch: 10, widthPerChar: 3, basePrice: 950,  pricePerChar: 200, backingDiscount: 200 },
  { id: "medium",  label: "Medium",  heightInch: 13, widthPerChar: 4, basePrice: 1550, pricePerChar: 250, backingDiscount: 300 },
  { id: "large",   label: "Large",   heightInch: 15, widthPerChar: 5, basePrice: 2100, pricePerChar: 300, backingDiscount: 500 },
];

export const BACKING_OPTIONS = [
  { id: "cut-to-shape",      label: "Cut to Shape",      description: "Acrylic shaped to follow the sign's outline" },
  { id: "rectangle-board",   label: "Rectangle Board",   description: "Standard rectangular acrylic — lower cost" },
] as const;

export type BackingId = typeof BACKING_OPTIONS[number]["id"];

export function calcPrice(
  text: string,
  sizeId: string,
  backingId: BackingId
): number {
  const charCount = Math.max(text.replace(/\s/g, "").length, 1);
  const size = SIZE_OPTIONS.find((s) => s.id === sizeId) ?? SIZE_OPTIONS[0];
  const price = size.basePrice + size.pricePerChar * charCount;
  const discount = backingId === "rectangle-board" ? size.backingDiscount : 0;
  return Math.max(price - discount, 0);
}

export function calcDimensions(text: string, sizeId: string): string {
  const charCount = Math.max(text.replace(/\s/g, "").length, 1);
  const size = SIZE_OPTIONS.find((s) => s.id === sizeId) ?? SIZE_OPTIONS[0];
  const width = size.widthPerChar * charCount;
  return `${width}" W × ${size.heightInch}" H`;
}
