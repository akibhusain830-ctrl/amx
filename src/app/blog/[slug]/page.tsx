import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPostBySlug, posts } from '@/lib/posts';
import { getProductBySlug } from '@/lib/products';
import { formatPrice } from '@/lib/utils';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Article Not Found | AMX Signs' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amxsigns.com';
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;

  return {
    title: `${post.title} | AMX Signs Guides`,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      images: [{
        url: post.imageUrl,
        width: 1200,
        height: 630,
        alt: `${post.title} guide`,
      }],
      publishedTime: new Date(post.date).toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amxsigns.com';
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;

  // Fetch related products data to populate recommendation cards
  const relatedProductsData = await Promise.all(
    post.relatedProducts.map(async (slug) => {
      try {
        return await getProductBySlug(slug);
      } catch {
        return null;
      }
    })
  );
  const activeRelatedProducts = relatedProductsData.filter(Boolean);

  // ── S-TIER ENTITY-FIRST ARTICLE SCHEMA ───────────────────────────────────
  const unifiedGraphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        "name": "AMX Signs",
        "url": siteUrl,
        "logo": `${siteUrl}/logo.png`
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        "url": siteUrl,
        "name": "AMX Signs",
        "publisher": { "@id": `${siteUrl}#organization` }
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": `${post.title} | AMX Signs Blog`,
        "isPartOf": { "@id": `${siteUrl}#website` }
      },
      {
        "@type": "BlogPosting",
        "@id": `${canonicalUrl}#article`,
        "mainEntityOfPage": `${canonicalUrl}#webpage`,
        "headline": post.title,
        "description": post.description,
        "image": post.imageUrl,
        "datePublished": new Date(post.date).toISOString(),
        "dateModified": new Date(post.date).toISOString(),
        "author": {
          "@type": "Organization",
          "name": "AMX Signs Editorial Team",
          "url": siteUrl
        },
        "publisher": {
          "@id": `${siteUrl}#organization`
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-primary/30 selection:text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(unifiedGraphSchema) }} />
      <Header />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs font-mono text-text-muted uppercase tracking-widest">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li>/</li>
              <li className="text-white truncate max-w-[200px]">{post.title}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-[1fr_360px] gap-12">
            {/* Left Side: Article Content */}
            <article className="min-w-0">
              <header className="mb-10">
                <span className="text-xs font-mono text-primary uppercase tracking-[0.25em] mb-3 block">
                  {post.category} Guide
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-6">
                  {post.title}
                </h1>
                
                <div className="flex items-center gap-4 text-xs font-mono text-text-muted uppercase tracking-widest border-b border-white/10 pb-6">
                  <span>Published: {post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </header>

              {/* Main Banner Image */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/5 bg-surface mb-10">
                <Image 
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </div>

              {/* Article Content Rendered Safely */}
              <div 
                className="prose prose-invert max-w-none text-white/80 leading-relaxed text-sm md:text-base space-y-6 
                           prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-wide
                           prose-h2:text-xl prose-h2:md:text-2xl prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-3 prose-h2:mt-10
                           prose-h3:text-base prose-h3:md:text-lg prose-h3:mt-6
                           prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                           prose-hr:border-white/5 prose-hr:my-8"
              >
                {/* Fallback rendering of paragraph strings split by newlines if MDX compiler isn't built in */}
                {post.content.trim().split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-xl md:text-2xl font-black uppercase border-b border-white/5 pb-3 mt-10 mb-4">{paragraph.replace('## ', '')}</h2>;
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-base md:text-lg font-black uppercase mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
                  }
                  if (paragraph.startsWith('* ')) {
                    return (
                      <ul key={index} className="list-disc pl-6 space-y-2 mb-4">
                        {paragraph.split('\n').map((li, liIndex) => (
                          <li key={liIndex} className="text-white/80 text-sm md:text-base">{li.replace('* ', '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={index} className="list-disc pl-6 space-y-2 mb-4">
                        {paragraph.split('\n').map((li, liIndex) => (
                          <li key={liIndex} className="text-white/80 text-sm md:text-base">{li.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={index} className="text-white/80 leading-relaxed mb-4">{paragraph}</p>;
                })}
              </div>
            </article>

            {/* Right Side: Sticky Product Recommendation Widget */}
            <aside className="lg:self-start lg:sticky lg:top-28 space-y-6">
              <div className="rounded-2xl border border-white/5 bg-surface/70 p-6 backdrop-blur-md">
                <span className="text-primary font-mono text-[10px] uppercase tracking-[0.3em] mb-4 block">
                  Shop S-Tier Gear
                </span>
                <h3 className="text-base font-black uppercase tracking-tight mb-6">
                  Featured in this Guide
                </h3>

                <div className="space-y-5">
                  {activeRelatedProducts.map((prod) => {
                    if (!prod) return null;
                    return (
                      <div key={prod.id} className="flex gap-4 items-center group">
                        <Link 
                          href={`/products/${prod.slug}`}
                          className="relative aspect-square w-16 rounded-xl overflow-hidden bg-surface-dark border border-white/10 shrink-0"
                          title={`View ${prod.title}`}
                        >
                          {prod.image_url ? (
                            <Image 
                              src={prod.image_url}
                              alt={prod.title}
                              fill
                              className="object-cover group-hover:scale-102 transition-transform duration-300"
                              sizes="64px"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-surface flex items-center justify-center text-primary font-black text-xs">AMX</div>
                          )}
                        </Link>
                        
                        <div className="min-w-0">
                          <h4 className="text-xs font-black uppercase tracking-wide truncate group-hover:text-primary transition-colors">
                            <Link href={`/products/${prod.slug}`} title={prod.title}>{prod.title}</Link>
                          </h4>
                          <p className="text-xs font-mono text-primary font-bold mt-1">
                            {formatPrice(prod.price)}
                          </p>
                          <Link 
                            href={`/products/${prod.slug}`} 
                            className="inline-block text-[10px] font-mono font-black text-text-muted hover:text-white uppercase tracking-wider mt-1 transition-colors"
                          >
                            Explore Sign →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Local Trust Card */}
              <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-surface to-surface-dark p-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">AMX Shipping Guarantee</h4>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Every sign in this article is handcrafted in India, securely packed, and delivered to your doorstep in 3-8 days with a 1-year official warranty.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
