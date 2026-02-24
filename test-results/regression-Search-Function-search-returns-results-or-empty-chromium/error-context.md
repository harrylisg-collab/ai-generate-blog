# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
      - heading "Search results for \"a\"" [level=1] [ref=e13]
      - article [ref=e15]:
        - link "Test Article from Preview" [ref=e16] [cursor=pointer]:
          - /url: /post/test-preview-article
          - heading "Test Article from Preview" [level=2] [ref=e17]
        - generic [ref=e18]: February 24, 2026
        - paragraph [ref=e19]: Test article for regression testing
      - link "← Back to all posts" [ref=e20] [cursor=pointer]:
        - /url: /
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