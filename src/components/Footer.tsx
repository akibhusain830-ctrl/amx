import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black uppercase tracking-tighter">
                AMX<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed">
              Premium high-energy neon art handcrafted to perfection. Elevate your space with custom, surgical precision neon signs.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs font-mono tracking-widest uppercase">
              <a href="#" className="text-text-muted hover:text-primary transition-colors">Instagram</a>
              <a href="#" className="text-text-muted hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="text-text-muted hover:text-primary transition-colors">Facebook</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li><Link href="/collections" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/customizer" className="hover:text-primary transition-colors">Custom Neon</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-6">Policies</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refunds" className="hover:text-white transition-colors">Refund & Cancellation</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <a href="mailto:gamearcade199@gmail.com" className="hover:text-white transition-colors break-all">
                  gamearcade199@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <a href="tel:+919101361482" className="hover:text-white transition-colors">
                  +91 9101361482
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>16 Christian Basti,<br />Guwahati, Assam 781005<br />India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted font-mono uppercase tracking-widest">
          <p>&copy; {currentYear} AMX Signs. All rights reserved.</p>
          <p>Designed for Impact.</p>
        </div>
      </div>
    </footer>
  );
}
