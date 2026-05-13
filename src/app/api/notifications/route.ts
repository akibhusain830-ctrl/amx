import { NextResponse } from "next/server";
import { sendOrderConfirmation, sendQuoteConfirmation } from "@/lib/resend";
import { isRateLimited } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NotificationPayload =
  | { type: "order"; email: string; name: string; orderId: string; total: number }
  | { type: "quote"; email: string; name: string; text: string };

function isValidPayload(body: unknown): body is NotificationPayload {
  if (!body || typeof body !== "object") return false;
  const payload = body as Record<string, unknown>;
  if (payload.type !== "order" && payload.type !== "quote") return false;
  if (typeof payload.email !== "string" || !EMAIL_RE.test(payload.email.trim().toLowerCase())) return false;
  if (typeof payload.name !== "string" || payload.name.trim().length < 2) return false;
  if (payload.type === "order") {
    return (
      typeof payload.orderId === "string" &&
      payload.orderId.length > 0 &&
      typeof payload.total === "number" &&
      Number.isFinite(payload.total)
    );
  }
  return typeof payload.text === "string" && payload.text.trim().length > 0;
}

export async function POST(req: Request) {
  try {
    const ipHeader = req.headers.get("x-forwarded-for");
    const ip = ipHeader?.split(",")[0]?.trim() ?? "local";
    if (await isRateLimited(`notifications:${ip}`, 15, 60_000)) {
      return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
    }

    const body: unknown = await req.json();
    if (!isValidPayload(body)) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const email = body.email.trim().toLowerCase();
    const name = body.name.trim();

    if (body.type === "order") {
      await sendOrderConfirmation(email, name, body.orderId, body.total);
    } else {
      await sendQuoteConfirmation(email, name, body.text.trim());
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

