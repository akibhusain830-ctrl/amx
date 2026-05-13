import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="pt-32 pb-24 container mx-auto px-4 max-w-4xl text-center">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-primary">About AMX</h1>
        <p className="text-lg md:text-xl text-text-muted mb-16 max-w-2xl mx-auto leading-relaxed">
          We don&apos;t just bend tubes. We craft digital theatre. High-fidelity, custom neon art designed to elevate your space.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left mb-24">
          <div className="bg-surface border border-white/10 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              To democratize premium lighting. We believe everyone deserves to experience the transformative power of neon art, meticulously handcrafted with surgical precision.
            </p>
          </div>
          <div className="bg-surface border border-white/10 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-4">The Craft</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Every AMX sign is built using advanced LED neon flex technology. This ensures a brilliant glow, superior durability, and energy efficiency compared to traditional glass neon.
            </p>
          </div>
          <div className="bg-surface border border-white/10 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-4">Your Vision</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Whether it&apos;s a brand logo, a wedding backdrop, or a piece of bedroom aesthetic, our customizer puts the design power in your hands. You dream it, we build it.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Built in Assam. Shipped Everywhere.</h2>
          <p className="text-text-muted max-w-xl mx-auto mb-8">
            Operating out of our studio in Christian Basti, Guwahati, we handle every step of the process—from design to dispatch—ensuring absolute quality control.
          </p>
        </div>
      </div>
    </main>
  );
}
