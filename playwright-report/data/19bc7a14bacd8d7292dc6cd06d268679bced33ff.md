# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - heading "WeddingLK" [level=1] [ref=e5]
      - paragraph [ref=e6]: Sign in to your account
    - generic [ref=e7]:
      - heading "Welcome Back" [level=2] [ref=e8]
      - generic [ref=e9]:
        - img [ref=e10]
        - paragraph [ref=e14]: Invalid credentials
      - generic [ref=e15]:
        - generic [ref=e16]:
          - generic [ref=e17]: Email Address
          - textbox "Email Address" [ref=e18]:
            - /placeholder: your@email.com
            - text: admin@test.local
        - generic [ref=e19]:
          - generic [ref=e20]: Password
          - generic [ref=e21]:
            - textbox "Password" [ref=e22]:
              - /placeholder: Enter your password
              - text: Test123!
            - button [ref=e23] [cursor=pointer]:
              - img [ref=e24]
        - button "Sign In" [ref=e27] [cursor=pointer]
      - paragraph [ref=e28]:
        - text: Don't have an account?
        - link "Sign up here" [ref=e29] [cursor=pointer]:
          - /url: /register
  - alert [ref=e32]
```