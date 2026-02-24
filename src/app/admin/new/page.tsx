"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-").trim();
}

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, author, content, excerpt, published }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create post");
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div style={{ display: 'flex' }}>
        <aside style={{ width: '250px', background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', padding: '1.5rem', position: 'fixed', height: '100vh' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '2rem' }}>Admin</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link href="/admin" style={{ padding: '0.5rem 0.75rem', borderRadius: '4px', color: 'var(--color-secondary)' }}>Posts</Link>
            <Link href="/admin/new" style={{ padding: '0.5rem 0.75rem', borderRadius: '4px', background: 'var(--color-background)', fontWeight: 500 }}>+ New Post</Link>
          </nav>
          <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <Link href="/" style={{ display: 'block', padding: '0.5rem 0.75rem', color: 'var(--color-secondary)', fontSize: '0.9rem' }}>← View Blog</Link>
          </div>
        </aside>

        <main style={{ flex: 1, marginLeft: '250px', padding: '2rem', maxWidth: 'calc(100% - 250px)' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '2rem' }}>New Post</h1>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Title</label>
              <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} required style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-surface)', color: 'var(--color-text)' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Slug</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-surface)', color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Author</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Admin" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-surface)', color: 'var(--color-text)' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Excerpt</label>
              <input type="text" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief description for SEO and previews" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-surface)', color: 'var(--color-text)' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Content (Markdown)</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={20} style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-surface)', color: 'var(--color-text)', fontFamily: 'var(--font-mono)', resize: 'vertical' }} />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                <span>Publish immediately</span>
              </label>
            </div>

            {error && <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save Post"}
              </button>
              <Link href="/admin" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', color: 'var(--color-secondary)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>Cancel</Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
