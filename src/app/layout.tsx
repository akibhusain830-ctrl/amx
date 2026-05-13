import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Footer from "@/components/Footer";
import {
  Inter,
  Outfit,
  JetBrains_Mono,
  Pacifico,
  Great_Vibes,
  Dancing_Script,
  Yellowtail,
  Bebas_Neue,
  Righteous,
  Oswald,
  Teko,
  Caveat,
  Permanent_Marker,
  Satisfy,
  Cookie,
  Courgette,
  Lobster,
  Anton,
  Monoton,
  Indie_Flower,
  Shadows_Into_Light,
  Knewave,
  Amatic_SC,
} from "next/font/google";
import "./globals.css";

const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false, loading: () => null });
const WhatsAppWidget = dynamic(() => import("@/components/WhatsAppWidget"), { ssr: false, loading: () => null });

// Core UI fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["100","200","300","400","500","600","700","800","900"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Neon customizer fonts (20 total)
const pacifico         = Pacifico({ weight: "400", subsets: ["latin"], variable: "--nf-passionate" });
const greatVibes       = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--nf-dreamy" });
const dancingScript    = Dancing_Script({ subsets: ["latin"], variable: "--nf-flowy" });
const yellowtail       = Yellowtail({ weight: "400", subsets: ["latin"], variable: "--nf-classic" });
const bebasNeue        = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--nf-dope" });
const righteous        = Righteous({ weight: "400", subsets: ["latin"], variable: "--nf-iconic" });
const oswald           = Oswald({ subsets: ["latin"], variable: "--nf-bossy" });
const teko             = Teko({ subsets: ["latin"], variable: "--nf-chemistry" });
const caveat           = Caveat({ subsets: ["latin"], variable: "--nf-funky" });
const permanentMarker  = Permanent_Marker({ weight: "400", subsets: ["latin"], variable: "--nf-quirky" });
const satisfy          = Satisfy({ weight: "400", subsets: ["latin"], variable: "--nf-vibey" });
const cookie           = Cookie({ weight: "400", subsets: ["latin"], variable: "--nf-chic" });
const courgette        = Courgette({ weight: "400", subsets: ["latin"], variable: "--nf-jolly" });
const lobster          = Lobster({ weight: "400", subsets: ["latin"], variable: "--nf-glam" });
const anton            = Anton({ weight: "400", subsets: ["latin"], variable: "--nf-heavy" });
const monoton          = Monoton({ weight: "400", subsets: ["latin"], variable: "--nf-retro" });
const indieFlower      = Indie_Flower({ weight: "400", subsets: ["latin"], variable: "--nf-indie" });
const shadowsIntoLight = Shadows_Into_Light({ weight: "400", subsets: ["latin"], variable: "--nf-shadow" });
const knewave          = Knewave({ weight: "400", subsets: ["latin"], variable: "--nf-wave" });
const amaticSc         = Amatic_SC({ weight: "700", subsets: ["latin"], variable: "--nf-skinny" });

export const metadata: Metadata = {
  title: "AMX Signs | Premium High-Energy Neon Art",
  description:
    "Experience the digital theatre of neon. Handcrafted, high-fidelity neon signs delivered with speed and surgical precision.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const fontVars = [
    inter.variable, outfit.variable, jetbrains.variable,
    pacifico.variable, greatVibes.variable, dancingScript.variable, yellowtail.variable,
    bebasNeue.variable, righteous.variable, oswald.variable, teko.variable,
    caveat.variable, permanentMarker.variable, satisfy.variable, cookie.variable,
    courgette.variable, lobster.variable, anton.variable, monoton.variable,
    indieFlower.variable, shadowsIntoLight.variable, knewave.variable, amaticSc.variable,
  ].join(" ");

  return (
    <html lang="en" className="dark">
      <body className={`${fontVars} bg-black text-white antialiased flex flex-col min-h-screen`}>
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        <CartDrawer />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
