"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-").trim();
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author: string;
  published: boolean;
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      const { id } = await params;
      try {
        const res = await fetch(`/api/posts?id=${id}`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
        setTitle(data.title);
        setSlug(data.slug);
        setAuthor(data.author || "Admin");
        setContent(data.content);
        setExcerpt(data.excerpt || "");
        setPublished(data.published);
      } catch (err) {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [params]);

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
      const { id } = await params;
      const res = await fetch("/api/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: parseInt(id), title, slug, author, content, excerpt, published }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update post");
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    setDeleting(true);
    setError("");

    try {
      const { id } = await params;
      const res = await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', marginLeft: '250px' }}><p>Loading...</p></div>;
  if (!post) return <div style={{ padding: '2rem', marginLeft: '250px' }}><p>Post not found</p><Link href="/admin">Back to Admin</Link></div>;

  return (
    <div className="min-h-screen">
      <Header />
      <div style={{ display: 'flex' }}>
        <aside style={{ width: '250px', background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', padding: '1.5rem', position: 'fixed', height: '100vh' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '2rem' }}>Admin</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link href="/admin" style={{ padding: '0.5rem 0.75rem', borderRadius: '4px', background: 'var(--color-background)', fontWeight: 500 }}>Posts</Link>
            <Link href="/admin/new" style={{ padding: '0.5rem 0.75rem', borderRadius: '4px', color: 'var(--color-secondary)' }}>+ New Post</Link>
          </nav>
          <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <Link href="/" style={{ display: 'block', padding: '0.5rem 0.75rem', color: 'var(--color-secondary)', fontSize: '0.9rem' }}>← View Blog</Link>
          </div>
        </aside>

        <main style={{ flex: 1, marginLeft: '250px', padding: '2rem', maxWidth: 'calc(100% - 250px)' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '2rem' }}>Edit Post</h1>

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
              <input type="text" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-surface)', color: 'var(--color-text)' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Content (Markdown)</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={20} style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'var(--color-surface)', color: 'var(--color-text)', fontFamily: 'var(--font-mono)', resize: 'vertical' }} />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                <span>Published</span>
              </label>
            </div>

            {error && <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link href="/admin" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', color: 'var(--color-secondary)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>Cancel</Link>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
              <button type="button" onClick={handleDelete} disabled={deleting} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#dc2626', background: 'transparent', border: '1px solid #dc2626', borderRadius: '4px', cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.7 : 1 }}>
                {deleting ? "Deleting..." : "Delete Post"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
