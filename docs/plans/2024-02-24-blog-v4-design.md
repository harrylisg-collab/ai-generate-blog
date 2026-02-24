# Blog v4 - Design Document

## 1. Project Overview

- **Project Name**: AI Generate Blog System v4
- **Type**: Blog feature enhancements
- **Goal**: Add RSS, SEO, code highlighting, reading time, social sharing, tags/categories, search, and newsletter

## 2. Feature Specifications

### 2.1 RSS 订阅
- **Endpoint**: `/rss.xml`
- **Format**: RSS 2.0
- **Content**: All published posts (title, link, description, pubDate)
- **Auto-discovery**: Added to HTML head

### 2.2 SEO 增强
- **sitemap.xml**: `/sitemap.xml` - All published posts
- **robots.txt**: `/robots.txt` - Allow crawling
- **JSON-LD**: Structured data for blog posts (schema.org/BlogPosting)
- **Meta tags**: Already implemented in v3

### 2.3 代码高亮
- **Library**: react-syntax-highlighter
- **Theme**: Light: GitHub, Dark: GitHub Dark
- **Languages**: Support all common languages
- **Style**: Inline code and code blocks

### 2.4 阅读时间
- **Display**: In post list and post detail
- **Calculation**: Words / 200 (rounded up)
- **Format**: "X min read"

### 2.5 社交分享
- **Platform**: X (Twitter)
- **Button**: Share icon in post detail
- **URL**: `https://twitter.com/intent/tweet?text={title}&url={url}`

### 2.6 标签/分类
- **Database**: Add tags column (array of strings)
- **UI**: Tags displayed in post card and detail
- **Archive**: `/tags/[tag]` page

### 2.7 搜索功能
- **Type**: Client-side search (simple)
- **UI**: Search input in header
- **Results**: Filter posts by title/content

### 2.8 Newsletter
- **UI**: Subscribe form in footer
- **Storage**: Store emails in database (new table)
- **Confirmation**: Simple email validation

## 3. Data Model Changes

### Post (updated)
```
tags: TEXT[]  -- array of tags
```

### Subscriber (new)
```
id: SERIAL PRIMARY KEY
email: VARCHAR(255) UNIQUE
created_at: TIMESTAMP
```

## 4. UI/UX

### Styles (Anthropic - v3)
- Font: Poppins (headings), Lora (body)
- Colors: Light (#faf9f5) / Dark (#141413)
- Accent: #d97757

### New Components
- `RssFeed` - RSS generator
- `Sitemap` - Sitemap generator
- `JsonLd` - Structured data component
- `CodeBlock` - Syntax highlighted code
- `ShareButton` - Social share button
- `TagList` - Tags display
- `SearchBar` - Search input
- `Newsletter` - Subscribe form

## 5. Acceptance Criteria

- [ ] RSS feed works at /rss.xml
- [ ] Sitemap works at /sitemap.xml
- [ ] Robots.txt exists
- [ ] JSON-LD in post pages
- [ ] Code blocks have syntax highlighting
- [ ] Reading time displayed
- [ ] Share to X works
- [ ] Tags can be added/displayed
- [ ] Search filters posts
- [ ] Newsletter form works
- [ ] All tests pass
- [ ] Build succeeds

---

⚠️ **需要批准后才能实现**
