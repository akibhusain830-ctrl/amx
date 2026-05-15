import { useState, useCallback } from "react";

export interface AppliedCoupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  discount: number;
  finalTotal: number;
}

export function useCoupon(subtotal: number, email: string) {
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const applyCoupon = useCallback(async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError(null);
    setAppliedCoupon(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal, email }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCouponError(data.error ?? "Invalid coupon");
      } else {
        setAppliedCoupon(data.coupon as AppliedCoupon);
      }
    } catch {
      setCouponError("Could not validate coupon. Try again.");
    } finally {
      setCouponLoading(false);
    }
  }, [couponInput, subtotal, email]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  }, []);

  return {
    couponInput,
    setCouponInput,
    couponLoading,
    couponError,
    setCouponError,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  };
}
