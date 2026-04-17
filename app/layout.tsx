import type { Metadata, Viewport } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solimouv.fr'

export const metadata: Metadata = {
  title: {
    default: 'Solimouv\' — Festival Up Sport!',
    template: '%s | Solimouv\'',
  },
  description:
    'Solimouv\' est le festival annuel de l\'association Up Sport! à Paris — sport, culture et inclusion pour tous : familles, jeunes, seniors, personnes réfugiées, communauté LGBTQIA+, personnes en situation de handicap.',
  keywords: ['festival', 'sport', 'inclusion', 'Paris', 'Up Sport', 'Solimouv', 'handicap', 'LGBTQIA+', 'réfugiés', 'santé'],
  authors: [{ name: 'Up Sport!' }],
  creator: 'Up Sport!',
  publisher: 'Up Sport!',
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'Solimouv\'',
    title: 'Solimouv\' — Festival Up Sport!',
    description:
      'Festival annuel sport & inclusion à Paris — pour tous, sans exception.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Solimouv\' Festival Up Sport!',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solimouv\' — Festival Up Sport!',
    description: 'Festival annuel sport & inclusion à Paris — pour tous, sans exception.',
    images: ['/og-image.png'],
    creator: '@upsport',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#E84C1D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Up Sport!',
              url: siteUrl,
              description: 'Association sportive parisienne pour l\'inclusion et la diversité',
              event: {
                '@type': 'Event',
                name: 'Solimouv\'',
                description: 'Festival annuel sport & inclusion',
                organizer: { '@type': 'Organization', name: 'Up Sport!' },
                location: { '@type': 'Place', name: 'Paris, France' },
              },
            }),
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        <ServiceWorkerRegistration />
        <Nav />
        <main id="main-content">{children}</main>
        <Footer />
        <PWAInstallPrompt />
      </body>
    </html>
  )
}
