# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e4]:
    - img [ref=e6]
    - heading "Something went wrong" [level=2] [ref=e8]
    - paragraph [ref=e9]: We're sorry, but something unexpected happened. Please try refreshing the page.
    - generic [ref=e10]:
      - button "Refresh Page" [ref=e11] [cursor=pointer]
      - button "Go Home" [ref=e12] [cursor=pointer]
```