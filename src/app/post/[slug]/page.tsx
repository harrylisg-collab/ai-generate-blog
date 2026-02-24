import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MarkdownContent } from "@/components/MarkdownContent";
import { ShareButton } from "@/components/ShareButton";
import { TagList } from "@/components/TagList";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | AI Generate Blog System`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const readingTime = Math.ceil(post.content.split(/\s+/).length / 200);
  const siteUrl = process.env.NEXTAUTH_URL || 'https://example.com';
  const postUrl = `${siteUrl}/post/${post.slug}`;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || undefined,
    "datePublished": post.created_at,
    "dateModified": post.updated_at,
    "author": {
      "@type": "Person",
      "name": "Admin"
    },
    "url": postUrl,
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <article>
          <Link 
            href="/"
            style={{ 
              display: 'inline-block', 
              marginBottom: '2rem',
              color: 'var(--color-secondary)',
              fontSize: '0.9rem'
            }}
          >
            ← Back to all posts
          </Link>
          
          <header style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              {post.title}
            </h1>
            <div style={{ color: 'var(--color-secondary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span>· {readingTime} min read</span>
              <ShareButton title={post.title} url={postUrl} />
            </div>
            {post.tags && post.tags.length > 0 && <TagList tags={post.tags} />}
          </header>

          <div className="markdown-content" style={{ lineHeight: 1.8, paddingBottom: '2rem' }}>
            <MarkdownContent content={post.content} />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
