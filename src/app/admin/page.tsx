import Link from "next/link";
import { Header } from "@/components/Header";

export const dynamic = 'force-dynamic';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  created_at: string;
}

interface Subscriber {
  id: number;
  email: string;
  created_at: string;
}

async function getPosts(): Promise<Post[]> {
  try {
    // Try direct DB query first
    const { query } = await import('@/lib/db');
    const result = await query('SELECT id, title, slug, excerpt, published, created_at FROM posts ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Error fetching posts from DB:', error);
    // Fallback: try API
    try {
      const siteUrl = process.env.NEXTAUTH_URL || 'https://ai-generate-blog.vercel.app';
      const res = await fetch(`${siteUrl}/api/admin/posts`, { cache: 'no-store' });
      if (res.ok) {
        return res.json();
      }
    } catch (apiError) {
      console.error('Error fetching posts from API:', apiError);
    }
    return [];
  }
}

async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const { query } = await import('@/lib/db');
    const result = await query('SELECT id, email, created_at FROM subscribers ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return [];
  }
}

export default async function AdminDashboard() {
  const posts = await getPosts();
  const subscribers = await getSubscribers();

  console.log('[Admin] Posts loaded:', posts.length);
  console.log('[Admin] Subscribers loaded:', subscribers.length);

  return (
    <AdminClient posts={posts} subscribers={subscribers} />
  );
}

function AdminHeader() {
  return (
    <header className="container" style={{ paddingTop: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
      <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600 }}>
        AI Generate Blog System
      </Link>
    </header>
  );
}

"use client";

import { useState } from "react";

interface ClientPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  created_at: string;
}

interface ClientSubscriber {
  id: number;
  email: string;
  created_at: string;
}

interface ClientProps {
  posts: ClientPost[];
  subscribers: ClientSubscriber[];
}

export default function AdminClient({ posts: initialPosts, subscribers: initialSubscribers }: ClientProps) {
  const [tab, setTab] = useState<"posts" | "subscribers">("posts");
  const [posts] = useState(initialPosts);
  const [subscribers] = useState(initialSubscribers);

  return (
    <div className="min-h-screen">
      <AdminHeader />
      <div style={{ display: 'flex' }}>
        <aside style={{ width: '250px', background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', padding: '1.5rem', position: 'fixed', height: '100vh' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '2rem' }}>Admin</h2>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => setTab("posts")}
              style={{ 
                padding: '0.5rem 0.75rem', 
                borderRadius: '4px', 
                background: tab === 'posts' ? 'var(--color-background)' : 'transparent',
                fontWeight: tab === 'posts' ? 500 : 400,
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                color: 'var(--color-text)'
              }}
            >
              Posts
            </button>
            <button 
              onClick={() => setTab("subscribers")}
              style={{ 
                padding: '0.5rem 0.75rem', 
                borderRadius: '4px', 
                background: tab === 'subscribers' ? 'var(--color-background)' : 'transparent',
                fontWeight: tab === 'subscribers' ? 500 : 400,
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                color: 'var(--color-text)'
              }}
            >
              Subscribers
            </button>
            <Link href="/admin/new" style={{ padding: '0.5rem 0.75rem', borderRadius: '4px', color: 'var(--color-secondary)' }}>
              + New Post
            </Link>
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <Link href="/" style={{ display: 'block', padding: '0.5rem 0.75rem', color: 'var(--color-secondary)', fontSize: '0.9rem' }}>← View Blog</Link>
          </div>
        </aside>

        <main style={{ flex: 1, marginLeft: '250px', padding: '2rem' }}>
          {tab === "posts" ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem' }}>All Posts</h1>
                <Link href="/admin/new" className="btn-primary">New Post</Link>
              </div>
              {posts.length === 0 ? (
                <p style={{ color: 'var(--color-secondary)' }}>No posts yet. <Link href="/admin/new" style={{ textDecoration: 'underline' }}>Create your first post</Link></p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem 0', fontWeight: 500 }}>Title</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem 0', fontWeight: 500 }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem 0', fontWeight: 500 }}>Date</th>
                      <th style={{ textAlign: 'right', padding: '0.75rem 0', fontWeight: 500 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '1rem 0' }}><Link href={`/admin/edit/${post.id}`} style={{ fontWeight: 500 }}>{post.title}</Link></td>
                        <td style={{ padding: '1rem 0' }}>
                          <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }} className={post.published ? 'badge-published' : 'badge-draft'}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0', color: 'var(--color-secondary)', fontSize: '0.9rem' }}>
                          {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                          <Link href={`/admin/edit/${post.id}`} style={{ marginRight: '1rem', color: 'var(--color-secondary)', fontSize: '0.9rem' }}>Edit</Link>
                          {post.published && <Link href={`/post/${post.slug}`} target="_blank" style={{ color: 'var(--color-secondary)', fontSize: '0.9rem' }}>View</Link>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          ) : (
            <>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '2rem' }}>Subscribers</h1>
              {subscribers.length === 0 ? (
                <p style={{ color: 'var(--color-secondary)' }}>No subscribers yet.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem 0', fontWeight: 500 }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem 0', fontWeight: 500 }}>Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub) => (
                      <tr key={sub.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '1rem 0' }}>{sub.email}</td>
                        <td style={{ padding: '1rem 0', color: 'var(--color-secondary)', fontSize: '0.9rem' }}>
                          {new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
