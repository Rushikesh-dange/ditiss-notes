import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/login-rushi/', '/api/'],
    },
    sitemap: 'https://blog.rushikeshdange.online/sitemap.xml',
  }
}
