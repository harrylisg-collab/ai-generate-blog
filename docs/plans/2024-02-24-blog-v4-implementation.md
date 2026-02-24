# Blog v4 - Implementation Plan

## Task Breakdown (2-5 minutes each)

### Phase 1: Setup
- [ ] **V1**: Install dependencies (react-syntax-highlighter) (2min)
- [ ] **V2**: Update database schema (posts + tags, subscribers table) (3min)

### Phase 2: RSS & SEO
- [ ] **V3**: Create RSS feed endpoint /rss.xml (3min)
- [ ] **V4**: Create sitemap.xml (2min)
- [ ] **V5**: Create robots.txt (1min)
- [ ] **V6**: Add JSON-LD to post pages (2min)

### Phase 3: Code Highlighting
- [ ] **V7**: Create CodeBlock component (3min)
- [ ] **V8**: Update Markdown renderer to use CodeBlock (2min)

### Phase 4: Reading Time & Sharing
- [ ] **V9**: Reading time already implemented in v3, verify (1min)
- [ ] **V10**: Add ShareButton component (2min)
- [ ] **V11**: Add ShareButton to post detail (2min)

### Phase 5: Tags/Categories
- [ ] **V12**: Update Post model with tags (3min)
- [ ] **V13**: Add tags to post editor (3min)
- [ ] **V14**: Display tags in post list/detail (2min)
- [ ] **V15**: Create tags archive page (3min)

### Phase 6: Search
- [ ] **V16**: Create SearchBar component (3min)
- [ ] **V17**: Add search to header (2min)
- [ ] **V18**: Create search results page (3min)

### Phase 7: Newsletter
- [ ] **V19**: Create Subscriber model (2min)
- [ ] **V20**: Create Newsletter API (2min)
- [ ] **V21**: Create Newsletter component (3min)
- [ ] **V22**: Add Newsletter to footer (2min)

### Phase 8: Testing & Build
- [ ] **V23**: Run tests (2min)
- [ ] **V24**: Build verification (2min)

---

## Dependencies

```json
{
  "react-syntax-highlighter": "^15.5"
}
```
