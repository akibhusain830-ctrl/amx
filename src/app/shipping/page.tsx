import Header from "@/components/Header";

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="pt-32 pb-24 container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-primary">Shipping & Delivery</h1>
        
        <div className="space-y-8 text-white/80 leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Processing Time</h2>
            <p>Every AMX Sign is handcrafted to order. Standard production time is 3 to 5 business days from the date your order is confirmed and payment is received.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Shipping Timelines</h2>
            <p>Once your sign passes our strict quality control and is dispatched, standard delivery within India takes approximately 4 to 7 business days depending on your location. Expedited shipping options may be available at checkout.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Shipping Costs</h2>
            <p>We offer free standard shipping on all orders across India. Any express shipping costs will be clearly displayed during the checkout process.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Tracking Your Order</h2>
            <p>Once your order has shipped, you will receive a confirmation email containing your tracking number and a link to monitor your package&apos;s journey.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Unforeseen Delays</h2>
            <p>While we strive to meet all delivery estimates, AMX Signs is not liable for delays caused by courier partners, weather conditions, or other circumstances beyond our control.</p>
          </section>

          <p className="pt-8 text-xs text-text-muted">Last updated: May 2026</p>
        </div>
      </div>
    </main>
  );
}
