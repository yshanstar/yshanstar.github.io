# Engineering Editorial Homepage Design

## Goal

Rebuild the main portfolio page as an Engineering Editorial: a refined, editorial-style introduction to Shan Ye’s public expertise in distributed systems, cloud infrastructure, security, and engineering leadership.

## Visual Direction

- Use a warm off-white canvas with deep navy text and steel-blue detail lines.
- Use large editorial serif display type, clean sans-serif body text, and monospaced labels.
- Keep the existing professional portrait. Present it in a large circular frame with `SHAN YE` layered across its lower portion.
- Replace the terminal grid and mint-first visual language on the home page. Keep the Snake game untouched.
- Use thin horizontal and vertical rules, generous whitespace, and oversized section numbers.

## Page Structure

1. A compact masthead: `SHAN YE / ENGINEERING EDITORIAL` on the left and the current one-page navigation on the right; Snake remains the final link.
2. A two-column hero: concise systems-leadership headline and LinkedIn call to action on the left; circular portrait on the right.
3. A three-column expertise strip: distributed systems, cloud infrastructure, and technical direction.
4. Editorial sections for platform expertise, security and isolation, and leadership, each using concise public-facing statements.
5. A closing LinkedIn section and a minimal footer.

## Copy Direction

- Lead with: `Cloud platforms built for critical work`.
- Keep language general and public; do not name companies or disclose product-specific details.
- Emphasize scalable distributed systems, reliable cloud infrastructure, security, isolation, mentoring, career growth, and technical alignment.

## Responsive and Accessibility Requirements

- Preserve semantic sections, the existing image alt text, keyboard-visible focus styles, and reduced-motion support.
- Collapse all multi-column layouts to one column on narrow screens.
- Retain accessible mobile navigation.
- Do not introduce external dependencies; use system font stacks.

## Validation

- Update static contracts to reflect the Engineering Editorial visual system and the new hero title.
- Run the complete Node test suite and inspect desktop and mobile layouts locally.
