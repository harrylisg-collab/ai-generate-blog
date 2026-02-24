# AI Generate Blog System

A minimalist, typography-focused blog platform built with Next.js 14+.

## 🌐 URLs

| Environment | URL |
|------------|-----|
| Production | https://ai-generate-blog.vercel.app |
| Test/Preview | https://ai-generate-blog-test.vercel.app |

## 🔐 Test Accounts

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: admin

### Test Users
- **Email**: test@example.com
- **Password**: test123
- **Role**: author

> ⚠️ **Note**: These credentials are for testing only. In production, use secure passwords!

## 🧪 Testing

### Unit Tests
```bash
npm run test        # Run unit tests
npm run test:run   # Run tests once
```

### E2E Tests (Playwright)
```bash
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui    # Run E2E tests in UI mode
```

### Test Credentials
The E2E tests use these credentials:
- **Email**: admin@example.com
- **Password**: admin123

## 🛠️ Development

### Local Setup
```bash
npm install
npm run dev
```

### Database
- Preview/Test environment uses TEST_POSTGRES_URL
- Production uses POSTGRES_URL

### Build
```bash
npm run build
```

## 📁 Project Structure

```
├── src/
│   ├── app/           # Next.js pages
│   ├── components/    # React components
│   ├── lib/           # Database & utilities
│   └── test/          # Unit tests
├── tests/             # E2E tests (Playwright)
├── docs/              # Design documents
└── playwright.config.ts
```

## 📝 Features

- [x] Markdown blog posts
- [x] Admin dashboard
- [x] User management (multi-user)
- [x] Newsletter subscription
- [x] RSS feed
- [x] Sitemap
- [x] Light/Dark theme
- [x] Code syntax highlighting
- [x] Reading time
- [x] Social sharing
- [x] Tags/Categories
- [x] Search

## 📄 License

MIT
