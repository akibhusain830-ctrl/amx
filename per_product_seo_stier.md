# S-Tier Per-Product SEO Plan — AMX Signs
### Goal: Every product page ranks in the top 3 for its target query.
**Based on:** Google's 2026 ranking model — Intent Alignment + Content Experience + Structural Clarity

---

> [!NOTE]
> Google no longer ranks pages on keywords alone. It ranks pages on **how well they satisfy the intent behind a search.** This plan is built around that model.

---

## How Google Ranks a Product Page in 2026

There are 7 dimensions. Each one is a gate. If you fail one, the others don't matter.

```
1. Search Intent Match    → Does the page answer THE specific query?
2. Meta Signal Quality    → Is the title/description compelling + keyword-exact?
3. Schema Depth           → Does structured data give Google full product context?
4. Content Depth          → Does the page have enough substance to deserve #1?
5. Internal Authority     → Do other pages on your site link TO this product?
6. User Experience (UX)   → Does the user stay, engage, and not bounce?
7. Image Search           → Does Google Images drive traffic to this product?
```

---

## Current State Gap Analysis (Honest)

| Dimension | Current Score | Gap |
| :--- | :---: | :--- |
| Search Intent Match | 7/10 | Title formula is good. Missing long-tail persona targeting. |
| Meta Signal Quality | 7/10 | Good title formula. **No explicit canonical.** Meta description uses raw 350-char description — not optimized for CTR. |
| Schema Depth | 8/10 | Product, FAQ, MerchantReturnPolicy done. **Missing: `ImageObject`, `hasVariant`, explicit `@id`.** |
| Content Depth | 6/10 | 350-char description is present. **Missing: use-case paragraph, size spec table, lifestyle context.** |
| Internal Authority | 3/10 | Related products link to each other. **No blog articles link TO products. No footer product links.** |
| User Experience (UX) | 7/10 | Good layout. **21 fonts hurt LCP score.** Tab system keeps users on page. |
| Image Search | 5/10 | Alt text upgraded. **Missing: `ImageObject` schema, filename optimization.** |

---

## Dimension 1: Search Intent Match

### What Google Is Looking For
Each product page must be the **definitive answer** for one specific query. Your page for the BMW M4 must be the best result for "BMW M4 neon sign India" — not just a page that mentions it.

### Current Gap
Your meta title formula `{Product} {Category} Neon Sign | AMX Signs` is good but generic.
It does not include:
- **Modifier keywords** (India, Buy, Online, Price)
- **Long-tail persona triggers** (For Garage, For Gaming Room, Gift)

### The Fix — Smarter Title Formula

**Files to Modify:** `src/app/products/[slug]/page.tsx` → `generateMetadata`

**New Formula:**
```
{Product Name} {Neon Sign} — {Category} LED Wall Art | AMX Signs India
```

**Why this wins:**
- Contains the exact product name (captures specific query)
- Contains "Neon Sign" (captures category query)
- Contains category context (captures broad query)
- Contains "AMX Signs India" (captures branded + country query)
- Total length: ~58 chars. Perfect.

**Example outputs:**
```
BMW M4 G82 Neon Sign — Cars LED Wall Art | AMX Signs India
Silverstone Circuit Neon Sign — F1 LED Wall Art | AMX Signs India
Dragon Ball Goku Neon Sign — Anime LED Wall Art | AMX Signs India
```

### Meta Description — Optimized for CTR (Not Just Keywords)

**Current:** Raw product description (350 chars, neutral, factual).
**Problem:** Neutral is good for Google but not for a human clicking a result.

**New Formula per product:**
```
{Product description (first 120 chars)}. Handcrafted in India. Free shipping. 7-day returns. Order now at AMX Signs.
```

This adds a **Call-to-Action** at the end while keeping the factual description. Google uses CTR as a ranking signal. A compelling meta description means more clicks, which means higher ranking.

---

## Dimension 2: Meta Signal Architecture

### What Needs to Change in `generateMetadata`

**Files to Modify:** `src/app/products/[slug]/page.tsx`

