import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import StructuredData from '@/components/StructuredData';
import { absoluteUrl, getOrganizationSchema, VI_SEO_KEYWORDS } from '@/lib/seo';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maisonlac.vn'),
  title: {
    default: 'MAISON RỒNG — Trang Sức & Phụ Kiện Cao Cấp',
    template: '%s — MAISON RỒNG',
  },
  description:
    'Thương hiệu xa xỉ Pháp-Việt — trang sức, phụ kiện và chăn ga cao cấp. Khám phá L\'héritage du Dragon từ Paris 1928 đến Hà Nội.',
  keywords: [...VI_SEO_KEYWORDS],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'MAISON RỒNG',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'MAISON RỒNG' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    languages: {
      vi: absoluteUrl('/vi'),
      fr: absoluteUrl('/fr'),
      en: absoluteUrl('/en'),
      ko: absoluteUrl('/ko'),
      ja: absoluteUrl('/ja'),
      zh: absoluteUrl('/zh'),
      'x-default': absoluteUrl('/vi'),
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-brand-black font-sans antialiased">
        <StructuredData data={getOrganizationSchema()} />
        {children}
      </body>
    </html>
  );
}
