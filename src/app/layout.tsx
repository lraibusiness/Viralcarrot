import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import CookieConsent from '@/components/consent/CookieConsent';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'ViralCarrot - Smart Recipe Discovery Platform | AI Recipes & Ingredient Matching',
    template: '%s | ViralCarrot'
  },
  description: 'Discover amazing recipes with ViralCarrot. Get AI-generated recipes and popular recipes from the web with ingredient matching. Find what you can cook with your available ingredients.',
  keywords: [
    'recipe discovery',
    'smart cooking',
    'ingredient matching',
    'AI recipes',
    'popular recipes',
    'cooking platform',
    'recipe generator',
    'pantry wizard',
    'cooking app',
    'food recipes',
    'cooking tips',
    'meal planning',
    'recipe finder',
    'cooking assistant',
    'food discovery'
  ],
  authors: [{ name: 'ViralCarrot Team', url: 'https://viralcarrot.com' }],
  creator: 'ViralCarrot',
  publisher: 'ViralCarrot Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://viralcarrot.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ViralCarrot - Smart Recipe Discovery Platform',
    description: 'Discover amazing recipes with ViralCarrot. Get AI-generated recipes and popular recipes from the web with ingredient matching.',
    url: 'https://viralcarrot.com',
    siteName: 'ViralCarrot',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'ViralCarrot - Smart Recipe Discovery Platform',
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
    creator: '@viralcarrot',
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
  category: 'Food & Cooking',
  classification: 'Recipe Discovery Platform',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f59e0b' },
    { media: '(prefers-color-scheme: dark)', color: '#f59e0b' }
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#f59e0b',
    'msapplication-config': '/browserconfig.xml',
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
    url: 'https://viralcarrot.com',
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
      'Mobile Optimized',
      'Free to Use'
    ],
    author: {
      '@type': 'Organization',
      name: 'ViralCarrot Inc.',
      url: 'https://viralcarrot.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Recipe Street',
        addressLocality: 'Food City',
        addressRegion: 'FC',
        postalCode: '12345',
        addressCountry: 'US'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-123-4567',
        contactType: 'customer service',
        email: 'hello@viralcarrot.com'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'ViralCarrot Inc.',
      url: 'https://viralcarrot.com'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://viralcarrot.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    sameAs: [
      'https://www.facebook.com/viralcarrot',
      'https://www.instagram.com/viralcarrot',
      'https://www.twitter.com/viralcarrot'
    ]
  };

  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ViralCarrot Inc.',
    url: 'https://viralcarrot.com',
    logo: 'https://viralcarrot.com/logo.png',
    description: 'Smart recipe discovery platform with AI-generated recipes and ingredient matching',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Recipe Street',
      addressLocality: 'Food City',
      addressRegion: 'FC',
      postalCode: '12345',
      addressCountry: 'US'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      email: 'hello@viralcarrot.com',
      availableLanguage: 'English'
    },
    sameAs: [
      'https://www.facebook.com/viralcarrot',
      'https://www.instagram.com/viralcarrot',
      'https://www.twitter.com/viralcarrot'
    ]
  };

  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ViralCarrot',
    url: 'https://viralcarrot.com',
    description: 'Smart recipe discovery platform with AI-generated recipes and ingredient matching',
    publisher: {
      '@type': 'Organization',
      name: 'ViralCarrot Inc.'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://viralcarrot.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        
        {/* Search Engine Verification */}
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        <meta name="yandex-verification" content="your-yandex-verification-code" />
        <meta name="pinterest-site-verification" content="your-pinterest-verification-code" />
        
        {/* AdSense Compliance Meta Tags */}
        <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXX" />
        <meta name="google-adsense-platform-account" content="ca-host-pub-XXXXXXXXXX" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="rating" content="General" />
        <meta name="distribution" content="Global" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="39.8283;-98.5795" />
        <meta name="ICBM" content="39.8283, -98.5795" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* AdSense Content Policy Compliance */}
        <meta name="content-rating" content="General" />
        <meta name="audience" content="all" />
        <meta name="target-audience" content="cooking enthusiasts, food lovers, recipe seekers" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
