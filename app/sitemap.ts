import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solimouv.fr'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: '/', priority: 1, changeFrequency: 'weekly' as const },
    { url: '/programme', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/sport-matching', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/associations', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/a-propos', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.5, changeFrequency: 'yearly' as const },
  ]

  return staticPages.map(({ url, priority, changeFrequency }) => ({
    url: `${siteUrl}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
