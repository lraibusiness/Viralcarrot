import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ViralCarrot - Smart Recipe Discovery Platform',
  description: 'Discover amazing recipes with ViralCarrot. Get AI-generated recipes and popular recipes from the web with ingredient matching. Find what you can cook with your available ingredients.',
  keywords: 'recipe discovery, smart cooking, ingredient matching, AI recipes, popular recipes, cooking platform, recipe generator, pantry wizard',
  authors: [{ name: 'ViralCarrot Team' }],
  creator: 'ViralCarrot',
  publisher: 'ViralCarrot',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://viralcarrot.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ViralCarrot - Smart Recipe Discovery Platform',
    description: 'Discover amazing recipes with ViralCarrot. Get AI-generated recipes and popular recipes from the web with ingredient matching.',
    url: 'https://viralcarrot.vercel.app',
    siteName: 'ViralCarrot',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'ViralCarrot - Smart Recipe Discovery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ViralCarrot - Smart Recipe Discovery Platform',
    description: 'Discover amazing recipes with ViralCarrot. Get AI-generated recipes and popular recipes from the web with ingredient matching.',
    images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=630&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ViralCarrot',
    description: 'Smart recipe discovery platform with AI-generated recipes and ingredient matching',
    url: 'https://viralcarrot.vercel.app',
    applicationCategory: 'FoodApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'AI Recipe Generation',
      'Ingredient Matching',
      'Popular Recipe Discovery',
      'Pantry Wizard',
      'Smart Filtering',
    ],
    author: {
      '@type': 'Organization',
      name: 'ViralCarrot',
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
