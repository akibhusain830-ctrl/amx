import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = "INR" } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Placeholder: In production, create a Razorpay order here using:
    // const razorpay = new Razorpay({ key_id: ..., key_secret: ... });
    // const order = await razorpay.orders.create({ amount: amount * 100, currency, receipt: ... });

    const mockOrderId = `order_${Date.now()}`;

    return NextResponse.json({
      orderId: mockOrderId,
      amount: amount * 100, // paise
      currency,
      // In production also return key_id for frontend Razorpay checkout
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
