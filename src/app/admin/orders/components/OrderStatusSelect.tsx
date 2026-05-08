"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const STATUSES = ["Order Placed", "Handcrafting", "Quality Check", "Shipped", "Delivered", "Cancelled"];

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus || "Order Placed");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      
    } catch (err) {
      console.error("Failed to update status", err);
      // Revert on failure
      setStatus(currentStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case "Order Placed": return "text-white bg-white/10";
      case "Handcrafting": return "text-yellow-500 bg-yellow-500/10";
      case "Quality Check": return "text-blue-500 bg-blue-500/10";
      case "Shipped": return "text-primary bg-primary/20";
      default: return "text-text-muted bg-white/5";
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className={`appearance-none text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded cursor-pointer outline-none focus:ring-1 focus:ring-primary transition-colors ${getStatusColor(status)}`}
      >
        {STATUSES.map(s => (
          <option key={s} value={s} className="bg-black text-white">{s}</option>
        ))}
      </select>
      {isUpdating && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
    </div>
  );
}
