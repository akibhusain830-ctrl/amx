import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      totalAmount,
      discountAmount,
      couponCode,
      items,
    } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing verification fields" }, { status: 400 });
    }

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Save order to DB
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        shipping_address: shippingAddress,
        total_amount: totalAmount,
        discount_amount: discountAmount ?? 0,
        coupon_code: couponCode ?? null,
        status: "confirmed",
        payment_status: "paid",
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order save failed:", orderError);
      return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }

    // Save order items
    if (items && items.length > 0) {
      const orderItems = items.map((item: {
        productId: string;
        quantity: number;
        priceAtPurchase: number;
        selectedSize: string;
      }) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_purchase: item.priceAtPurchase,
        selected_size: item.selectedSize,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) {
        console.error("Order items save failed:", itemsError);
      }
    }

    // Increment coupon used_count
    if (couponCode) {
      await supabase.rpc("increment_coupon_used_count", { coupon_code: couponCode });
    }

    return NextResponse.json({ verified: true, orderId: order.id });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
