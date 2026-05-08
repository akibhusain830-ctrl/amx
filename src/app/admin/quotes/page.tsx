import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { formatPrice } from '@/lib/utils'
import { MessageSquare, Calendar, User, Mail, Phone, Maximize2 } from 'lucide-react'
import QuoteStatusSelect from './components/QuoteStatusSelect'

export default async function AdminQuotes() {
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

  const { data: quotes } = await supabase
    .from('custom_designs')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Custom Quote Requests</h1>
        <p className="text-text-muted text-sm">Review design specifications and contact potential customers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {quotes?.map((quote) => (
          <div key={quote.id} className="bg-surface border border-white/5 rounded-2xl p-6 flex flex-col h-full group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl border border-white/10 flex items-center justify-center text-primary">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight">{quote.customer_name}</h3>
                  <div className="flex items-center gap-2 text-[9px] font-mono text-text-muted uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    {new Date(quote.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <QuoteStatusSelect quoteId={quote.id} currentStatus={quote.status || 'Pending'} />
            </div>

            <div className="flex-1 bg-black/40 rounded-xl p-5 border border-white/5 mb-6 relative overflow-hidden">
               <div className="relative z-10 text-center py-4">
                 <p className="text-2xl font-black uppercase tracking-tighter mb-2" style={{ color: '#C6FF00', textShadow: '0 0 10px rgba(198,255,0,0.5)' }}>
                   {quote.design_text}
                 </p>
                 <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-text-muted uppercase tracking-widest">
                   <span>{quote.font_style}</span>
                   <span className="opacity-20">|</span>
                   <span>{quote.color_name}</span>
                   <span className="opacity-20">|</span>
                   <span>{quote.size_cm}CM</span>
                 </div>
               </div>
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="space-y-3">
                 <div className="flex items-center gap-2 text-xs text-text-muted">
                   <Mail className="w-3.5 h-3.5" />
                   <span className="truncate">{quote.customer_email}</span>
                 </div>
                 <div className="flex items-center gap-2 text-xs text-text-muted">
                   <Phone className="w-3.5 h-3.5" />
                   <span>{quote.customer_phone}</span>
                 </div>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">Estimate</p>
                 <p className="text-lg font-black text-primary">{formatPrice(quote.estimated_price)}</p>
               </div>
            </div>

            <a href={`mailto:${quote.customer_email}?subject=AMX%20Signs%20-%20Quote%20Proposal:%20${quote.design_text}&body=Hi%20${quote.customer_name},%0D%0A%0D%0AHere%20is%20the%20proposal%20for%20your%20custom%20neon%20sign%20'${quote.design_text}'...`} className="block w-full bg-white text-black py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-colors text-center flex items-center justify-center gap-2">
              Review & Send Proposal <Maximize2 className="w-3 h-3" />
            </a>
          </div>
        ))}
        {(!quotes || quotes.length === 0) && (
          <div className="col-span-full py-20 text-center bg-surface border border-dashed border-white/10 rounded-3xl">
            <MessageSquare className="w-12 h-12 text-white/5 mx-auto mb-4" />
            <p className="text-text-muted text-sm font-mono uppercase tracking-widest">No quote requests yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
