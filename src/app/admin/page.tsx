// Server-side data fetching
import Link from "next/link";

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
    const { query } = await import('@/lib/db');
    const result = await query('SELECT id, title, slug, excerpt, published, created_at FROM posts ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Error fetching posts:', error);
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

  return <AdminClient posts={posts} subscribers={subscribers} />;
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

// Client component - imported dynamically
import AdminClient from './AdminClient';
