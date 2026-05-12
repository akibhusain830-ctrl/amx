import type { Metadata } from "next";
import Header from "@/components/Header";
import CustomizerClient from "./CustomizerClient";

export const metadata: Metadata = {
  title: "Customise Your Neon Sign | AMX Signs",
  description:
    "Design your own handcrafted LED neon sign. Pick your text, font, colour, and size — see it glow in real-time before you order.",
};

export default function CustomizerPage() {
  return (
    <>
      <Header />
      <CustomizerClient />
    </>
  );
}
