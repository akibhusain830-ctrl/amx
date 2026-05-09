import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = "INR" } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Mock response since we don't have Razorpay keys yet
    return NextResponse.json({
      orderId: `order_mock_${Date.now()}`,
      amount: Math.round(amount * 100),
      currency: currency,
      keyId: "rzp_test_mock",
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
