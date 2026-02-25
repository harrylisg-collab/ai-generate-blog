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
    - generic [ref=e13]:
      - heading "Admin Login" [level=1] [ref=e14]
      - generic [ref=e15]:
        - generic [ref=e16]:
          - generic [ref=e17]: Email
          - textbox "Email" [ref=e18]: admin@example.com
        - generic [ref=e19]:
          - generic [ref=e20]: Password
          - textbox "Password" [ref=e21]: wrongpassword
        - paragraph [ref=e22]: Invalid email or password
        - button "Sign in" [ref=e23] [cursor=pointer]
  - alert [ref=e24]
```