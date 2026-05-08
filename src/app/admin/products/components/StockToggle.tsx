"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function StockToggle({ productId, inStock }: { productId: string; inStock: boolean }) {
  const [stock, setStock] = useState(inStock);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    const newStock = !stock;
    setStock(newStock);
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({ in_stock: newStock })
        .eq("id", productId);
      if (error) throw error;
      router.refresh();
    } catch (err: any) {
      setStock(!newStock); // revert on error
      alert("Failed to update stock: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`relative inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
        stock ? "bg-primary/20 text-primary hover:bg-primary/30" : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
      } disabled:opacity-50`}
      title="Click to toggle stock status"
    >
      {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
      {stock ? "In Stock" : "Out of Stock"}
    </button>
  );
}
