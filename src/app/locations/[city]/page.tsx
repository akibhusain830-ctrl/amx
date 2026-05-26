import { notFound } from "next/navigation";
import { CITIES, CITY_BY_SLUG } from "@/lib/cities";
import { getProducts } from "@/lib/products";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";

interface CityPageProps {
  params: { city: string };
}

export const revalidate = 3600; // Revalidate hourly — content is semi-static
export const dynamicParams = false;

export async function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: CityPageProps) {
  const city = CITY_BY_SLUG.get(params.city);
  if (!city) return { title: "Not Found | AMX Signs" };

  const title = `Neon Signs in ${city.name} — Handcrafted LED Art | AMX Signs`;
  const description = `Buy premium handcrafted LED neon signs in ${city.name}, ${city.region}. Fast ${city.name} delivery, free shipping, 1-year warranty. Custom and ready-made neon signs available.`;

  return {
    title,
    description,
    alternates: { canonical: `https://amxsigns.com/locations/${city.slug}` },
    openGraph: {
      title,
      description,
      url: `https://amxsigns.com/locations/${city.slug}`,
    },
  };
}

// City-specific delivery and content data
const cityDetails: Record<string, { deliveryDays: string; landmarks: string }> = {
  mumbai:     { deliveryDays: "3-5", landmarks: "Bandra, Andheri, Powai, Thane" },
  delhi:      { deliveryDays: "3-5", landmarks: "Connaught Place, Dwarka, Pitampura" },
  bangalore:  { deliveryDays: "4-6", landmarks: "Koramangala, Indiranagar, Whitefield" },
  hyderabad:  { deliveryDays: "4-6", landmarks: "Banjara Hills, Gachibowli, Jubilee Hills" },
  chennai:    { deliveryDays: "4-6", landmarks: "Anna Nagar, T. Nagar, Adyar" },
  pune:       { deliveryDays: "3-5", landmarks: "Koregaon Park, Kharadi, Hinjewadi" },
  ahmedabad:  { deliveryDays: "4-6", landmarks: "Navrangpura, SG Highway, Prahlad Nagar" },
  kolkata:    { deliveryDays: "5-7", landmarks: "Salt Lake, Park Street, New Town" },
  gurgaon:    { deliveryDays: "3-5", landmarks: "DLF Cyber City, Sohna Road, Golf Course Road" },
  noida:      { deliveryDays: "3-5", landmarks: "Sector 18, Expressway, Greater Noida" },
  jaipur:     { deliveryDays: "4-6", landmarks: "Malviya Nagar, C-Scheme, Mansarovar" },
  chandigarh: { deliveryDays: "4-6", landmarks: "Sector 17, Sector 35, Mohali" },
};

const popularCategories = [
  { label: "Gaming Neon Signs", href: "/collections/gaming" },
  { label: "Car Neon Signs",    href: "/collections/cars" },
  { label: "F1 Racing Signs",  href: "/collections/f1" },
  { label: "Anime Neon Signs", href: "/collections/anime" },
  { label: "Aesthetic Signs",  href: "/collections/aesthetic" },
  { label: "Under ₹4000",      href: "/collections/under-4000" },
];

export default async function CityPage({ params }: CityPageProps) {
  const city = CITY_BY_SLUG.get(params.city);
  if (!city) return notFound();

  const details = cityDetails[city.slug] ?? { deliveryDays: "4-7", landmarks: "across the city" };

  // Fetch 6 bestselling products to display as featured
  const allProducts = await getProducts();
  const featured = allProducts.slice(0, 6);

  const siteUrl = "https://amxsigns.com";

  // LocalBusiness schema with city context
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "OnlineBusiness",
    "name": "AMX Signs",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": `AMX Signs delivers premium handcrafted LED neon signs to ${city.name}, ${city.region}. Free shipping on all orders.`,
    "areaServed": {
      "@type": "City",
      "name": city.name,
      "containedInPlace": { "@type": "State", "name": city.region }
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": `Neon Signs in ${city.name}`, "item": `${siteUrl}/locations/${city.slug}` }
    ]
  };

  return (
    <main className="min-h-screen bg-black selection:bg-primary/30 selection:text-primary">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="pt-28 pb-24 container mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs font-mono text-text-muted uppercase tracking-widest">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li className="text-white/20">/</li>
            <li className="text-white/60">Neon Signs in {city.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <div className="mb-14">
          <span className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">Local Delivery</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            Neon Signs in {city.name}
          </h1>
          <p className="text-text-muted text-base md:text-lg leading-relaxed max-w-2xl">
            AMX Signs delivers premium handcrafted LED neon signs to {city.name} and across {city.region}.
            We ship to {details.landmarks} and all {city.name} pin codes in {details.deliveryDays} business days.
            Every sign is handcrafted in India, includes a full mounting kit, and comes with a 1-year warranty.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: "Delivery to " + city.name, value: details.deliveryDays + " Days" },
            { label: "Shipping", value: "Free" },
            { label: "Warranty", value: "1 Year" },
            { label: "Returns", value: "7 Days" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-surface/50 p-4 text-center">
              <p className="text-2xl font-black text-primary mb-1">{s.value}</p>
              <p className="text-xs font-mono text-text-muted uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Popular Categories */}
        <div className="mb-16">
          <h2 className="text-xl font-black uppercase tracking-tighter mb-6">
            Popular Categories in {city.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularCategories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="rounded-xl border border-white/10 bg-surface/50 p-4 text-sm font-semibold hover:border-primary/50 hover:text-primary transition-colors text-center"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-16">
          <h2 className="text-xl font-black uppercase tracking-tighter mb-6">
            Bestselling Signs — Shipped to {city.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {featured.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                title={`${product.title} LED Neon Sign — Buy Online, Deliver to ${city.name}`}
                className="rounded-2xl border border-white/10 bg-surface/50 overflow-hidden hover:border-primary/30 transition-colors group"
              >
                <div className="aspect-square relative bg-black overflow-hidden">
                  <Image
                    src={product.image_url ?? ""}
                    alt={`${product.title} Neon Sign — Delivery to ${city.name}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs font-black uppercase tracking-tight truncate">{product.title}</p>
                  <p className="text-primary text-sm font-black mt-1">₹{product.price.toLocaleString("en-IN")}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Local CTA */}
        <div className="rounded-2xl border border-white/10 bg-surface/50 p-8 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-3">
            Shop All Neon Signs — Delivered to {city.name}
          </h2>
          <p className="text-text-muted text-sm mb-6 max-w-lg mx-auto">
            Browse our full catalogue of 50+ handcrafted LED neon signs. Free shipping to all {city.name} pin codes.
            Order by 6 PM for same-day dispatch.
          </p>
          <Link
            href="/collections"
            className="inline-block bg-primary text-black px-8 py-4 rounded-full font-black text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
          >
            Browse All Signs
          </Link>
        </div>
      </div>
    </main>
  );
}
