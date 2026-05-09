import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isRateLimited } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    if (isRateLimited(`restock:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body: unknown = await req.json();
    const emailRaw = typeof body === "object" && body !== null ? (body as { email?: unknown }).email : undefined;
    const productIdRaw =
      typeof body === "object" && body !== null ? (body as { productId?: unknown }).productId : undefined;

    const email = typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";
    const productId = typeof productIdRaw === "string" ? productIdRaw.trim() : "";

    if (!EMAIL_RE.test(email) || !productId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    const { error } = await supabase
      .from("restock_notifications")
      .insert({ email, product_id: productId });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Restock notification error:", error);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}

