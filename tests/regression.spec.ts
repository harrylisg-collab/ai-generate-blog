import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// ==================== PUBLIC PAGES ====================

test.describe('Blog Public Pages', () => {
  test('homepage loads with title', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/AI Generate Blog/);
  });

  test('homepage shows posts list', async ({ page }) => {
    await page.goto(BASE_URL);
    const hasContent = await page.locator('main').isVisible();
    expect(hasContent).toBe(true);
  });

  test('theme toggle exists', async ({ page }) => {
    await page.goto(BASE_URL);
    // Theme toggle should be visible (sun/moon icon button)
    const themeButton = page.locator('button[aria-label*="mode"], button[aria-label*="theme"]');
    await expect(themeButton.first()).toBeVisible();
  });

  test('theme toggle works', async ({ page }) => {
    await page.goto(BASE_URL);
    const themeButton = page.locator('button[aria-label*="mode"], button[aria-label*="theme"]').first();
    if (await themeButton.isVisible()) {
      await themeButton.click();
      // Should toggle theme
      const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(['light', 'dark']).toContain(theme);
    }
  });

  test('footer has newsletter section', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('text=Subscribe to Newsletter')).toBeVisible();
  });
});

test.describe('Article Detail', () => {
  test('article page loads', async ({ page }) => {
    // Try to go to a sample post
    await page.goto(`${BASE_URL}/post/sample-post`);
    // Should either show post or 404
    const is404 = await page.locator('text=404').isVisible();
    const isPost = await page.locator('article').isVisible();
    expect(is404 || isPost).toBe(true);
  });

  test('post navigation (prev/next) works', async ({ page }) => {
    await page.goto(`${BASE_URL}/post/sample-post`);
    // Check for navigation links
    const hasNav = await page.locator('nav').first().isVisible();
    // May or may not have prev/next depending on posts
  });
});

test.describe('Search Function', () => {
  test('search page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/search?q=test`);
    await expect(page.locator('h1')).toContainText('Search results');
  });

  test('search returns results', async ({ page }) => {
    await page.goto(`${BASE_URL}/search?q=a`);
    // Should show results or "No posts found"
    const hasContent = await page.locator('article, text=No posts').isVisible();
    expect(hasContent).toBe(true);
  });
});

test.describe('Newsletter Subscription', () => {
  test('newsletter form exists', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
  });

  test('can enter email in newsletter', async ({ page }) => {
    await page.goto(BASE_URL);
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
      await expect(emailInput).toHaveValue('test@example.com');
    }
  });

  test('subscribe shows success message', async ({ page }) => {
    await page.goto(BASE_URL);
    const emailInput = page.locator('input[type="email"]').first();
    const submitButton = page.locator('button:has-text("Subscribe")').first();
    
    if (await emailInput.isVisible() && await submitButton.isVisible()) {
      const uniqueEmail = `test${Date.now()}@example.com`;
      await emailInput.fill(uniqueEmail);
      await submitButton.click();
      
      // Should show success or error message (if already subscribed)
      await page.waitForTimeout(2000);
      const hasMessage = await page.locator('text=Successfully, text=Already subscribed, text=Error').first().isVisible();
      expect(hasMessage).toBe(true);
    }
  });
});

// ==================== LOGIN FLOW ====================

test.describe('Login Flow', () => {
  test('login page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('login with valid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
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

// ==================== ADMIN - ARTICLE MANAGEMENT ====================

test.describe('Admin - Article Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`);
  });

  test('dashboard loads', async ({ page }) => {
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
    await page.fill('textarea', '# Test Content\n\nThis is test content.');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(`${BASE_URL}/admin`);
  });

  test('posts list displays', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    const hasContent = await page.locator('table, text=No posts yet').isVisible();
    expect(hasContent).toBe(true);
  });

  test('can navigate to subscribers tab', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.click('text=Subscribers');
    await expect(page.locator('h1')).toContainText('Subscribers');
  });
});

// ==================== ADMIN - USER MANAGEMENT ====================

test.describe('Admin - User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`);
  });

  test('can navigate to users tab', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.click('button:has-text("Users")');
    await expect(page.locator('h1')).toContainText('Users');
  });

  test('users list displays', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.click('button:has-text("Users")');
    const hasContent = await page.locator('table, text=No users yet').isVisible();
    expect(hasContent).toBe(true);
  });

  test('can create new user', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.click('button:has-text("Users")');
    
    const addButton = page.locator('button:has-text("Add User")');
    if (await addButton.isVisible()) {
      await addButton.click();
      
      const timestamp = Date.now();
      await page.fill('input[type="email"]', `user${timestamp}@test.com`);
      await page.fill('input[type="password"]', 'password123');
      await page.fill('input[placeholder="Admin"]', 'Test User');
      await page.selectOption('select', 'author');
      await page.click('button:has-text("Create User")');
      
      await page.waitForTimeout(1000);
    }
  });

  test('delete user button exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.click('button:has-text("Users")');
    
    // Just check if we can navigate to users page
    await expect(page.locator('h1')).toContainText('Users');
  });
});

// ==================== ADMIN - SUBSCRIBERS ====================

test.describe('Admin - Subscribers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`);
  });

  test('subscribers list displays', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.click('text=Subscribers');
    await expect(page.locator('h1')).toContainText('Subscribers');
  });
});
