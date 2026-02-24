"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
}

interface Props {
  posts: Post[];
  subscribers: Subscriber[];
  initialUsers?: User[];
}

export default function AdminClient({ posts, subscribers, initialUsers = [] }: Props) {
  const [tab, setTab] = useState<"posts" | "subscribers" | "users">("posts");
  const [users, setUsers] = useState(initialUsers);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Load users when tab changes to users
  useEffect(() => {
    if (tab === "users" && users.length === 0) {
      setLoadingUsers(true);
      fetch('/api/users')
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error(err))
        .finally(() => setLoadingUsers(false));
    }
  }, [tab, users.length]);

  const renderContent = () => {
    switch (tab) {
      case "posts":
        return (
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
        );

      case "subscribers":
        return (
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
        );

      case "users":
        return (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem' }}>Users</h1>
              <button onClick={() => setTab("posts")} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                + Add User
              </button>
            </div>
            {loadingUsers ? (
              <p>Loading...</p>
            ) : users.length === 0 ? (
              <p style={{ color: 'var(--color-secondary)' }}>No users yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0', fontWeight: 500 }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0', fontWeight: 500 }}>Email</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0', fontWeight: 500 }}>Role</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0', fontWeight: 500 }}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem 0' }}>{user.name || '-'}</td>
                      <td style={{ padding: '1rem 0' }}>{user.email}</td>
                      <td style={{ padding: '1rem 0' }}>
                        <span style={{ 
                          display: 'inline-block',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                          background: user.role === 'admin' ? '#dcfce7' : user.role === 'editor' ? '#dbeafe' : '#f3f4f6',
                          color: user.role === 'admin' ? '#166534' : user.role === 'editor' ? '#1e40af' : '#6b7280'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0', color: 'var(--color-secondary)', fontSize: '0.9rem' }}>
                        {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <header className="container" style={{ paddingTop: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600 }}>
          AI Generate Blog System
        </Link>
      </header>
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
            <button 
              onClick={() => setTab("users")}
              style={{ 
                padding: '0.5rem 0.75rem', 
                borderRadius: '4px', 
                background: tab === 'users' ? 'var(--color-background)' : 'transparent',
                fontWeight: tab === 'users' ? 500 : 400,
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                color: 'var(--color-text)'
              }}
            >
              Users
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
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
