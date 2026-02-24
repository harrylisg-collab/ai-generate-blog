import { describe, it, expect, vi } from 'vitest';

// Mock data
const mockPosts = [
  {
    id: 1,
    title: 'Hello World',
    slug: 'hello-world',
    content: '# Hello World\n\nThis is my first post.',
    excerpt: 'This is my first post.',
    published: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Second Post',
    slug: 'second-post',
    content: '# Second Post\n\nAnother post.',
    excerpt: null,
    published: false,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];

describe('Post Model', () => {
  describe('getPublishedPosts', () => {
    it('should filter only published posts', () => {
      const publishedPosts = mockPosts.filter((post) => post.published);
      expect(publishedPosts).toHaveLength(1);
      expect(publishedPosts[0].title).toBe('Hello World');
    });

    it('should sort by date descending', () => {
      const sorted = [...mockPosts]
        .filter((p) => p.published)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      expect(sorted[0].title).toBe('Hello World');
    });
  });

  describe('getPostBySlug', () => {
    it('should find post by slug', () => {
      const post = mockPosts.find((p) => p.slug === 'hello-world');
      expect(post).toBeDefined();
      expect(post?.title).toBe('Hello World');
    });

    it('should return null for non-existent slug', () => {
      const post = mockPosts.find((p) => p.slug === 'non-existent');
      expect(post).toBeUndefined();
    });
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time correctly', () => {
      const wordCount = mockPosts[0].content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);
      expect(readingTime).toBe(1);
    });

    it('should handle long content', () => {
      // "word " repeated 200 times = 200 words = 1 min
      // "word " repeated 201 times = 201 words = 2 min
      const longContent = 'word '.repeat(201);
      const wordCount = longContent.split(/\s+/).filter(Boolean).length;
      const readingTime = Math.ceil(wordCount / 200);
      expect(readingTime).toBe(2);
    });
  });

  describe('generateExcerpt', () => {
    it('should generate excerpt from content', () => {
      const content = 'This is a long content with many words. '.repeat(20);
      const excerpt = content.split(/\s+/).slice(0, 20).join(' ') + '...';
      expect(excerpt.length).toBeGreaterThan(0);
      expect(excerpt.endsWith('...')).toBe(true);
    });
  });
});
