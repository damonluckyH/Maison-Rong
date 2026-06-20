import type { Metadata } from 'next';
import type { Product } from './products';
import { locales, type Locale } from '@/i18n/config';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maisonlac.vn';

export const VI_SEO_KEYWORDS = [
  'trang sức cao cấp',
  'nhẫn vàng 24k',
  'vòng tay phong thủy',
  'quà tặng cao cấp',
  'đồng hồ xa xỉ',
  'báo cáo ngũ hành',
  'trang sức phong thủy',
  'chăn ga cao cấp',
  'gia huy gia tộc',
  'thương hiệu Pháp',
] as const;

const OG_LOCALE_MAP: Record<Locale, string> = {
  vi: 'vi_VN',
  fr: 'fr_FR',
  en: 'en_US',
  ko: 'ko_KR',
  ja: 'ja_JP',
  zh: 'zh_CN',
};

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function buildLanguageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {
    'x-default': absoluteUrl(`/vi${path}`),
  };
  for (const locale of locales) {
    languages[locale] = absoluteUrl(`/${locale}${path}`);
  }
  return languages;
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = absoluteUrl(`/${locale}${path}`);

  return {
    title,
    description,
    keywords: [...VI_SEO_KEYWORDS],
    alternates: {
      canonical: url,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'MAISON RỒNG',
      locale: OG_LOCALE_MAP[locale as Locale] ?? 'vi_VN',
      images: [{ url: absoluteUrl('/og-image.jpg'), width: 1200, height: 630, alt: 'MAISON RỒNG' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl('/og-image.jpg')],
    },
  };
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MAISON RỒNG',
    url: SITE_URL,
    logo: absoluteUrl('/logo.png'),
    description:
      'Thương hiệu xa xỉ Pháp-Việt — trang sức, phụ kiện và chăn ga cao cấp, kết hợp nghệ thuật thủ công Việt Nam và thiết kế Pháp từ năm 1928.',
    foundingDate: '1928',
    founder: {
      '@type': 'Person',
      name: 'Pierre Moreau',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hà Nội',
      addressCountry: 'VN',
    },
  };
}

export function getProductSchema(product: Product, locale: string) {
  const name = product.name[locale] ?? product.name.vi;
  const description = product.description[locale] ?? product.description.vi;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: product.images.map((img) => absoluteUrl(img)),
    brand: {
      '@type': 'Brand',
      name: 'MAISON RỒNG',
    },
    offers: {
      '@type': 'Offer',
      price: String(product.price),
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/${locale}/products/${product.id}`),
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function getBreadcrumbSchema(locale: string, items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(`/${locale}${item.path}`),
    })),
  };
}

export const SITEMAP_PATHS = [
  { path: '', priority: 1.0 },
  { path: '/story', priority: 0.9 },
  { path: '/register', priority: 0.7 },
  { path: '/login', priority: 0.6 },
  { path: '/cart', priority: 0.5 },
  { path: '/checkout', priority: 0.5 },
  { path: '/member', priority: 0.6 },
  { path: '/member/bazi-report', priority: 0.7 },
  { path: '/products/bedding/customize', priority: 0.8 },
] as const;
