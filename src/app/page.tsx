import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TagList } from "@/components/TagList";

export const revalidate = 0;

export default async function Home() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container">
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-secondary)' }}>
            <p>No posts yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '2rem' }}>
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
                  <span> · {post.author || 'Admin'}</span>
                  {post.excerpt && (
                    <span> · {Math.ceil(post.excerpt.split(/\s+/).length / 200)} min read</span>
                  )}
                </div>
                {post.excerpt && (
                  <p style={{ color: 'var(--color-secondary)', lineHeight: 1.6, marginTop: '0.5rem' }}>
                    {post.excerpt}
                  </p>
                )}
                {post.tags && post.tags.length > 0 && <TagList tags={post.tags} />}
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
