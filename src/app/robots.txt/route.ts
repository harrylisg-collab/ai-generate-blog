import { NextResponse } from "next/server";

export function GET() {
  const siteUrl = process.env.NEXTAUTH_URL || 'https://example.com';
  
  const robots = `# Robots.txt for AI Generate Blog System

User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
