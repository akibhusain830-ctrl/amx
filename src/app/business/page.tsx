import { Metadata } from "next";
import Header from "@/components/Header";
import { Briefcase, Zap, ShieldCheck, Truck, Mail } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "B2B & Custom Business Signage | AMX Signs",
  description: "Premium handcrafted LED neon logos and signage for cafes, gyms, and retail chains. Bulk orders and custom business branding solutions with fast delivery.",
  openGraph: {
    title: "Business Signage Solutions | AMX Signs",
    description: "Handcrafted LED neon for your business. From logos to complete retail branding.",
  }
};

export default function BusinessPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="pt-32 pb-20 container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">Enterprise Solutions</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
            Illuminate Your <br /> <span className="text-primary">Brand Identity</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            We partner with cafes, gyms, and retail chains to create high-impact, handcrafted LED neon signage that defines your physical presence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: Zap, title: "Logo Fabrication", desc: "Turn your complex business logo into a high-fidelity glowing masterpiece." },
            { icon: ShieldCheck, title: "Commercial Grade", desc: "Built with high-density LEDs designed for 24/7 commercial operation." },
            { icon: Briefcase, title: "Bulk Solutions", desc: "Special pricing and logistics for franchise networks and corporate gifting." },
          ].map((usp, i) => (
            <div key={i} className="bg-surface/50 border border-white/5 p-8 rounded-3xl">
              <usp.icon className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">{usp.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{usp.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-primary p-8 md:p-16 text-black flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Ready for a Custom Quote?</h2>
            <p className="font-medium opacity-80">Our B2B specialists will help you design and scale your brand signage across India.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link 
              href="https://wa.me/your-number" 
              className="bg-black text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest text-center"
            >
              WhatsApp Us
            </Link>
            <Link 
              href="mailto:business@amxsigns.com" 
              className="bg-white/20 border border-black/10 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest text-center"
            >
              Email Business Desk
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
