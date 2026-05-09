import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isRateLimited } from "@/lib/rate-limit";

type CouponRow = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order_amount: number | null;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number | null;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    if (isRateLimited(`coupon-validate:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body: unknown = await req.json();
    const codeRaw = typeof body === "object" && body !== null ? (body as { code?: unknown }).code : undefined;
    const subtotalRaw =
      typeof body === "object" && body !== null ? (body as { subtotal?: unknown }).subtotal : undefined;

    const code = typeof codeRaw === "string" ? codeRaw.trim().toUpperCase() : "";
    const subtotal = typeof subtotalRaw === "number" ? subtotalRaw : NaN;
    if (!code || !Number.isFinite(subtotal) || subtotal <= 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { data, error } = await supabase.from("coupons").select("*").eq("code", code).single();
    if (error || !data) {
      return NextResponse.json({ valid: false, error: "Coupon not found" }, { status: 404 });
    }

    const coupon = data as CouponRow;
    if (!coupon.active) {
      return NextResponse.json({ valid: false, error: "Coupon is inactive" }, { status: 400 });
    }

    const now = new Date();
    if (coupon.starts_at && new Date(coupon.starts_at) > now) {
      return NextResponse.json({ valid: false, error: "Coupon is not active yet" }, { status: 400 });
    }
    if (coupon.ends_at && new Date(coupon.ends_at) < now) {
      return NextResponse.json({ valid: false, error: "Coupon has expired" }, { status: 400 });
    }
    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
      return NextResponse.json(
        { valid: false, error: `Minimum order amount is INR ${coupon.min_order_amount}` },
        { status: 400 }
      );
    }
    if (coupon.usage_limit && (coupon.used_count || 0) >= coupon.usage_limit) {
      return NextResponse.json({ valid: false, error: "Coupon usage limit reached" }, { status: 400 });
    }

    const rawDiscount = coupon.type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value;
    const capped = coupon.max_discount ? Math.min(rawDiscount, coupon.max_discount) : rawDiscount;
    const discount = Math.max(0, Math.min(capped, subtotal));
    const finalTotal = Math.max(0, subtotal - discount);

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount,
        finalTotal,
      },
    });
  } catch {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}

