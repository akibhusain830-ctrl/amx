import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

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

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Save order to DB using Service Role to bypass RLS
    const { data: order, error: orderError } = await supabaseAdmin
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

      const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems);
      if (itemsError) {
        console.error("Order items save failed:", itemsError);
      }
    }

    // Increment coupon used_count securely
    if (couponCode) {
      await supabaseAdmin.rpc("increment_coupon_used_count", { coupon_code: couponCode });
    }

    // Send Order Confirmation Email
    try {
      await resend.emails.send({
        from: "AMX Signs <orders@amxsigns.com>",
        to: [customerEmail],
        subject: `Order Confirmed: #${order.id.slice(0, 8).toUpperCase()}`,
        html: `
          <div style="font-family: sans-serif; color: #111;">
            <h1 style="color: #BAFF00;">Thank you for your order, ${customerName}!</h1>
            <p>We have successfully received your payment of INR ${totalAmount}. Our team is now preparing your custom neon magic.</p>
            <p>Your Order ID is: <strong>${order.id}</strong></p>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <h3>Delivery Details</h3>
            <p>${shippingAddress}</p>
            <p>If you have any questions, simply reply to this email!</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError);
    }

    return NextResponse.json({ verified: true, orderId: order.id });
  } catch (error: any) {
    console.error("Payment verification failed:", error);
    return NextResponse.json({ error: error?.message || "Verification failed" }, { status: 500 });
  }
}
