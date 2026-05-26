import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Footer from "@/components/Footer";
import {
  Inter,
  Outfit,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false, loading: () => null });
const WhatsAppWidget = dynamic(() => import("@/components/WhatsAppWidget"), { ssr: false, loading: () => null });

// Core UI fonts only — 3 fonts vs previous 21
// Neon customizer fonts (18) are loaded lazily in src/app/customizer/layout.tsx
// to prevent render-blocking LCP degradation on product/collection pages
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["100","200","300","400","500","600","700","800","900"], display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL('https://amxsigns.com'),
  title: {
    default: "AMX Signs | Premium High-Energy Neon Art India",
    template: "%s | AMX Signs"
  },
  description: "Experience the digital theatre of neon. Handcrafted, high-fidelity LED neon signs for homes, cafes, and gaming setups. Fast PAN-India delivery.",
  keywords: ["custom neon signs India", "LED neon lights", "neon sign for room", "gaming neon signs", "personalized neon signs"],
  authors: [{ name: "AMX Signs" }],
  creator: "AMX Signs",
  publisher: "AMX Signs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://amxsigns.com",
    siteName: "AMX Signs",
    title: "AMX Signs | Premium High-Energy Neon Art",
    description: "Premium handcrafted LED neon signs delivered with speed and surgical precision. Order your custom neon today.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AMX Signs - Premium Neon Art",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AMX Signs | Premium High-Energy Neon Art",
    description: "Handcrafted, high-fidelity neon signs delivered with speed and surgical precision.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const fontVars = [
    inter.variable, outfit.variable, jetbrains.variable,
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

