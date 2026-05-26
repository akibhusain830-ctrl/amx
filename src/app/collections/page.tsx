import { Metadata } from "next";
import CollectionsClient from "./CollectionsClient";

export const metadata: Metadata = {
  title: "All Collections | Custom Neon Signs India",
  description: "Browse our complete catalog of handcrafted LED neon signs. Filter by category, price, and search for your perfect neon design.",
  openGraph: {
    title: "All Collections | AMX Signs India",
    description: "Browse our complete catalog of handcrafted LED neon signs. Filter by category, price, and search for your perfect neon design.",
    url: "https://amxsigns.com/collections",
  }
};

export default function CollectionsPage() {
  return <CollectionsClient />;
}
