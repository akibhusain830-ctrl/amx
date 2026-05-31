import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/products';
import { CITIES } from '@/lib/cities';
import { getPosts } from '@/lib/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://amxsigns.com'; // Replace with actual production URL
  
  // Fetch all products to include in sitemap
  const products = await getProducts();
  
  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.created_at || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Fetch all blog posts to include in sitemap
  const posts = getPosts();
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const categories = [
    'cafe', 'aesthetic', 'love', 'wings', 'gaming', 
    'pop-culture', 'cars', 'under-4000'
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/collections/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const cityEntries: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${baseUrl}/locations/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/business`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...categoryEntries,
    ...productEntries,
    ...cityEntries,
    ...blogEntries,
  ];
}
