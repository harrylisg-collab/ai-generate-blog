import Link from "next/link";
import { getPostsByTag } from "@/lib/posts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const dynamic = 'force-dynamic';

interface Props {
  params: { tag: string };
}

export default async function TagPage({ params }: Props) {
  const decodedTag = decodeURIComponent(params.tag);
  const posts = await getPostsByTag(decodedTag);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '2rem' }}>
          Posts tagged "{decodedTag}"
        </h1>

        {posts.length === 0 ? (
          <p style={{ color: 'var(--color-secondary)' }}>No posts found with this tag.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '4rem' }}>
            {posts.map((post) => (
              <article key={post.id}>
                <Link 
                  href={`/post/${post.slug}`}
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                    {post.title}
                  </h2>
                </Link>
                <div style={{ color: 'var(--color-secondary)', fontSize: '0.9rem' }}>
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                {post.excerpt && (
                  <p style={{ color: 'var(--color-secondary)', lineHeight: 1.6, marginTop: '0.5rem' }}>
                    {post.excerpt}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        <Link href="/" style={{ color: 'var(--color-secondary)' }}>
          ← Back to all posts
        </Link>
      </main>
      <Footer />
    </div>
  );
}
