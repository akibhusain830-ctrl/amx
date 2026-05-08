import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, User, Mail, Phone, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import OrderStatusSelect from "../components/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll() { return cookieStore.getAll(); } },
    }
  );

  const { data: order, error } = await supabase
    .from("orders")
    .select(`*, order_items(*, products(*))`)
    .eq("id", params.id)
    .single();

  if (!order || error) notFound();

  const stages = ["Order Placed", "Handcrafting", "Quality Check", "Shipped"];
  const currentStageIndex = stages.indexOf(order.status || "Order Placed");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black uppercase tracking-tighter">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
          <p className="text-text-muted text-sm mt-0.5">{new Date(order.created_at).toLocaleString()}</p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status || "Order Placed"} />
      </div>

      {/* Fulfillment Progress */}
      <div className="bg-surface border border-white/5 rounded-2xl p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-6">Fulfillment Pipeline</h2>
        <div className="flex items-center">
          {stages.map((stage, i) => (
            <div key={stage} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  i <= currentStageIndex ? "bg-primary text-black" : "bg-white/10 text-text-muted"
                }`}>
                  {i < currentStageIndex ? "✓" : i + 1}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest text-center whitespace-nowrap ${
                  i <= currentStageIndex ? "text-primary" : "text-text-muted"
                }`}>{stage}</span>
              </div>
              {i < stages.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all ${i < currentStageIndex ? "bg-primary" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="bg-surface border border-white/5 rounded-2xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-5">Customer</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-text-muted shrink-0" />
              <span className="text-sm font-bold">{order.customer_name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-text-muted shrink-0" />
              <span className="text-sm text-text-muted">{order.customer_email}</span>
            </div>
            {order.customer_phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-text-muted shrink-0" />
                <span className="text-sm text-text-muted">{order.customer_phone}</span>
              </div>
            )}
            {order.shipping_address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                <span className="text-sm text-text-muted">{order.shipping_address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-surface border border-white/5 rounded-2xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-5">Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Subtotal</span>
              <span className="font-mono">{formatPrice(order.total_amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Shipping</span>
              <span className="font-mono text-primary">Free</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between">
              <span className="font-bold uppercase tracking-widest text-sm">Total</span>
              <span className="font-mono font-black text-primary text-lg">{formatPrice(order.total_amount)}</span>
            </div>
            <div className="pt-2">
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-green-500/10 text-green-500">
                Payment Received
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted">Items Ordered</h2>
        </div>
        <div className="divide-y divide-white/5">
          {order.order_items?.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 p-5">
              <div className="w-14 h-14 bg-black rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {item.products?.image_url ? (
                  <img src={item.products.image_url} alt={item.products?.title} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-5 h-5 text-text-muted" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{item.products?.title || "Unknown Product"}</p>
                <p className="text-xs text-text-muted font-mono mt-0.5">
                  Qty: {item.quantity} × {formatPrice(item.price_at_purchase)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono font-black text-primary">{formatPrice(item.quantity * item.price_at_purchase)}</p>
              </div>
            </div>
          ))}
          {(!order.order_items || order.order_items.length === 0) && (
            <div className="p-8 text-center text-text-muted text-sm">No items found for this order.</div>
          )}
        </div>
      </div>
    </div>
  );
}
