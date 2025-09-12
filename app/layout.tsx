import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import ErrorBoundary from '@/components/ErrorBoundary';
import { errorHandler } from '@/lib/error-handler';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WeddingLK - Sri Lanka\'s Premier Wedding Planning Platform',
  description: 'Find the perfect vendors, venues, and services for your dream wedding in Sri Lanka. Connect with top photographers, caterers, venues, and wedding planners.',
  keywords: 'wedding planning, Sri Lanka, wedding vendors, wedding venues, photography, catering, wedding planning app',
  authors: [{ name: 'WeddingLK Team' }],
  creator: 'WeddingLK',
  publisher: 'WeddingLK',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://wedding-lk.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'si-LK': '/si',
      'ta-LK': '/ta',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wedding-lk.com',
    siteName: 'WeddingLK',
    title: 'WeddingLK - Sri Lanka\'s Premier Wedding Planning Platform',
    description: 'Find the perfect vendors, venues, and services for your dream wedding in Sri Lanka.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WeddingLK - Wedding Planning Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@weddinglk',
    creator: '@weddinglk',
    title: 'WeddingLK - Sri Lanka\'s Premier Wedding Planning Platform',
    description: 'Find the perfect vendors, venues, and services for your dream wedding in Sri Lanka.',
    images: ['/twitter-image.jpg'],
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
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'lifestyle',
  classification: 'Wedding Planning Platform',
  referrer: 'origin-when-cross-origin',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/safari-pinned-tab.svg',
        color: '#8B5CF6',
      },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'WeddingLK',
    startupImage: [
      {
        url: '/icons/apple-splash-2048x2732.png',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/icons/apple-splash-1668x2388.png',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/icons/apple-splash-1536x2048.png',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/icons/apple-splash-1125x2436.png',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/icons/apple-splash-1242x2688.png',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/icons/apple-splash-750x1334.png',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/icons/apple-splash-640x1136.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#8B5CF6',
    'msapplication-config': '/browserconfig.xml',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#8B5CF6' },
    { media: '(prefers-color-scheme: dark)', color: '#7C3AED' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="WeddingLK" />
        <meta name="application-name" content="WeddingLK" />
        <meta name="msapplication-TileColor" content="#8B5CF6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#8B5CF6" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#8B5CF6" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="msapplication-TileImage" content="/icons/mstile-144x144.png" />
        <meta name="msapplication-square70x70logo" content="/icons/mstile-70x70.png" />
        <meta name="msapplication-square150x150logo" content="/icons/mstile-150x150.png" />
        <meta name="msapplication-wide310x150logo" content="/icons/mstile-310x150.png" />
        <meta name="msapplication-square310x310logo" content="/icons/mstile-310x310.png" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // PWA Install Prompt
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                // Show install button or banner
                const installButton = document.getElementById('install-button');
                if (installButton) {
                  installButton.style.display = 'block';
                  installButton.addEventListener('click', () => {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                      if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                      }
                      deferredPrompt = null;
                    });
                  });
                }
              });

              // Service Worker Registration
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }

              // PWA Analytics
              window.addEventListener('appinstalled', (evt) => {
                console.log('PWA was installed');
                // Track PWA installation
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'pwa_install', {
                    event_category: 'engagement',
                    event_label: 'pwa_installed'
                  });
                }
              });

              // Handle PWA updates
              window.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'SKIP_WAITING') {
                  window.location.reload();
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}