```ts
export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found | AMX Signs" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amxsigns.com';
  const canonicalUrl = `${siteUrl}/products/${product.slug}`;
  
  // CTA-optimized description
  const metaDescription = `${product.description.slice(0, 120)}. Handcrafted in India. Free shipping. 7-day returns.`;

  return {
    title: `${product.title} Neon Sign — ${product.category} LED Wall Art | AMX Signs India`,
    description: metaDescription,
    
    // ── EXPLICIT CANONICAL ──────────────────────────────────────────────────
    alternates: {
      canonical: canonicalUrl,
    },
    
    // ── OPENgraph ────────────────────────────────────────────────────────────
    openGraph: {
      type: 'product',                          // 'product' type, not 'website'
      title: `${product.title} LED Neon Sign | AMX Signs`,
      description: metaDescription,
      url: canonicalUrl,
      images: [{
        url: product.image_url,
        width: 1200,
        height: 1200,
        alt: `${product.title} ${product.category} Handcrafted LED Neon Sign`,
      }],
    },
    
    // ── TWITTER CARD ─────────────────────────────────────────────────────────
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} Neon Sign | AMX Signs`,
      description: metaDescription,
      images: [product.image_url],
    },
  };
}
```

**Key additions vs. current:**
1. `alternates.canonical` — prevents duplicate content penalty
2. `openGraph.type: 'product'` — tells Facebook/WhatsApp this is a product (better link previews)
3. CTA-optimized description — increases CTR from search results

---

## Dimension 3: Schema Depth

### What's Currently Missing

**A. `@id` on the Product schema**
Without an `@id`, Google cannot link your product to its Knowledge Graph. This is required for Google Shopping integration.

**B. `hasVariant` — Size Variants as separate offers**
You have 3 sizes (Regular, Medium, Large) with different prices. Google can show ALL THREE prices in search results if you declare them as variants.

**C. `ImageObject` schema**
Declaring images as `ImageObject` with `caption` helps Google Images surface your product photos for visual searches.

**D. `gtin` / `identifier` field**
Even a manufacturer part number helps Google distinguish your product from duplicates.

### The Fix — Upgraded `productSchema` in `page.tsx`

```ts
const allImages = product.images && product.images.length > 0
  ? product.images
  : [product.image_url];

