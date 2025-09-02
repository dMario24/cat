import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        allow: '/api/og',
      },
    ],
    sitemap: 'https://dginori-cat-feeding.vercel.app/sitemap.xml',
  };
}
