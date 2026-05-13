import Header from "@/components/Header";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="pt-32 pb-24 container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-primary">Terms & Conditions</h1>
        
        <div className="space-y-8 text-white/80 leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
            <p>Welcome to AMX Signs. By accessing our website and purchasing our products, you agree to be bound by these Terms & Conditions. Please read them carefully before using our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Products & Custom Designs</h2>
            <p>We specialize in custom neon signs. While we strive to ensure the preview closely matches the final product, slight variations in color and dimensions may occur due to the handcrafted nature of our products.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Pricing & Payments</h2>
            <p>All prices are listed in INR. We reserve the right to modify prices at any time without prior notice. Payments must be completed securely via our payment gateway (Razorpay) before production begins.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Intellectual Property</h2>
            <p>All content on this website, including designs, text, graphics, and logos, are the property of AMX Signs. You may not use, reproduce, or distribute our content without written permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Limitation of Liability</h2>
            <p>AMX Signs is not liable for any direct, indirect, incidental, or consequential damages arising from your use of our products or website. Our liability is strictly limited to the purchase price of the product.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">6. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms will be subject to the exclusive jurisdiction of the courts of Guwahati, Assam.</p>
          </section>

          <p className="pt-8 text-xs text-text-muted">Last updated: May 2026</p>
        </div>
      </div>
    </main>
  );
}