const productSchema = {
  "@context": "https://schema.org/",
  "@type": "Product",
  "@id": `${siteUrl}/products/${product.slug}#product`,   // ← NEW: Knowledge Graph anchor
  "name": product.title,
  "description": product.description,
  "sku": product.id,
  "mpn": `AMX-${product.id}`,
  "brand": {
    "@type": "Brand",
    "name": "AMX Signs"
  },
  
  // ── IMAGOBJECT (tells Google Images exactly what each photo is) ─────────
  "image": allImages.map((url, i) => ({
    "@type": "ImageObject",
    "url": url,
    "caption": i === 0
      ? `${product.title} ${product.category} LED Neon Sign — Handcrafted by AMX Signs`
      : `${product.title} detail view ${i + 1}`,
    "width": 1200,
    "height": 1200,
  })),
  
  // ── HONEST AggregateRating (only if real data exists) ──────────────────
  ...(product.rating ? {
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.review_count,
      "bestRating": "5",
      "worstRating": "1"
    }
  } : {}),
  
  // ── HAS VARIANT (declares all 3 sizes as separate Offers) ─────────────
  "hasVariant": [
    {
      "@type": "Product",
      "name": `${product.title} — Regular (14" x 12")`,
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "INR",
        "availability": product.in_stock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
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
  
  // ── PRIMARY OFFER (current, unchanged) ────────────────────────────────
  "offers": {
    "@type": "Offer",
    "url": `${siteUrl}/products/${product.slug}`,
    "priceCurrency": "INR",
    "price": product.price,
    "priceValidUntil": "2026-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": product.in_stock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0",
        "currency": "INR"
      },
      "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": "IN"
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": {
          "@type": "QuantitativeValue",
          "minValue": 1,
          "maxValue": 2,
          "unitCode": "DAY"
        },
        "transitTime": {
          "@type": "QuantitativeValue",
          "minValue": 3,
          "maxValue": 8,
          "unitCode": "DAY"
        }
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
```

**Key additions vs. current:**
1. `@id` — Knowledge Graph anchor
2. `ImageObject` with `caption` — Google Images optimization
3. `hasVariant` — all 3 sizes declared, Google can show price range
4. `deliveryTime` — shows "Delivery in 3-8 days" in search results

---

## Dimension 4: Content Depth

### What Google Means by "Content Depth"
Not word count. **Completeness.** Does the page answer every question a buyer would have before purchasing?

### Current Gap
Your pages have:
- ✅ 350-char product description
- ✅ Features list
- ✅ 4 FAQs (generic)
- ✅ Installation guide

**Missing:**
- ❌ A "Who is this for?" paragraph (persona/use-case)
- ❌ Size comparison context (why choose Regular vs. Large?)
- ❌ A product-specific FAQ question (currently all generic)

### The Fix in `ProductDetailClient.tsx`

**A. Add a use-case sentence to the description section.**
Below the existing `product.description`, add a dynamically generated use-case line based on category:

```ts
const useCaseByCategory: Record<string, string> = {
  'Cars':        'A reliable choice for garage walls, home showrooms, or as a gift for automotive enthusiasts.',
  'Gaming':      'Designed for gaming setups, streaming backgrounds, and bedroom accent lighting.',
  'Anime':       'Popular among collectors and fans looking to display their passion for Japanese animation.',
  'F1':          'Ideal for race fans, home offices, and premium man caves.',
  'Aesthetic':   'Pairs well with minimalist interiors, café setups, and creative studio spaces.',
  'Love':        'A meaningful personalised gift for anniversaries, Valentine\'s Day, or home décor.',
  'Wings':       'Works as a statement wall piece for bedrooms, dressing rooms, and photo backdrops.',
  'Cafe':        'Designed for café environments, reception walls, and hospitality interiors.',
};

const useCase = useCaseByCategory[product.category] ?? 
  'A handcrafted LED neon sign for home decoration and gifting.';
```

Render below the description:
```tsx
<p className="text-text-muted/70 text-sm leading-relaxed mt-3 italic max-w-3xl">
  {useCase}
</p>
```

**B. Make the first FAQ question product-specific (already done), but also add a size FAQ:**

In `faqSchema` in `page.tsx`, add:
```ts
{
  "@type": "Question",
  "name": `What sizes are available for the ${product.title} neon sign?`,
  "acceptedAnswer": {
    "@type": "Answer",
    "text": `The ${product.title} is available in three sizes: Regular (14" x 12"), Medium (20" x 16"), and Large (28" x 22"). The Regular size suits bedrooms and desks. Medium works well for living room feature walls. Large is ideal for gaming rooms and cafes.`
  }
}
```

This FAQ **directly targets the search query** "what size neon sign for bedroom" — a very common related question.

---

## Dimension 5: Internal Authority

### Why This Matters
Google ranks pages partly based on how many **other pages on your own site** link to them. Currently, no blog or category page links to specific products.

### The Fix — 3 Internal Link Sources

**A. Category Pages → Products (already exists via product grid)**
The product grid provides links. Good. But there is no text-based link with anchor text.

Add 2-3 highlighted/featured products in the category page intro with rich anchor text:
```tsx
// In category page intro paragraph:
<p>Explore our {categoryName} collection, including popular designs like the{' '}
  <Link href="/products/bmw-m4-silhouette-neon-sign">BMW M4 Silhouette</Link> and{' '}
  <Link href="/products/silverstone-f1-circuit-neon-sign">Silverstone Circuit</Link>.
</p>
```

**B. Blog Articles → Products (once blog is built)**
Every blog article links to 3 relevant products with descriptive anchor text.
Example: A "Gaming Room Setup Guide" article links to all 6 gaming neon products.

**C. Homepage → Bestselling Products**
If you have a "Bestsellers" or "Featured" section on the homepage, ensure each card links to the product with a `title` attribute:
```tsx
<Link href={`/products/${product.slug}`} title={`${product.title} LED Neon Sign — Buy Online India`}>
```

---

## Dimension 6: User Experience (UX) Signals

### Google Uses Bounce Rate + Dwell Time as Ranking Signals

**Current Issues:**
1. **21 fonts = slow LCP** — If the page takes >2.5s to show content, Google demotes it. Fix is in Phase 1B of the main roadmap (font optimization).
2. **No "engagement hooks"** below the fold — Users who scroll down and find thin content bounce.

### The Fix

**A. Add a "Technical Specifications" table below the features grid:**
This is pure content depth. It keeps users on the page longer (higher dwell time).

```tsx
// In the 'details' tab section:
<div className="mt-6 rounded-xl border border-white/10 overflow-hidden">
  <table className="w-full text-sm">
    <tbody>
      {[
        ['Power Supply', '12V DC Adapter (included)'],
        ['Operation', 'Silent, no hum or heat'],
        ['Mounting', 'Screws & brackets (included)'],
        ['Lifespan', '50,000+ hours'],
        ['Control', 'On/Off switch on adapter'],
        ['Country of Origin', 'India'],
      ].map(([label, value]) => (
        <tr key={label} className="border-b border-white/5">
          <td className="px-4 py-3 text-text-muted text-xs uppercase tracking-wider font-mono">{label}</td>
          <td className="px-4 py-3 text-white/90 text-sm">{value}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

**B. WhatsApp CTA below Add-to-Cart**
Indian users heavily use WhatsApp for purchase queries. A "Ask on WhatsApp" button below the cart reduces bounces from users who want to ask questions.

---

## Dimension 7: Google Image Search

### Why This is a Hidden Traffic Source
For visual products like neon signs, Google Images drives significant traffic. When a user searches "F1 neon sign" and clicks on an image, they land on your product page.

### Current Gap
Alt text is upgraded. But the **image filenames** are likely UUIDs from Supabase storage (e.g., `abc123.jpg`). Google reads filenames.

### The Fix

**A. `ImageObject` schema** — already included in Dimension 3 above.

**B. Image filename strategy** — when uploading product images to Supabase storage, name them:
```
bmw-m4-silhouette-neon-sign-amx.jpg       (main)
bmw-m4-silhouette-neon-sign-detail-2.jpg  (gallery)
```
This is not a code change but an operational policy for future uploads.

**C. Add `title` to the main product image component:**
Already done in previous session. Verify it's present.

---

## Keyword Targeting — Which Query Each Product Owns

Each product must "own" exactly one primary query. Below is the mapping for top products:

| Product | Primary Target Query | Secondary Query |
| :--- | :--- | :--- |
| BMW M4 G82 Silhouette | "BMW M4 neon sign India" | "car neon sign for garage" |
| Silverstone F1 Circuit | "F1 Silverstone neon sign" | "racing neon wall art India" |
| Dragon Ball Goku | "Goku neon sign India" | "anime neon sign for bedroom" |
| Formula 1 Logo | "Formula 1 logo neon sign" | "F1 neon sign buy online" |
| Love Birds Sign | "love neon sign India" | "couple neon sign gift" |
| Gaming Controller | "gaming neon sign India" | "PS5 gaming room neon light" |

The current title formula and descriptions are already aligned to these. The remaining fix is **adding the use-case sentence** (Dimension 4) to seal the intent match.

---

## Complete File Footprint for Per-Product S-Tier

| File | Change | Dimension |
| :--- | :--- | :---: |
| `src/app/products/[slug]/page.tsx` | New title formula + canonical + OpenGraph type='product' | 1, 2 |
| `src/app/products/[slug]/page.tsx` | Upgraded productSchema with @id, ImageObject, hasVariant, deliveryTime | 3 |
| `src/app/products/[slug]/page.tsx` | Add size-specific FAQ to faqSchema | 4 |
| `src/app/products/[slug]/ProductDetailClient.tsx` | Add useCaseByCategory sentence | 4 |
| `src/app/products/[slug]/ProductDetailClient.tsx` | Add Technical Specifications table | 6 |
| `src/app/collections/[category]/page.tsx` | Add featured product links in intro text | 5 |
| `src/components/Footer.tsx` | Add keyword-rich product + category links | 5 |

---

## After Implementation: Expected Result

| Dimension | Before | After |
| :--- | :---: | :---: |
| Search Intent Match | 7/10 | 9/10 |
| Meta Signal Quality | 7/10 | 9/10 |
| Schema Depth | 8/10 | 10/10 |
| Content Depth | 6/10 | 9/10 |
| Internal Authority | 3/10 | 6/10 |
| User Experience | 7/10 | 8/10 |
| Image Search | 5/10 | 8/10 |
| **Average** | **6.1/10** | **8.4/10** |

> [!IMPORTANT]
> The remaining gap from 8.4 → 10 is filled by real customer reviews (which fire the AggregateRating schema) and inbound backlinks from blog content and press. Both are off-page actions.
