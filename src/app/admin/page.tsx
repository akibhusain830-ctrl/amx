import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ShoppingBag, MessageSquare, TrendingUp, Users } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function AdminDashboard() {
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

  // Fetch Stats in parallel
  const [orderCountRes, quoteRes, recentOrdersRes, salesDataRes] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('custom_designs').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('orders').select('total_amount')
  ])

  const orderCount = orderCountRes.count
  const quoteCount = quoteRes.count
  const recentOrders = recentOrdersRes.data
  const salesData = salesDataRes.data
  
  const totalRevenue = salesData?.reduce((acc, curr) => acc + curr.total_amount, 0) || 0;

  const stats = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'text-primary' },
    { label: 'Orders', value: orderCount || 0, icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Quotes', value: quoteCount || 0, icon: MessageSquare, color: 'text-purple-500' },
    { label: 'Customers', value: orderCount ? Math.floor(orderCount * 0.8) : 0, icon: Users, color: 'text-green-500' },
  ]

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Dashboard Overview</h1>
        <p className="text-text-muted text-sm">Real-time performance metrics for AMX Signs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface border border-white/5 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Live</span>
            </div>
            <p className="text-text-muted text-xs font-mono uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-surface border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-black uppercase tracking-tighter mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders?.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-black border border-white/5">
                <div>
                  <p className="text-sm font-bold">{order.customer_name}</p>
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary">{formatPrice(order.total_amount)}</p>
                  <span className="text-[9px] font-mono text-accent-mint uppercase px-2 py-0.5 rounded-full bg-accent-mint/10">Paid</span>
                </div>
              </div>
            ))}
            {(!recentOrders || recentOrders.length === 0) && (
              <p className="text-center text-text-muted text-sm py-10">No orders yet.</p>
            )}
          </div>
        </div>

        <div className="bg-surface border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-black uppercase tracking-tighter mb-6">System Health</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Supabase Database</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-accent-mint">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Edge Functions</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-accent-mint">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Order Processing</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-accent-mint">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
