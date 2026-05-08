"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import { usePathname } from "next/navigation";

const WhatsAppWidget = () => {
  const pathname = usePathname();
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
  const message = encodeURIComponent("Hi AMX Signs! I'm interested in ordering a neon sign.");

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <motion.a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white" />
    </motion.a>
  );
};

export default WhatsAppWidget;
