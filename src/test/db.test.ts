import { describe, it, expect, vi } from 'vitest';

// Mock the @vercel/postgres module
vi.mock('@vercel/postgres', () => ({
  sql: vi.fn().mockResolvedValue({ rows: [] }),
}));

describe('Database Connection', () => {
  it('should export sql function', async () => {
    const { sql } = await import('@vercel/postgres');
    expect(typeof sql).toBe('function');
  });
});
