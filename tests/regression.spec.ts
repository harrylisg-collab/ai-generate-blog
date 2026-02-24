import { test, expect } from '@playwright/test';

// ==================== PUBLIC PAGES ====================

test.describe('Blog Public Pages', () => {
  test('homepage loads with title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AI Generate Blog/);
  });

  test('homepage shows posts list', async ({ page }) => {
    await page.goto('/');
    const hasContent = await page.locator('main').isVisible();
    expect(hasContent).toBe(true);
  });

  test('theme toggle exists', async ({ page }) => {
    await page.goto('/');
    const themeButton = page.locator('button[aria-label*="mode"], button[aria-label*="theme"]');
    await expect(themeButton.first()).toBeVisible();
  });

  test('theme toggle works', async ({ page }) => {
    await page.goto('/');
    const themeButton = page.locator('button[aria-label*="mode"], button[aria-label*="theme"]').first();
    await themeButton.click();
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(['light', 'dark']).toContain(theme);
  });

  test('footer has newsletter section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Subscribe to Newsletter')).toBeVisible();
  });
});

test.describe('Article Detail', () => {
  test('article page loads or 404', async ({ page }) => {
    await page.goto('/post/sample-post');
    const is404 = await page.locator('text=404').isVisible();
    const isPost = await page.locator('article').isVisible();
    expect(is404 || isPost).toBe(true);
  });
});

test.describe('Search Function', () => {
  test('search page loads', async ({ page }) => {
    await page.goto('/search?q=test');
    await expect(page.locator('h1')).toContainText('Search results');
  });

  test('search returns results or empty', async ({ page }) => {
    await page.goto('/search?q=a');
    const hasContent = await page.locator('article, text=No posts').isVisible();
    expect(hasContent).toBe(true);
  });
});

test.describe('Newsletter Subscription', () => {
  test('newsletter form exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
  });
});

// ==================== LOGIN FLOW ====================

test.describe('Login Flow', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('login with valid credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');
  });
});

// ==================== ADMIN ====================

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');
  });

  test('dashboard loads', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('text=All Posts')).toBeVisible();
  });

  test('can navigate to users tab', async ({ page }) => {
    await page.goto('/admin');
    await page.click('button:has-text("Users")');
    await expect(page.locator('h1')).toContainText('Users');
  });

  test('can navigate to subscribers tab', async ({ page }) => {
    await page.goto('/admin');
    await page.click('text=Subscribers');
    await expect(page.locator('h1')).toContainText('Subscribers');
  });
});
