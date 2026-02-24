import { test, expect } from '@playwright/test';

test.describe('Blog Regression Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AI Generate Blog/);
  });

  test('blog posts list displays', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('article')).toBeDefined();
  });

  test('search works', async ({ page }) => {
    await page.goto('/search?q=test');
    await expect(page.locator('h1')).toContainText('Search results');
  });

  test('rss feed exists', async ({ page }) => {
    const response = await page.goto('/rss.xml');
    expect(response?.status()).toBe(200);
  });

  test('sitemap exists', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
  });

  test('robots.txt exists', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
  });
});

test.describe('Admin Tests', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
