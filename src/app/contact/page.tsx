import Header from "@/components/Header";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="pt-32 pb-24 container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-primary text-center">Contact Us</h1>
        <p className="text-text-muted text-center mb-16 max-w-xl mx-auto">Have a question about a custom design, an existing order, or just want to say hi? We&apos;d love to hear from you.</p>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Our Studio</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  16 Christian Basti<br />
                  Guwahati, Assam 781005<br />
                  India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Email Us</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  For support and custom inquiries:<br />
                  <a href="mailto:gamearcade199@gmail.com" className="text-primary hover:underline">gamearcade199@gmail.com</a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Call Us</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  <a href="tel:+919101361482" className="text-primary hover:underline">+91 9101361482</a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Business Hours</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Monday - Saturday: 10:00 AM - 7:00 PM IST<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form Placeholder */}
          <div className="bg-surface border border-white/10 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest block mb-2">Name</label>
                <input type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-white" placeholder="Your Name" />
              </div>
              <div>
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest block mb-2">Email</label>
                <input type="email" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-white" placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest block mb-2">Message</label>
                <textarea rows={4} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-white resize-none" placeholder="How can we help?"></textarea>
              </div>
              <button type="button" className="w-full bg-primary text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl hover:scale-[1.02] transition-transform">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
