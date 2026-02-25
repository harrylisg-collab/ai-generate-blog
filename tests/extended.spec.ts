import { test, expect } from '@playwright/test';

// ==================== HELPER FUNCTIONS ====================

async function loginAsAdmin(page: any) {
  await page.goto('/admin/login');
  await page.fill('input[type="email"]', 'admin@example.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 30000 });
}

// ==================== PUBLIC PAGES ====================

test.describe('Blog Public Pages', () => {
  test('homepage loads with title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AI Generate Blog/);
  });

  test('homepage shows posts list', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();
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

// ==================== SEARCH ====================

test.describe('Search Function', () => {
  test('search page loads', async ({ page }) => {
    await page.goto('/search?q=test');
    await expect(page.locator('h1')).toContainText('Search results');
  });

  test('search with no results', async ({ page }) => {
    await page.goto('/search?q=zzzznonexistentquery12345');
    await expect(page.locator('text=No results found')).toBeVisible();
  });
});

// ==================== POST DETAIL ====================

test.describe('Post Detail', () => {
  test('can view a published post', async ({ page }) => {
    // First go to homepage and check for any post links
    await page.goto('/');
    const firstPostLink = page.locator('article a, main a').first();
    if (await firstPostLink.count() > 0) {
      await firstPostLink.click();
      // Should either show post content or 404 if no posts exist
      const url = page.url();
      expect(url).toMatch(/\/post\/|404/);
    }
  });
});

// ==================== RSS & SITEMAP ====================

test.describe('RSS & Sitemap', () => {
  test('RSS feed is accessible', async ({ page }) => {
    const response = await page.goto('/rss.xml');
    expect(response?.status()).toBe(200);
    const content = await page.content();
    expect(content).toContain('<?xml');
  });

  test('sitemap is accessible', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    const content = await page.content();
    expect(content).toContain('<?xml');
  });
});

// ==================== 404 PAGE ====================

test.describe('404 Page', () => {
  test('404 page displays correctly', async ({ page }) => {
    await page.goto('/nonexistent-page-xyz123');
    await expect(page.locator('text=404')).toBeVisible();
  });
});

// ==================== LOGIN FLOW ====================

test.describe('Login Flow', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('login with valid credentials', async ({ page }) => {
    await loginAsAdmin(page);
    // Should be redirected to admin dashboard
    await expect(page).toHaveURL(/.*\/admin/);
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    // Should show error or stay on page
    await expect(page.locator('text=Invalid, text=Error, text=incorrect').first()).toBeVisible({ timeout: 5000 }).catch(() => {
      // If no error message, check that we didn't redirect to admin
      return expect(page).not.toHaveURL(/.*\/admin/);
    });
  });
});

// ==================== ADMIN DASHBOARD ====================

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
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

  test('can navigate to new post page', async ({ page }) => {
    await page.goto('/admin');
    await page.click('text=New Post');
    await expect(page).toHaveURL(/.*\/admin\/new/);
  });

  test('can logout', async ({ page }) => {
    await page.goto('/admin');
    // Look for logout button
    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")');
    if (await logoutButton.count() > 0) {
      await logoutButton.click();
      await expect(page).toHaveURL(/.*\/admin\/login/);
    }
  });
});

// ==================== ADMIN - POST MANAGEMENT ====================

test.describe('Admin - Post Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('can access posts list', async ({ page }) => {
    await page.goto('/admin/posts');
    await expect(page.locator('h1')).toContainText('All Posts');
  });

  test('posts list shows existing posts', async ({ page }) => {
    await page.goto('/admin/posts');
    // Should show some posts or "No posts" message
    const hasContent = await page.locator('text=No posts, article, table, li').first().isVisible().catch(() => false);
    expect(hasContent).toBe(true);
  });
});

// ==================== ADMIN - CREATE POST ====================

test.describe('Admin - Create Post', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/new');
  });

  test('new post page loads with form', async ({ page }) => {
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="content"]')).toBeVisible();
  });

  test('can fill new post form', async ({ page }) => {
    await page.fill('input[name="title"]', 'Test Post from QA');
    await page.fill('textarea[name="content"]', 'This is a test post content.');
    // Form should be fillable
    const titleValue = await page.inputValue('input[name="title"]');
    expect(titleValue).toBe('Test Post from QA');
  });

  test('publish toggle exists', async ({ page }) => {
    const publishToggle = page.locator('input[type="checkbox"][name="published"], button:has-text("Publish")');
    await expect(publishToggle.first()).toBeVisible();
  });
});

// ==================== NEWSLETTER SUBSCRIPTION ====================

test.describe('Newsletter Subscription', () => {
  test('newsletter form exists on homepage', async ({ page }) => {
    await page.goto('/');
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput.first()).toBeVisible();
  });

  test('can enter email in newsletter form', async ({ page }) => {
    await page.goto('/');
    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.fill('test@example.com');
    const submitButton = page.locator('button:has-text("Subscribe")').first();
    await expect(submitButton).toBeVisible();
  });
});

// ==================== MOBILE RESPONSIVENESS ====================

test.describe('Mobile Responsiveness', () => {
  test('homepage works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();
  });

  test('admin login works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});

// ==================== ACCESS CONTROL ====================

test.describe('Access Control', () => {
  test('unauthorized access to admin redirects to login', async ({ page }) => {
    await page.goto('/admin');
    // Should redirect to login (307 -> /admin/login)
    await expect(page).toHaveURL(/.*\/admin\/login/);
  });

  test('unauthorized access to admin posts redirects to login', async ({ page }) => {
    await page.goto('/admin/posts');
    await expect(page).toHaveURL(/.*\/admin\/login/);
  });
});
