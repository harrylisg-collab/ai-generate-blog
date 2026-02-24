import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Blog Public Pages', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/AI Generate Blog/);
  });

  test('blog posts list displays', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('search works', async ({ page }) => {
    await page.goto(`${BASE_URL}/search?q=test`);
    await expect(page.locator('h1')).toContainText('Search results');
  });

  test('rss feed exists', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/rss.xml`);
    expect(response?.status()).toBe(200);
  });

  test('sitemap exists', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/sitemap.xml`);
    expect(response?.status()).toBe(200);
  });

  test('robots.txt exists', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/robots.txt`);
    expect(response?.status()).toBe(200);
  });
});

test.describe('Login Flow', () => {
  test('login page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('login with valid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    // Should redirect to admin dashboard
    await page.waitForURL(`${BASE_URL}/admin`);
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid')).toBeVisible();
  });
});

test.describe('Admin - Article Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`);
  });

  test('admin dashboard loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await expect(page.locator('text=All Posts')).toBeVisible();
  });

  test('can navigate to new post page', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.click('text=+ New Post');
    await expect(page.locator('h1')).toContainText('New Post');
  });

  test('can create new post', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/new`);
    
    const timestamp = Date.now();
    await page.fill('input[value=""]', `Test Post ${timestamp}`);
    await page.fill('input[placeholder*="auto-generated"]', `test-post-${timestamp}`);
    await page.fill('input[placeholder*="Brief description"]', 'This is a test post');
    await page.fill('textarea', '# Test Content\n\nThis is a test post content.');
    await page.click('button[type="submit"]');
    
    // Should redirect to admin dashboard
    await page.waitForURL(`${BASE_URL}/admin`);
  });

  test('posts list displays', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    // Should show posts table or "No posts yet" message
    const hasTableOrMessage = await page.locator('table, text=No posts yet').isVisible();
    expect(hasTableOrMessage).toBe(true);
  });

  test('can navigate to subscribers tab', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.click('text=Subscribers');
    await expect(page.locator('h1')).toContainText('Subscribers');
  });
});

test.describe('Admin - User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`);
  });

  test('can navigate to users tab', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.click('text=Users');
    await expect(page.locator('h1')).toContainText('Users');
  });

  test('users list displays', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.click('text=Users');
    // Should show users table or "No users yet" message
    const hasTableOrMessage = await page.locator('table, text=No users yet').isVisible();
    expect(hasTableOrMessage).toBe(true);
  });
});
