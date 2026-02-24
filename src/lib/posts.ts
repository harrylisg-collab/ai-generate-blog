import { query as dbQuery } from './db';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  tags: string[];
  author: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export async function getPublishedPosts(): Promise<Post[]> {
  const result = await dbQuery(
    'SELECT * FROM posts WHERE published = true ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const result = await dbQuery('SELECT * FROM posts WHERE slug = $1', [slug]);
  return result.rows[0] || null;
}

export async function getAllPosts(): Promise<Post[]> {
  const result = await dbQuery('SELECT * FROM posts ORDER BY created_at DESC');
  return result.rows;
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const result = await dbQuery(
    'SELECT * FROM posts WHERE $1 = ANY(tags) AND published = true ORDER BY created_at DESC',
    [tag]
  );
  return result.rows;
}

export async function getAllTags(): Promise<string[]> {
  const result = await dbQuery('SELECT DISTINCT unnest(tags) as tag FROM posts WHERE published = true');
  return result.rows.map(row => row.tag);
}

export async function createPost(
  title: string,
  content: string,
  slug: string,
  excerpt: string | null = null,
  tags: string[] = [],
  author: string = 'Admin',
  published: boolean = false
): Promise<Post> {
  const result = await dbQuery(
    'INSERT INTO posts (title, content, slug, excerpt, tags, author, published) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [title, content, slug, excerpt, tags, author, published]
  );
  return result.rows[0];
}

export async function updatePost(
  id: number,
  title: string,
  content: string,
  slug: string,
  excerpt: string | null = null,
  tags: string[] = [],
  author: string = 'Admin',
  published: boolean = false
): Promise<Post> {
  const result = await dbQuery(
    `UPDATE posts 
     SET title = $1, content = $2, slug = $3, excerpt = $4, tags = $5, author = $6, published = $7, updated_at = CURRENT_TIMESTAMP
     WHERE id = $8
     RETURNING *`,
    [title, content, slug, excerpt, tags, author, published, id]
  );
  return result.rows[0];
}

export async function deletePost(id: number): Promise<void> {
  await dbQuery('DELETE FROM posts WHERE id = $1', [id]);
}

export async function getPostById(id: number): Promise<Post | null> {
  const result = await dbQuery('SELECT * FROM posts WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getAdjacentPosts(currentSlug: string): Promise<{ prev: Post | null; next: Post | null }> {
  const currentPost = await getPostBySlug(currentSlug);
  if (!currentPost) return { prev: null, next: null };

  // Get previous post (newer - created after current)
  const prevResult = await dbQuery(
    'SELECT * FROM posts WHERE published = true AND id != $1 AND created_at > $2 ORDER BY created_at ASC LIMIT 1',
    [currentPost.id, currentPost.created_at]
  );

  // Get next post (older - created before current)
  const nextResult = await dbQuery(
    'SELECT * FROM posts WHERE published = true AND id != $1 AND created_at < $2 ORDER BY created_at DESC LIMIT 1',
    [currentPost.id, currentPost.created_at]
  );

  return {
    prev: prevResult.rows[0] || null,
    next: nextResult.rows[0] || null,
  };
}

export async function searchPosts(query: string): Promise<Post[]> {
  const result = await dbQuery(
    `SELECT * FROM posts 
     WHERE published = true AND (
       title ILIKE $1 OR 
       content ILIKE $1 OR 
       excerpt ILIKE $1
     ) 
     ORDER BY created_at DESC`,
    [`%${query}%`]
  );
  return result.rows;
}
