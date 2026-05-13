import Header from "@/components/Header";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="pt-32 pb-24 container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-primary">Privacy Policy</h1>
        
        <div className="space-y-8 text-white/80 leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products, or otherwise contact us. This includes names, phone numbers, email addresses, and shipping addresses.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. Specifically, we use it to fulfill and manage your orders, payments, and returns.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Payment Processing</h2>
            <p>We use Razorpay for processing payments. We/Razorpay do not store your card data on their servers. The data is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS) when processing payment.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Sharing Your Information</h2>
            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may share data with third-party vendors, service providers (like shipping partners), contractors or agents who perform services for us or on our behalf.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Contact Us</h2>
            <p>If you have questions or comments about this notice, you may email us at gamearcade199@gmail.com or by post to: 16 Christian Basti, Guwahati, Assam 781005, India.</p>
          </section>

          <p className="pt-8 text-xs text-text-muted">Last updated: May 2026</p>
        </div>
      </div>
    </main>
  );
}
