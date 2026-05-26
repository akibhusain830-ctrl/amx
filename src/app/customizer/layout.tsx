// Segment layout for /customizer route only.
// Loads the 6 physically-achievable neon strip fonts — deferred from root layout
// to prevent render-blocking LCP on product and collection pages.
//
// Eliminated fonts and why:
//   Bebas Neue, Righteous, Oswald, Teko, Anton → too bold/condensed, strip overlaps itself
//   Great Vibes, Cookie, Shadows Into Light     → stroke weight too variable / too thin
//   Yellowtail, Courgette, Lobster, Glam        → decorative serifs/terminals hard to bend
//   Permanent Marker, Knewave                   → thick brush strokes not replicable
//   Indie Flower                                → irregular stroke weight

import {
  Pacifico,
  Dancing_Script,
  Satisfy,
  Caveat,
  Monoton,
  Amatic_SC,
} from "next/font/google";

const pacifico     = Pacifico({ weight: "400", subsets: ["latin"], variable: "--nf-passionate", display: "swap" });
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--nf-flowy", display: "swap" });
const satisfy      = Satisfy({ weight: "400", subsets: ["latin"], variable: "--nf-vibey", display: "swap" });
const caveat       = Caveat({ subsets: ["latin"], variable: "--nf-funky", display: "swap" });
const monoton      = Monoton({ weight: "400", subsets: ["latin"], variable: "--nf-retro", display: "swap" });
const amaticSc     = Amatic_SC({ weight: "700", subsets: ["latin"], variable: "--nf-skinny", display: "swap" });

export default function CustomizerLayout({ children }: { children: React.ReactNode }) {
  const fontVars = [
    pacifico.variable,
    dancingScript.variable,
    satisfy.variable,
    caveat.variable,
    monoton.variable,
    amaticSc.variable,
  ].join(" ");

  return (
    <div className={fontVars}>
      {children}
    </div>
  );
}
