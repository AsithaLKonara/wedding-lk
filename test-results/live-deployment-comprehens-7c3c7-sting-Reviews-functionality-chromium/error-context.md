# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - heading "Write Review" [level=1] [ref=e4]
    - paragraph [ref=e5]: Share your experience
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]: Rating
        - combobox "Rating" [ref=e10]:
          - option "Select rating" [selected]
          - option "5 Stars - Excellent"
          - option "4 Stars - Very Good"
          - option "3 Stars - Good"
          - option "2 Stars - Fair"
          - option "1 Star - Poor"
      - generic [ref=e11]:
        - generic [ref=e12]: Your Review
        - textbox "Your Review" [ref=e13]
      - button "Submit Review" [ref=e14] [cursor=pointer]
  - region "Notifications alt+T"
  - alert [ref=e15]
```