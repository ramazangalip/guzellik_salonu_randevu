import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuraProvider } from '@/context/AuraContext';
import PwaRegister from '@/components/PwaRegister';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1C1917',
};

export const metadata: Metadata = {
  title: 'Aura Estetik & Güzellik Merkezi | Nişantaşı Online Randevu Kataloğu',
  description: 'Lüks klinik estetiği, Cilt Bakımı, Lazer Epilasyon, Bölgesel İncelme ve Kalıcı Makyaj hizmetleri. Anında online randevunuzu oluşturun.',
  keywords: ['Güzellik Salonu', 'Aura Estetik', 'Hydrafacial', 'Lazer Epilasyon', 'Nişantaşı Güzellik Merkezi', 'Randevu Al'],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/gemini-svg.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/gemini-svg.svg', type: 'image/svg+xml' }
    ],
  },
  appleWebApp: {
    title: 'Aura Estetik',
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  applicationName: 'Aura Estetik',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${jakarta.variable} antialiased h-full`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Aura Estetik" />
        <link rel="icon" href="/gemini-svg.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/gemini-svg.svg" />
      </head>
      <body className="min-h-full bg-[#FAF8F5] text-stone-900 font-sans">
        <AuraProvider>
          <PwaRegister />
          {children}
        </AuraProvider>
      </body>
    </html>
  );
}
