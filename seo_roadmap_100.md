# AMX Signs: Codebase-Only SEO Roadmap to Maximum Organic Traffic
**Goal:** Maximum organic traffic via code changes only.
**Honest Ceiling:** ~85/100 from code. Remaining 15 requires backlinks + real reviews (off-page).

---

> [!IMPORTANT]
> Phases are ordered by **Impact-to-Effort ratio**. Phase 1 and 2 are blocking — they must be done before the rest delivers full benefit. Do not skip ahead.

---

## Phase 1 — Critical Bug Fixes (Do Today)
**Why first:** These bugs are actively hurting your crawl budget and trust signals with Google right now.

### Fix 1A: Build the City Landing Pages (High Impact)
**Problem:** Your sitemap declares `/locations/mumbai` etc. but the routes return 404.
A 404 in your own sitemap tells Google your site is poorly maintained.

**Files to Create:**
- `src/app/locations/[city]/page.tsx` — Dynamic city landing page
- `src/app/locations/[city]/CityClient.tsx` — UI component

**Content Strategy per page:**
Each city page must have:
1. `<h1>` = "Neon Signs in {City} — Handcrafted LED Art, Fast Delivery"
2. A 150-word city-specific paragraph (e.g., "AMX Signs delivers to Mumbai in 3-5 days...")
3. A product grid filtered by bestsellers
4. Local trust signals (city-specific delivery time)
5. `JSON-LD LocalBusiness` schema with city in the address

**SEO Impact:** Captures "neon signs in Mumbai", "neon sign shop Delhi" — high-intent local queries that competitors are not targeting programmatically.

---

### Fix 1B: Font Optimization (High Impact on Core Web Vitals)
**Problem:** 21 Google Fonts are loaded globally. Each is a render-blocking network request. This directly degrades your LCP (Largest Contentful Paint) score, which Google uses as a ranking factor.

**Files to Modify:** `src/app/layout.tsx`

**Strategy:**
- Keep only 3 core UI fonts in `layout.tsx`: `Inter`, `Outfit`, `JetBrains_Mono`
- Move all 18 neon-customizer fonts into a separate `src/app/customizer/layout.tsx` (segment-level layout). They will only load when a user visits the customizer route.
- Add `display: 'swap'` to all remaining fonts (prevents invisible text during font load).

**SEO Impact:** Reduces Time-to-First-Byte and LCP. Google's Core Web Vitals score will improve, directly improving search ranking.

---

### Fix 1C: Verify og:image Asset + Explicit Canonical Tags
**Problem:** `/og-image.jpg` is referenced but may not exist. Missing canonical tags risk duplicate content penalties.

**Files to Modify:**
- `src/app/products/[slug]/page.tsx` — Add `alternates.canonical`
- `src/app/collections/[category]/page.tsx` — Add canonical
- `src/app/layout.tsx` — Confirm OG image path
- `/public/og-image.jpg` — Create/verify this file exists (1200x630px)

