# Specification

## Summary
**Goal:** Enhance the accepted (Yes) view by adding a 1.0s fade-in for the bouquet image and a subtle, gently pulsing glow behind it, while keeping all other view animations and content unchanged.

**Planned changes:**
- Apply a dedicated 1.0s fade-in animation to only the bouquet image on the accepted (Yes) view (leave existing 0.6s `.fade-in` behavior elsewhere unchanged).
- Add a soft glow layer behind the bouquet image on the accepted (Yes) view and animate it with a gentle continuous pulse that does not affect layout or overlap text.
- Respect `prefers-reduced-motion` by disabling (or near-instant) bouquet fade-in and disabling the glow pulse (static glow or removed).

**User-visible outcome:** When the user reaches the accepted (Yes) page, the bouquet fades in over 1 second and has a subtle, gently pulsing glow behind it; users who prefer reduced motion won’t see the animations.
