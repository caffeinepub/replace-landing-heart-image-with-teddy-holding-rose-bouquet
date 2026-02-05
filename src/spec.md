# Specification

## Summary
**Goal:** Update the landing-page paragraph text directly below the question “Yash will you be my valentine?” to the provided new message.

**Planned changes:**
- Replace the text content of the specific paragraph element at XPath `/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[2]/p[1]` (the `<p>` under the question in `frontend/src/App.tsx`) with the exact provided message, including punctuation and the ❤️ character.
- Leave all other page text, buttons, screens (accepted/declined), footer, and images unchanged.

**User-visible outcome:** On the initial question view, the paragraph immediately below the main question shows the new message exactly as provided, with everything else on the page unchanged.
