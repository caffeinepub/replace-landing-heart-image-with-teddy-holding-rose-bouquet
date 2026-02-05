# Specification

## Summary
**Goal:** Keep the “Yes” button perfectly fixed at its current pixel position throughout the “No” button’s evasive behavior, with no visual movement from layout or animations.

**Planned changes:**
- Prevent any layout reflow from the “No” button switching to absolute positioning by preserving the original in-flow space so the “Yes” button’s coordinates never shift.
- Remove any hover/active transforms, transitions, or animations on the “Yes” button that could cause visible movement, while keeping it fully clickable and preserving its existing click behavior.

**User-visible outcome:** During the evasive “No” interaction, the “Yes” button stays completely motionless (no 1px shifts and no hover/press motion) while still working normally when clicked.
