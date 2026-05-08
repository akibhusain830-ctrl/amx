"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const STATUSES = ["Pending", "Contacted", "Converted", "Rejected"];

export default function QuoteStatusSelect({ quoteId, currentStatus }: { quoteId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus || "Pending");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from("custom_designs")
        .update({ status: newStatus })
        .eq("id", quoteId);

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
      case "Pending": return "text-primary bg-primary/10";
      case "Contacted": return "text-blue-500 bg-blue-500/10";
      case "Converted": return "text-green-500 bg-green-500/10";
      case "Rejected": return "text-red-500 bg-red-500/10";
      default: return "text-text-muted bg-white/5";
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className={`appearance-none text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full cursor-pointer outline-none focus:ring-1 focus:ring-primary transition-colors ${getStatusColor(status)}`}
      >
        {STATUSES.map(s => (
          <option key={s} value={s} className="bg-black text-white">{s}</option>
        ))}
      </select>
      {isUpdating && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
    </div>
  );
}
