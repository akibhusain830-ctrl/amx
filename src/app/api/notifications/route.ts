import { NextResponse } from 'next/server';
import { sendOrderConfirmation, sendQuoteConfirmation } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, email, name, ...details } = body;

    if (type === 'order') {
      await sendOrderConfirmation(email, name, details.orderId, details.total);
    } else if (type === 'quote') {
      await sendQuoteConfirmation(email, name, details.text);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
