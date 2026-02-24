import request from 'supertest';
import { GET } from '@/app/api/posts/route';
import { GET as GET_SUBSCRIBERS } from '@/app/api/subscribe/route';

describe('API Tests', () => {
  const baseURL = process.env.TEST_BASE_URL || 'http://localhost:3000';

  describe('GET /api/posts', () => {
    it('should return posts list', async () => {
      const res = await request(baseURL).get('/api/posts');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/subscribe', () => {
    it('should return subscribers list', async () => {
      const res = await request(baseURL).get('/api/subscribe');
      expect(res.status).toBe(200);
    });
  });
});
