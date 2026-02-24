import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { Header } from "@/components/Header";

export const revalidate = 0;

export default async function AdminDashboard() {
  const posts = await getAllPosts();

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

        <main style={{ flex: 1, marginLeft: '250px', padding: '2rem' }}>
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
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }} className={post.published ? 'badge-published' : 'badge-draft'}>{post.published ? 'Published' : 'Draft'}</span>
                    </td>
                    <td style={{ padding: '1rem 0', color: 'var(--color-secondary)', fontSize: '0.9rem' }}>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                      <Link href={`/admin/edit/${post.id}`} style={{ marginRight: '1rem', color: 'var(--color-secondary)', fontSize: '0.9rem' }}>Edit</Link>
                      {post.published && <Link href={`/post/${post.slug}`} target="_blank" style={{ color: 'var(--color-secondary)', fontSize: '0.9rem' }}>View</Link>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
}
