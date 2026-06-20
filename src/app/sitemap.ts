import type { MetadataRoute } from 'next';
import { ALL_PRODUCTS } from '@/lib/products';
import { SITE_URL, SITEMAP_PATHS, buildLanguageAlternates } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const { path, priority } of SITEMAP_PATHS) {
    entries.push({
      url: `${SITE_URL}/vi${path}`,
      lastModified,
      changeFrequency: 'weekly',
      priority,
      alternates: {
        languages: buildLanguageAlternates(path),
      },
    });
  }

  for (const product of ALL_PRODUCTS) {
    const path = `/products/${product.id}`;
    entries.push({
      url: `${SITE_URL}/vi${path}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: buildLanguageAlternates(path),
      },
    });
  }

  return entries;
}
