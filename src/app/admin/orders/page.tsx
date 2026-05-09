import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import OrderStatusSelect from './components/OrderStatusSelect'

type OrderItemView = {
  products?: {
    image_url?: string
    title?: string
  }
}

export default async function AdminOrders() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Order Management</h1>
        <p className="text-text-muted text-sm">Review and process incoming customer orders.</p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-surface border border-white/5 rounded-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10 [&>tr>th:first-child]:rounded-tl-2xl [&>tr>th:last-child]:rounded-tr-2xl">
            <tr>
              <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted">Order ID</th>
              <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted">Customer</th>
              <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted">Items</th>
              <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted">Amount</th>
              <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted">Status</th>
              <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders?.map((order) => (
              <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <span className="text-[10px] font-mono text-text-muted">#{order.id.slice(0, 8)}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold">{order.customer_name}</p>
                  <p className="text-[10px] font-mono text-text-muted">{order.customer_email}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex -space-x-2">
                    {order.order_items.map((item: OrderItemView, i: number) => (
                      <div key={i} className="w-8 h-8 rounded-lg bg-surface border border-white/10 flex items-center justify-center overflow-hidden relative z-10 hover:z-20 transition-all hover:-translate-y-1">
                        {item.products?.image_url ? (
                          <img src={item.products.image_url} alt={item.products?.title || "Product"} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[8px] font-mono text-text-muted/40 uppercase">IMG</span>
                        )}
                      </div>
                    ))}
                    {order.order_items.length > 3 && (
                      <div className="w-8 h-8 rounded-lg bg-surface border border-white/10 flex items-center justify-center text-[8px] font-mono text-text-muted relative z-0">
                        +{order.order_items.length - 3}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-primary">
                  {formatPrice(order.total_amount)}
                </td>
                <td className="px-6 py-4">
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status || 'Order Placed'} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-text-muted hover:text-white inline-block"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!orders || orders.length === 0) && (
          <div className="py-20 text-center">
            <ShoppingBag className="w-12 h-12 text-white/5 mx-auto mb-4" />
            <p className="text-text-muted text-sm font-mono uppercase tracking-widest">No orders found</p>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="bg-surface border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">#{order.id.slice(0, 8)}</span>
                <span className="text-[10px] font-mono text-primary">{formatPrice(order.total_amount)}</span>
              </div>
              
              <div>
                <p className="font-bold text-base">{order.customer_name}</p>
                <p className="text-[10px] font-mono text-text-muted mt-1">{order.customer_email}</p>
              </div>

              <div className="flex -space-x-2">
                {order.order_items.map((item: OrderItemView, i: number) => (
                  <div key={i} className="w-8 h-8 rounded-lg bg-black border border-white/10 flex items-center justify-center overflow-hidden relative z-10">
                    {item.products?.image_url ? (
                      <img src={item.products.image_url} alt={item.products?.title || "Product"} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[8px] font-mono text-text-muted/40 uppercase">IMG</span>
                    )}
                  </div>
                ))}
                {order.order_items.length > 3 && (
                  <div className="w-8 h-8 rounded-lg bg-black border border-white/10 flex items-center justify-center text-[8px] font-mono text-text-muted relative z-0">
                    +{order.order_items.length - 3}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-white/5 flex flex-col gap-3">
                <OrderStatusSelect orderId={order.id} currentStatus={order.status || 'Order Placed'} />
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-[10px] font-black uppercase tracking-widest text-center text-text-muted hover:text-white"
                >
                  View Order Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-surface border border-white/5 rounded-2xl">
            <ShoppingBag className="w-12 h-12 text-white/5 mx-auto mb-4" />
            <p className="text-text-muted text-sm font-mono uppercase tracking-widest">No orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}
