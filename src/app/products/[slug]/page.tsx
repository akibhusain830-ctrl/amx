import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getProductsByCategory } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";

interface ProductPageProps {
  params: { slug: string };
}

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map(p => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found | AMX Signs" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amxsigns.com';
  const canonicalUrl = `${siteUrl}/products/${product.slug}`;
  // First 120 chars of description + CTA — optimised for human click-through
  const metaDescription = `${product.description.slice(0, 120)}. Handcrafted in India. Free shipping. 7-day returns.`;

  return {
    title: `${product.title} Neon Sign — ${product.category} LED Wall Art | AMX Signs India`,
    description: metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'product',
      title: `${product.title} LED Neon Sign | AMX Signs`,
      description: metaDescription,
      url: canonicalUrl,
      images: [{
        url: product.image_url,
        width: 1200,
        height: 1200,
        alt: `${product.title} ${product.category} Handcrafted LED Neon Sign`,
      }],
      other: {
        'product:price:amount': product.price.toString(),
        'product:price:currency': 'INR',
        'product:availability': product.in_stock ? 'instock' : 'outofstock',
        'product:brand': 'AMX Signs',
        'product:category': product.category,
      }
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} Neon Sign | AMX Signs`,
      description: metaDescription,
      images: [product.image_url],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amxsigns.com';

  // ── S-TIER HONEST JSON-LD SCHEMA WITH UNIFIED ENTITY @GRAPH ───────────────
  const allImages = product.images && product.images.length > 0
    ? product.images
    : [product.image_url];

  const organizationSchema = {
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    "name": "AMX Signs",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9101361482",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"]
    }
  };

  const websiteSchema = {
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    "url": siteUrl,
    "name": "AMX Signs",
    "publisher": { "@id": `${siteUrl}#organization` }
  };

  const webpageSchema = {
    "@type": "WebPage",
    "@id": `${siteUrl}/products/${product.slug}#webpage`,
    "url": `${siteUrl}/products/${product.slug}`,
    "name": `${product.title} Neon Sign | AMX Signs`,
    "isPartOf": { "@id": `${siteUrl}#website` }
  };

  const productSchema = {
    "@type": "Product",
    "@id": `${siteUrl}/products/${product.slug}#product`,
    "mainEntityOfPage": `${siteUrl}/products/${product.slug}#webpage`,
    "name": product.title,
    "description": product.description,
    "sku": product.id,
    "mpn": `AMX-${product.id}`,
    "brand": { "@id": `${siteUrl}#organization` },

    // ImageObject — Google Images surfaces captioned images better
    "image": allImages.map((url, i) => ({
      "@type": "ImageObject",
      "url": url,
      "caption": i === 0
        ? `${product.title} ${product.category} LED Neon Sign — Handcrafted by AMX Signs`
        : `${product.title} detail view ${i + 1}`,
      "width": 1200,
      "height": 1200,
    })),

    // AggregateRating — only injected when real data exists
    ...(product.rating ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.review_count || "1",
        "bestRating": "5",
        "worstRating": "1"
      }
    } : {}),

    // hasVariant — declares all 3 sizes so Google can show price range
    "hasVariant": [
      {
        "@type": "Product",
        "name": `${product.title} — Regular (14" x 12")`,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "INR",
          "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        }
      },
      {
        "@type": "Product",
        "name": `${product.title} — Medium (20" x 16")`,
        "offers": {
          "@type": "Offer",
          "price": product.price + 1500,
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
        }
      },
      {
        "@type": "Product",
        "name": `${product.title} — Large (28" x 22")`,
        "offers": {
          "@type": "Offer",
          "price": product.price + 3500,
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
        }
      }
    ],

    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/products/${product.slug}`,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "INR" },
        "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "IN" },
        // deliveryTime — "Delivery in 3-8 days" badge visible in search results
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 2, "unitCode": "DAY" },
          "transitTime": { "@type": "QuantitativeValue", "minValue": 3, "maxValue": 8, "unitCode": "DAY" }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "IN",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnPeriod",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      }
    }
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${siteUrl}/products/${product.slug}#faq`,
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is the ${product.title} neon sign safe for indoor use?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our signs use 12V low-voltage LEDs that stay cool to the touch and are 100% silent, making them safe for bedrooms and offices."
        }
      },
      {
        "@type": "Question",
        "name": `What sizes are available for the ${product.title} neon sign?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The ${product.title} is available in three sizes: Regular (14" x 12"), Medium (20" x 16"), and Large (28" x 22"). The Regular size suits bedrooms and desks. Medium works well for living room feature walls. Large is ideal for gaming rooms and cafes.`
        }
      },
      {
        "@type": "Question",
        "name": "What is the expected lifespan of AMX Neon Signs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our high quality LED neon signs are built to last over 50,000 hours of continuous use, equivalent to nearly 10 years of typical operation."
        }
      },
      {
        "@type": "Question",
        "name": "Is a professional required for installation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Our signs come with a complete mounting kit and are designed for DIY installation in under 10 minutes."
        }
      }
    ]
  };

  const unifiedGraphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      websiteSchema,
      webpageSchema,
      productSchema,
      faqSchema
    ]
  };

  const related = (await getProductsByCategory(product.category))
    .filter((p) => p.id !== product.id)
    .slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(unifiedGraphSchema) }} />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
