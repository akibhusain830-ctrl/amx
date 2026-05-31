import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPosts } from '@/lib/posts';

export const metadata = {
  title: 'Inspirational Neon Setup & Styling Guides | AMX Signs Blog',
  description: 'Explore expert guides on custom gaming room styling, interior design with LED neon lights, F1 track collectibles, and DIY installation tips from AMX Signs.',
  alternates: {
    canonical: 'https://amxsigns.com/blog',
  },
};

export default function BlogListPage() {
  const posts = getPosts();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-primary/30 selection:text-primary">
      <Header />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header Section */}
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-3 block">
              Knowledge Hub
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              AMX Signs <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-mint font-sans italic">Guides</span>
            </h1>
            <p className="text-text-muted text-sm md:text-base leading-relaxed max-w-2xl">
              Discover design guides, unboxing details, and technical advice on transforming your space with handcrafted premium LED neon art.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article 
                key={post.slug} 
                className="group flex flex-col bg-surface border border-white/5 hover:border-primary/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(198,255,0,0.05)]"
              >
                {/* Image Wrap */}
                <div className="relative aspect-[16/10] w-full bg-surface-dark overflow-hidden">
                  <Image 
                    src={post.imageUrl}
                    alt={`${post.title} | AMX Signs Guide`}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider text-primary">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-[10px] font-mono text-text-muted uppercase tracking-widest mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-lg font-black uppercase tracking-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-text-muted text-xs leading-relaxed mb-6 line-clamp-3">
                    {post.description}
                  </p>

                  <div className="mt-auto">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-black uppercase tracking-widest text-primary hover:text-white transition-colors group/link"
                      title={`Read post: ${post.title}`}
                    >
                      Read Article 
                      <span className="group-hover/link:translate-x-1 transition-transform inline-block">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
