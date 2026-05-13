import Header from "@/components/Header";

export default function RefundsPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="pt-32 pb-24 container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-primary">Refund & Cancellation</h1>
        
        <div className="space-y-8 text-white/80 leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Custom Neon Signs</h2>
            <p>Because all of our neon signs are 100% custom-made to order based on your specifications, we <strong>cannot offer refunds, returns, or cancellations</strong> once production has begun. Please review your custom designs and text carefully before placing an order.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Damages During Transit</h2>
            <p>If your sign arrives damaged or defective, we will replace or repair it at no cost to you. You must contact us within 24 hours of delivery with clear photo and video evidence of the damage to the box and the sign.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Order Cancellations</h2>
            <p>Orders can only be cancelled within 12 hours of placement, provided production has not yet started. After this window, the materials have been cut and allocated, and cancellation is no longer possible.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Warranty</h2>
            <p>All our indoor signs come with a 12-month warranty covering electrical components when used properly. This does not cover physical damage caused by dropping, improper installation, or misuse.</p>
          </section>

          <p className="pt-8 text-xs text-text-muted">Last updated: May 2026</p>
        </div>
      </div>
    </main>
  );
}
