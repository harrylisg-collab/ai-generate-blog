import { getPublishedPosts } from "@/lib/posts";

export const dynamic = 'force-dynamic';

export async function GET() {
  const siteUrl = process.env.NEXTAUTH_URL || 'https://example.com';
  
  try {
    const posts = await getPublishedPosts();
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${posts.map(post => `
  <url>
    <loc>${siteUrl}/post/${post.slug}</loc>
    <lastmod>${new Date(post.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    return new Response('<?xml version="1.0"?><sitemapindex></sitemapindex>', {
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}
