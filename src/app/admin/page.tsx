"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Subscriber {
  id: number;
  email: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"posts" | "subscribers">("posts");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  const loadSubscribers = async () => {
    if (subscribers.length > 0) return;
    setLoadingSubs(true);
    try {
      const res = await fetch("/api/subscribers");
      const data = await res.json();
      setSubscribers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubs(false);
    }
  };

  const handleTabChange = (newTab: "posts" | "subscribers") => {
    setTab(newTab);
    if (newTab === "subscribers") {
      loadSubscribers();
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div style={{ display: 'flex' }}>
        <aside style={{ width: '250px', background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', padding: '1.5rem', position: 'fixed', height: '100vh' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '2rem' }}>Admin</h2>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              onClick={() => handleTabChange("posts")}
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
              onClick={() => handleTabChange("subscribers")}
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
              <p style={{ color: 'var(--color-secondary)' }}>Posts content loaded from server component...</p>
            </>
          ) : (
            <>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '2rem' }}>Subscribers</h1>
              {loadingSubs ? (
                <p>Loading...</p>
              ) : subscribers.length === 0 ? (
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
                          {new Date(sub.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
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

function Header() {
  return (
    <header className="container" style={{ paddingTop: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
      <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600 }}>
        AI Generate Blog System
      </Link>
    </header>
  );
}
