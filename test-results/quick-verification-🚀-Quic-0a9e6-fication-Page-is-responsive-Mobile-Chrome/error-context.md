# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - img [ref=e5]
      - heading "Oops! Something went wrong" [level=1] [ref=e7]
      - paragraph [ref=e8]: We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
    - generic [ref=e9]:
      - button "Try Again" [ref=e10] [cursor=pointer]:
        - img
        - text: Try Again
      - link "Go Home" [ref=e11] [cursor=pointer]:
        - /url: /
        - button "Go Home" [ref=e12]:
          - img
          - text: Go Home
  - alert [ref=e15]
```