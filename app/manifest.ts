import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Solimouv' — Festival Up Sport!",
    short_name: "Solimouv'",
    description: 'Festival annuel sport & inclusion à Paris — pour tous, sans exception.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFBF7',
    theme_color: '#E84C1D',
    orientation: 'portrait',
    lang: 'fr',
    categories: ['sports', 'lifestyle', 'social'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      {
        name: 'Programme',
        url: '/programme',
        description: 'Voir le programme du festival',
      },
      {
        name: 'Sport Matching',
        url: '/sport-matching',
        description: 'Trouver ton sport idéal',
      },
    ],
  }
}
