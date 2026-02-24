# Blog Project Design Document

## 1. Project Overview

- **Project Name**: anthropic-blog
- **Type**: Full-stack blog with admin panel
- **Core Functionality**: A minimalist, typography-focused blog platform where admin can write/publish Markdown posts, and visitors can read beautifully formatted articles

## 2. Technical Architecture

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js (credentials provider)
- **Database**: Vercel Postgres
- **Markdown**: react-markdown + remark-gfm
- **Testing**: Vitest + React Testing Library

### Data Model

#### Post
```
id: SERIAL PRIMARY KEY
title: VARCHAR(255)
slug: VARCHAR(255) UNIQUE
content: TEXT
excerpt: TEXT
published: BOOLEAN DEFAULT FALSE
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

#### User
```
id: SERIAL PRIMARY KEY
email: VARCHAR(255) UNIQUE
password: VARCHAR(255)
created_at: TIMESTAMP
```

## 3. UI/UX Design

### Color Palette
- Background: `#FAFAFA`
- Surface: `#FFFFFF`
- Text Primary: `#171717`
- Text Secondary: `#525252`
- Accent: `#D4D4D4`
- Border: `#E5E5E5`
- Code Background: `#F5F5F4`

### Typography
- Headings: `"Literata", Georgia, serif`
- Body: `"Inter", -apple-system, sans-serif`
- Code: `"JetBrains Mono", monospace`
- Base size: 18px
- Line height: 1.7

### Layout
- Container max-width: 680px
- Responsive breakpoints: 640px, 1024px

## 4. Acceptance Criteria

- [x] Home page shows published posts (newest first)
- [x] Post detail renders Markdown correctly
- [x] Admin can log in with email/password
- [x] Admin can create/edit/delete posts
- [x] SEO meta tags on all pages
- [x] Mobile responsive
- [x] All tests pass
- [x] Build succeeds
