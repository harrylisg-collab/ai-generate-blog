import { query } from './db';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export async function getPublishedPosts(): Promise<Post[]> {
  const result = await query(
    'SELECT * FROM posts WHERE published = true ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const result = await query('SELECT * FROM posts WHERE slug = $1', [slug]);
  return result.rows[0] || null;
}

export async function getAllPosts(): Promise<Post[]> {
  const result = await query('SELECT * FROM posts ORDER BY created_at DESC');
  return result.rows;
}

export async function createPost(
  title: string,
  content: string,
  slug: string,
  excerpt: string | null = null,
  published: boolean = false
): Promise<Post> {
  const result = await query(
    'INSERT INTO posts (title, content, slug, excerpt, published) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, content, slug, excerpt, published]
  );
  return result.rows[0];
}

export async function updatePost(
  id: number,
  title: string,
  content: string,
  slug: string,
  excerpt: string | null = null,
  published: boolean = false
): Promise<Post> {
  const result = await query(
    `UPDATE posts 
     SET title = $1, content = $2, slug = $3, excerpt = $4, published = $5, updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING *`,
    [title, content, slug, excerpt, published, id]
  );
  return result.rows[0];
}

export async function deletePost(id: number): Promise<void> {
  await query('DELETE FROM posts WHERE id = $1', [id]);
}

export async function getPostById(id: number): Promise<Post | null> {
  const result = await query('SELECT * FROM posts WHERE id = $1', [id]);
  return result.rows[0] || null;
}
