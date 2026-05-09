"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, ChevronDown, Check, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUSES = ["Order Placed", "Handcrafting", "Quality Check", "Shipped", "Delivered", "Cancelled"];

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus || "Order Placed");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectStatus = (newStatus: string) => {
    if (newStatus === status) {
      setIsOpen(false);
      return;
    }
    setPendingStatus(newStatus);
    setIsOpen(false);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus) return;
    
    setIsUpdating(true);
    const originalStatus = status;
    setStatus(pendingStatus); // Optimistic UI update

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: pendingStatus })
        .eq("id", orderId);

      if (error) throw error;
      setPendingStatus(null);
    } catch (err) {
      console.error("Failed to update status", err);
      // Revert on failure
      setStatus(originalStatus);
    } finally {
      setIsUpdating(false);
      setPendingStatus(null);
    }
  };

  const cancelStatusChange = () => {
    setPendingStatus(null);
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case "Order Placed": return "text-white bg-white/10 border-white/20";
      case "Handcrafting": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "Quality Check": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "Shipped": return "text-primary bg-primary/20 border-primary/30";
      case "Delivered": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "Cancelled": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-text-muted bg-white/5 border-white/10";
    }
  };

  return (
    <>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !isUpdating && setIsOpen(!isOpen)}
          disabled={isUpdating}
          className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded border transition-colors ${getStatusColor(status)} ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:brightness-125"}`}
        >
          {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : status}
          {!isUpdating && <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl bg-surface border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="py-1">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSelectStatus(s)}
                    className={`block w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                      status === s 
                        ? "bg-primary/10 text-primary" 
                        : "text-text-muted hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {pendingStatus && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-surface border border-white/10 rounded-2xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tighter">Update Order Status?</h3>
              </div>
              
              <p className="text-sm text-text-muted mb-6">
                Are you sure you want to change the status of order <span className="font-mono text-white">#{orderId.slice(0, 8)}</span> from <span className="text-white font-bold">{status}</span> to <span className="text-primary font-bold">{pendingStatus}</span>?
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelStatusChange}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-text-muted hover:bg-white/5 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusChange}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-primary text-black hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
