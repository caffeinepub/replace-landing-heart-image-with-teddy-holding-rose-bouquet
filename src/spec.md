# Specification

## Summary
**Goal:** Refine the evasive “No” button so it dodges smoothly only when the cursor approaches, and stays within a bounded area around the Yes/No buttons without overlapping or hiding behind “Yes”.

**Planned changes:**
- Constrain the “No” button’s movement to a clearly bounded region surrounding the Yes/No button area (with padding), ensuring the button remains fully visible (not clipped).
- Switch the dodge trigger from immediate hover/enter to a proximity-based trigger (moves only when the pointer gets within a defined distance of the “No” button); keep touch interactions working as a dodge trigger.
- Replace bouncy/sudden motion with a smooth sliding transition between positions, and prevent the “No” button from being obscured by the “Yes” button (via overlap avoidance and stacking/position safeguards).

**User-visible outcome:** The “No” button only scoots away when you get close to it, gliding smoothly to a new spot within the button area, while always staying fully visible and never ending up behind or under the “Yes” button.
