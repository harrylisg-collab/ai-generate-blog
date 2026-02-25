import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/api*.ts', '**/extended.spec.ts'],
  fullyParallel: true,
  retries: 0,
  reporter: 'line',
  use: {
    baseURL: 'https://ai-generate-blog-test.vercel.app',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
