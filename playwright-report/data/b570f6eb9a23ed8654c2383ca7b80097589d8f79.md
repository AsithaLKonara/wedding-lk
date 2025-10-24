# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - heading "WeddingLK" [level=1] [ref=e5]
    - paragraph [ref=e6]: Sign in to your account
  - generic [ref=e7]:
    - heading "Welcome Back" [level=2] [ref=e8]
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]: Email Address
        - textbox "Email Address" [ref=e12]:
          - /placeholder: your@email.com
      - generic [ref=e13]:
        - generic [ref=e14]: Password
        - generic [ref=e15]:
          - textbox "Password" [ref=e16]:
            - /placeholder: Enter your password
          - button [ref=e17] [cursor=pointer]:
            - img [ref=e18]
      - button "Sign In" [ref=e21] [cursor=pointer]
    - paragraph [ref=e22]:
      - text: Don't have an account?
      - link "Sign up here" [ref=e23] [cursor=pointer]:
        - /url: /register
```