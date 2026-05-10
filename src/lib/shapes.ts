import { Zap, Heart, Flame, Diamond, Star, LucideIcon } from "lucide-react";

export interface NeonShape {
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  rgb: string;
}

export const NEON_SHAPES: NeonShape[] = [
  { icon: Zap, colorClass: "text-[#c6ff00]", bgClass: "bg-[#c6ff00]/25", rgb: "198, 255, 0" },
  { icon: Heart, colorClass: "text-[#ff3366]", bgClass: "bg-[#ff3366]/25", rgb: "255, 51, 102" },
  { icon: Flame, colorClass: "text-[#ff6600]", bgClass: "bg-[#ff6600]/25", rgb: "255, 102, 0" },
  { icon: Diamond, colorClass: "text-[#00e5ff]", bgClass: "bg-[#00e5ff]/25", rgb: "0, 229, 255" },
  { icon: Star, colorClass: "text-[#ffcc00]", bgClass: "bg-[#ffcc00]/25", rgb: "255, 204, 0" }
];

export function getRandomNeonShape(): NeonShape {
  return NEON_SHAPES[Math.floor(Math.random() * NEON_SHAPES.length)];
}
