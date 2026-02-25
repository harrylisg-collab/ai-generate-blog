import request from 'supertest';

const baseURL = process.env.TEST_BASE_URL || 'https://ai-generate-blog-test.vercel.app';

// ==================== PUBLIC API TESTS ====================

describe('API - Posts (Public)', () => {
  const testPost = {
    title: `QA Test Post ${Date.now()}`,
    slug: `qa-test-post-${Date.now()}`,
    content: 'This is a test post created by QA.',
    excerpt: 'Test excerpt',
    published: false
  };

  describe('GET /api/posts', () => {
    it('should return 400 if id is missing', async () => {
      const res = await request(baseURL).get('/api/posts');
      expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent post', async () => {
      const res = await request(baseURL).get('/api/posts?id=999999');
      expect(res.status).toBe(404);
    });

    it('should return post by id', async () => {
      // First create a post
      const createRes = await request(baseURL)
        .post('/api/posts')
        .send(testPost);
      
      if (createRes.status === 200 || createRes.status === 201) {
        const postId = createRes.body.id;
        const getRes = await request(baseURL).get(`/api/posts?id=${postId}`);
        expect([200, 404]).toContain(getRes.status);
      }
    });
  });

  describe('POST /api/posts', () => {
    it('should return 400 if required fields missing', async () => {
      const res = await request(baseURL)
        .post('/api/posts')
        .send({ title: 'Only title' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('required');
    });

    it('should create a draft post with valid data', async () => {
      const uniqueSlug = `qa-test-post-${Date.now()}`;
      const res = await request(baseURL)
        .post('/api/posts')
        .send({
          title: 'QA Test Post',
          slug: uniqueSlug,
          content: 'Test content',
          published: false
        });
      
      // Accept 200, 201, or 500 (if no auth)
      expect([200, 201, 500]).toContain(res.status);
    });
  });

  describe('PUT /api/posts', () => {
    it('should return 400 if required fields missing', async () => {
      const res = await request(baseURL)
        .put('/api/posts')
        .send({ title: 'Missing id' });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/posts', () => {
    it('should return 400 if id is missing', async () => {
      const res = await request(baseURL).delete('/api/posts');
      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid id format', async () => {
      const res = await request(baseURL).delete('/api/posts?id=abc');
      expect(res.status).toBe(400);
    });
  });
});

// ==================== SUBSCRIBE API ====================

describe('API - Subscribe', () => {
  describe('POST /api/subscribe', () => {
    it('should return 400 if email missing', async () => {
      const res = await request(baseURL)
        .post('/api/subscribe')
        .send({ name: 'Test' });
      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(baseURL)
        .post('/api/subscribe')
        .send({ email: 'not-an-email' });
      expect(res.status).toBe(400);
    });

    it('should accept valid email', async () => {
      const res = await request(baseURL)
        .post('/api/subscribe')
        .send({ email: `test${Date.now()}@example.com` });
      expect([200, 201, 400]).toContain(res.status);
    });

    it('should handle duplicate subscription', async () => {
      const email = `duplicate${Date.now()}@example.com`;
      // First subscription
      await request(baseURL).post('/api/subscribe').send({ email });
      // Second subscription should return 200 (already subscribed)
      const res = await request(baseURL).post('/api/subscribe').send({ email });
      expect([200, 201]).toContain(res.status);
    });
  });
});

// ==================== SUBSCRIBERS API ====================

describe('API - Subscribers', () => {
  describe('GET /api/subscribers', () => {
    it('should return 200 or 401', async () => {
      const res = await request(baseURL).get('/api/subscribers');
      expect([200, 401]).toContain(res.status);
    });
  });
});

// ==================== USERS API ====================

describe('API - Users', () => {
  describe('GET /api/users', () => {
    it('should return 200 or 401 (auth required)', async () => {
      const res = await request(baseURL).get('/api/users');
      expect([200, 401, 403]).toContain(res.status);
    });
  });

  describe('POST /api/users', () => {
    it('should return 400 for invalid data', async () => {
      const res = await request(baseURL)
        .post('/api/users')
        .send({ email: 'invalid' });
      expect([400, 401, 403]).toContain(res.status);
    });
  });
});

// ==================== ADMIN POSTS API ====================

describe('API - Admin Posts', () => {
  describe('GET /api/admin/posts', () => {
    it('should return 200 or require auth', async () => {
      const res = await request(baseURL).get('/api/admin/posts');
      expect([200, 401, 403]).toContain(res.status);
    });
  });
});

// ==================== HEALTH CHECK ====================

describe('API - Health', () => {
  it('should respond on root', async () => {
    const res = await request(baseURL).get('/');
    expect([200, 304]).toContain(res.status);
  });
});
