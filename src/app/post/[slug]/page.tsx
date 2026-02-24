import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug } from "@/lib/posts";
import { Header } from "@/components/Header";
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

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container">
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
            <h1 
              style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '2.5rem',
                marginBottom: '0.75rem',
                lineHeight: 1.2
              }}
            >
              {post.title}
            </h1>
            <div style={{ 
              color: 'var(--color-secondary)', 
              fontSize: '0.95rem' 
            }}>
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              {" · "}
              {readingTime} min read
            </div>
          </header>

          <div 
            className="markdown-content"
            style={{ 
              lineHeight: 1.8,
              paddingBottom: '4rem'
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>

      <footer className="container" style={{ 
        borderTop: '1px solid var(--color-border)', 
        paddingTop: '2rem',
        paddingBottom: '2rem',
        color: 'var(--color-secondary)',
        fontSize: '0.875rem'
      }}>
        <p>© {new Date().getFullYear()} AI Generate Blog System. All rights reserved.</p>
      </footer>
    </div>
  );
}
