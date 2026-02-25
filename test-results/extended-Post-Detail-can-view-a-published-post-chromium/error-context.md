# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - navigation [ref=e4]:
        - link "AI Generate Blog System" [ref=e5] [cursor=pointer]:
          - /url: /
        - generic [ref=e6]:
          - searchbox "Search posts" [ref=e8]
          - button "Switch to dark mode" [ref=e9] [cursor=pointer]:
            - img [ref=e10]
    - main [ref=e12]:
      - article [ref=e14]:
        - link "Test Article from Preview" [active] [ref=e15] [cursor=pointer]:
          - /url: /post/test-preview-article
          - heading "Test Article from Preview" [level=2] [ref=e16]
        - generic [ref=e17]:
          - text: February 24, 2026
          - generic [ref=e18]: · Admin
          - generic [ref=e19]: · 1 min read
        - paragraph [ref=e20]: Test article for regression testing
    - contentinfo [ref=e21]:
      - generic [ref=e22]:
        - heading "Subscribe to Newsletter" [level=3] [ref=e23]
        - paragraph [ref=e24]: Get the latest posts delivered to your inbox.
        - generic [ref=e25]:
          - textbox "your@email.com" [ref=e26]
          - button "Subscribe" [ref=e27] [cursor=pointer]
      - paragraph [ref=e28]: © 2026 AI Generate Blog System. All rights reserved.
  - alert [ref=e29]
```