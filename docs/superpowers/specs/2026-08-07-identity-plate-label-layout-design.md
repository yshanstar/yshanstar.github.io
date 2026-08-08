# Identity Plate Label Layout Design

## Goal

Make the hero identity plate’s expertise label fully readable by replacing the curved SVG text with two fixed labels below the name.

## Visual Design

The circular portrait remains unchanged: Shan Ye’s existing professional photo, circular mint frame, deep-navy treatment, and the large white `SHAN YE` name across the lower portrait.

Below the name, inside the lower portion of the circular plate:

- `DISTRIBUTED SYSTEMS` appears left-aligned.
- `CLOUD INFRASTRUCTURE` appears right-aligned.
- A small steel-blue divider separates the labels. It uses the existing muted theme color (`--muted`, `#9db2c7`), not mint.

The labels use the existing monospaced typeface, uppercase treatment, and a compact responsive size. They sit above the bottom edge with enough spacing to remain distinct from the name and border.

## Structure and Accessibility

- Remove the decorative SVG curved-text element and its path definition.
- Keep the portrait `alt` text unchanged.
- Add a semantic, visually hidden summary for screen readers: “Distributed systems and cloud infrastructure.”
- The split labels are visual branding and are not interactive.

## Responsive Behavior

The labels retain their left/right arrangement on wide displays. On narrow screens, they remain legible through a smaller type scale and can stack only if their container becomes too narrow; the name remains centered above them.

## Validation

- Update the static contract test to require both label strings and prohibit the retired curved SVG label.
- Run the complete Node test suite and `git diff --check`.
- Inspect the local home page to ensure the labels do not clip, overlap the name, or cause horizontal scrolling.