**Code change (minimal, per product):**
```ts
// In generateMetadata:
alternates: {
  canonical: `https://amxsigns.com/products/${product.slug}`,
},
```

**SEO Impact:** Prevents Google from splitting link equity across duplicate URL variations (with/without trailing slash, www vs non-www).

---

## Phase 2 — Programmatic Content Engine (Highest Long-Term Impact)
**Why:** This is what separates an 85/100 from a 62/100. Google needs to see you as a **topical authority** on neon signs, not just a product catalog.

### Fix 2A: Blog / Content Hub
**The single biggest SEO gap vs. Neon Attack.**

**Files to Create:**
- `src/app/blog/page.tsx` — Blog listing page
- `src/app/blog/[slug]/page.tsx` — Individual article page with `Article` JSON-LD schema
- `src/lib/posts.ts` — Data layer (can be MDX files or Supabase table)
- `src/app/blog/[slug]/layout.tsx` — Article-specific metadata

**Article Strategy (3 articles to start, targeting different keyword clusters):**

| Slug | Target Keyword | Monthly Searches (Est.) |
| :--- | :--- | :--- |
| `/blog/neon-signs-for-gaming-room-india` | "gaming room neon signs India" | High |
| `/blog/how-to-choose-neon-sign-home-decor` | "how to choose neon sign" | Medium |
| `/blog/f1-neon-signs-circuit-wall-art` | "F1 neon signs" | Niche, but zero competition |

**Schema per article:** `Article`, `Author`, `DatePublished`, `BreadcrumbList`

**Internal Linking Rule:** Every article must link to at least 3 product pages using descriptive anchor text (e.g., `<a href="/products/silverstone-f1-circuit-neon-sign">Silverstone Circuit Neon</a>`).

**SEO Impact:** Builds topical authority. Google will start trusting your domain for broader neon-related queries, which lifts ALL product page rankings.

---

### Fix 2B: Category Page Content Injection
**Problem:** `/collections/cars`, `/collections/gaming` etc. are thin pages — just a product grid. Google treats these as low-value.

**Files to Modify:** `src/app/collections/[category]/page.tsx` (or wherever the category page lives)

**Strategy:** Create a `categoryContent` map with a 100-150 word intro paragraph and H1/H2 for each of the 8 categories.

```ts
const categoryContent = {
  'cars': {
    h1: 'Car & Automotive Neon Signs',
    h2: 'Handcrafted LED Art for Garages & Showrooms',
    intro: 'Our automotive neon collection features silhouettes of iconic cars...',
    keywords: ['car neon sign', 'garage decor', 'BMW neon sign India']
  },
  'gaming': {
    h1: 'Gaming Neon Signs India',
    h2: 'Level Up Your Setup with Custom LED Neon',
    intro: 'Transform your gaming room with ambient LED neon...',
    keywords: ['gaming room neon sign', 'PS5 neon sign', 'gaming setup India']
  },
  // ... all 8 categories
}
```

**SEO Impact:** Category pages become content-rich landing pages that rank for broad category keywords (e.g., "gaming neon signs India"), not just product-specific terms.

---

## Phase 3 — Schema Completion
**Why:** Schema signals are the final layer of "telling Google exactly what you are."

### Fix 3A: `Organization` + `WebSite` Schema on Homepage
**Files to Modify:** `src/app/page.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AMX Signs",
  "url": "https://amxsigns.com",
  "logo": "https://amxsigns.com/logo.png",
  "sameAs": ["https://instagram.com/amxsigns", "https://wa.me/91XXXXXXXXXX"],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "English"
  }
}
```

Also add `WebSite` schema with a `SearchAction` to enable the Google **Sitelinks Search Box** — a search bar appears directly in your Google result.

```json
{
  "@type": "WebSite",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://amxsigns.com/collections?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**SEO Impact:** Google may display your brand's sitelinks and search box directly in results — massive brand real estate.

---

### Fix 3B: `ItemList` Schema on Collection Pages
**Files to Modify:** `src/app/collections/[category]/page.tsx`

Wrap the product grid in `ItemList` JSON-LD. This tells Google this page is a curated list of products, which can trigger carousel-style rich results.

```json
{
  "@type": "ItemList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "url": "/products/bmw-m4-silhouette-neon-sign" },
    { "@type": "ListItem", "position": 2, "url": "/products/..." }
  ]
}
```

---

### Fix 3C: `BreadcrumbList` JSON-LD on ALL pages (not just product pages)
Currently only product pages have breadcrumb schema. Category pages and city pages should also have it.

---

## Phase 4 — Internal Linking Architecture
**Why:** Internal links pass "link equity" between pages. Currently, there is no deliberate linking strategy.

### Fix 4A: Related Products — Keyword Anchor Text
**Files to Modify:** `src/app/products/[slug]/ProductDetailClient.tsx`

The "You May Also Like" section currently uses `item.title` as the link text. This is good, but we can add a `title` attribute with richer context:
```tsx
title={`${item.title} ${item.category} Neon Sign — View Details`}
```

### Fix 4B: Footer Category Links
**Files to Modify:** `src/components/Footer.tsx`

The footer should contain links to all 8 category pages using descriptive anchor text:
- `Gaming Neon Signs` → `/collections/gaming`
- `Car Neon Signs` → `/collections/cars`
- `Cafe & Restaurant Neon Signs` → `/collections/cafe`

**SEO Impact:** Every product page will pass link equity up to category pages via footer. Category pages become stronger and rank for broader terms.

### Fix 4C: Blog → Product Internal Links
As mentioned in Phase 2A, every blog article must link to 3+ relevant products with descriptive anchor text. This is the most powerful internal link strategy because it connects informational content to transactional pages.

---

## Phase 5 — Advanced Signals (Polish)

### Fix 5A: `ImageObject` Schema on Product Images
Explicitly declare your product images as `ImageObject` in the product schema. This helps Google Images rank your photos for visual searches.

```json
{
  "@type": "ImageObject",
  "url": "https://amxsigns.com/images/bmw-m4-neon.jpg",
  "width": 1200,
  "height": 1200,
  "caption": "BMW M4 G82 LED Neon Wall Sign - Handcrafted by AMX Signs"
}
```

### Fix 5B: `VideoObject` Schema (Future-Proofing)
If you ever add product videos (Instagram reels, unboxing clips), wrap them in `VideoObject` schema. Google surfaces videos in search results separately from web results — doubling your SERP real estate.

### Fix 5C: `next/image` Optimization Audit
Ensure every `<Image>` component has:
- Correct `sizes` attribute (currently missing on some related-product images)
- `priority` only on the hero/main product image (not all images)
- `loading="lazy"` is the default and is correct for below-fold images

### Fix 5D: Add `hreflang` if targeting multiple languages
If you plan to add Hindi content, add `hreflang="hi"` alternates. This is a future-proofing signal.

---

## Honest Score Projection

| Phase | Points Gained | Cumulative Score |
| :--- | :---: | :---: |
| **Baseline (current)** | — | 62/100 |
| Phase 1: Critical Bug Fixes | +8 | 70/100 |
| Phase 2: Content Engine (Blog + Categories) | +10 | 80/100 |
| Phase 3: Schema Completion | +3 | 83/100 |
| Phase 4: Internal Linking | +2 | 85/100 |
| Phase 5: Advanced Polish | +2 | 87/100 |
| **Off-page: Real Reviews (not code)** | +7 | 94/100 |
| **Off-page: Backlinks / Press (not code)** | +6 | 100/100 |

> [!WARNING]
> The last 13 points require real-world action: customer reviews and press backlinks. No amount of code will replace them. **87/100 is the honest codebase ceiling.**

---

## Execution Order (Recommended)

```
Week 1:  Phase 1 (Bug Fixes — critical, fast)
Week 2:  Phase 2A (Blog structure + 3 articles)
Week 3:  Phase 2B (Category page content)
Week 4:  Phase 3 (Schema completion)
Week 5:  Phase 4 (Internal linking)
Week 6:  Phase 5 (Polish)
Ongoing: Collect real reviews → inject into DB → AggregateRating schema fires automatically
```

---

## Files Involved (Complete Footprint)

| File | Action | Phase |
| :--- | :--- | :--- |
| `src/app/layout.tsx` | Reduce fonts to 3 core; move customizer fonts | 1B |
| `src/app/products/[slug]/page.tsx` | Add explicit canonical tag | 1C |
| `src/app/locations/[city]/page.tsx` | **Create** — city landing page | 1A |
| `src/app/blog/page.tsx` | **Create** — blog listing | 2A |
| `src/app/blog/[slug]/page.tsx` | **Create** — article template | 2A |
| `src/lib/posts.ts` | **Create** — content data layer | 2A |
| `src/app/collections/[category]/page.tsx` | Inject category content map | 2B |
| `src/app/page.tsx` | Add Organization + WebSite schema | 3A |
| `src/components/Footer.tsx` | Add keyword-rich category links | 4B |
| `/public/og-image.jpg` | **Create** — 1200x630px OG image | 1C |
