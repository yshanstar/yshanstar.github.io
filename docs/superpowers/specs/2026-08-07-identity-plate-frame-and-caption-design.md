# Identity Plate Frame and Caption Design

## Goal

Refine the hero identity plate by replacing its mint circular frame lines with steel-blue and centering the operating-principle caption beneath the portrait.

## Visual Design

- Replace the outer circular border’s mint color with the existing muted steel-blue token, `--muted` (`#9db2c7`).
- Replace the inset circular border’s mint transparency with a restrained steel-blue transparency based on the same color.
- Keep the portrait, white `SHAN YE` name, split technical labels, and dark navy photo treatment unchanged.
- Center the caption’s two parts—`OPERATING PRINCIPLE` and `Clarity is a scaling strategy`—as a single line beneath the circle.
- Retain the existing divider line above the caption.

## Responsive Behavior

The centered caption stays on one line where space permits. At the existing mobile breakpoint it may wrap naturally while keeping centered text alignment.

## Validation

- Extend the static contract test to confirm steel-blue identity borders and centered caption styling.
- Run the complete Node test suite and `git diff --check`.
- Inspect the local home page for the non-mint frame, centered caption, and absence of horizontal scrolling.
