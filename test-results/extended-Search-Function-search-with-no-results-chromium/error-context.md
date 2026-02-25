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
      - heading "Search results for \"zzzznonexistentquery12345\"" [level=1] [ref=e13]
      - paragraph [ref=e14]: No posts found matching your search.
      - link "← Back to all posts" [ref=e15] [cursor=pointer]:
        - /url: /
    - contentinfo [ref=e16]:
      - generic [ref=e17]:
        - heading "Subscribe to Newsletter" [level=3] [ref=e18]
        - paragraph [ref=e19]: Get the latest posts delivered to your inbox.
        - generic [ref=e20]:
          - textbox "your@email.com" [ref=e21]
          - button "Subscribe" [ref=e22] [cursor=pointer]
      - paragraph [ref=e23]: © 2026 AI Generate Blog System. All rights reserved.
  - alert [ref=e24]
```