import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
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
  title: 'MAISON LẠC — L\'héritage du Dragon',
  description: 'Nơi Vận Mệnh Gặp Gỡ Nghệ Thuật',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-brand-black font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
