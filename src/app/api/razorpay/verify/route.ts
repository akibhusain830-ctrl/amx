import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentId, signature } = body;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: "Missing verification fields" },
        { status: 400 }
      );
    }

    // Placeholder: In production, verify signature using crypto:
    // const crypto = require('crypto');
    // const expected = crypto.createHmac('sha256', RAZORPAY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
    // if (expected !== signature) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });

    return NextResponse.json({
      verified: true,
      message: "Payment verified (demo mode)",
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
