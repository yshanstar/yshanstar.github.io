# Hero Identity Plate Design

## Purpose

Replace the rectangular profile panel on the home page with a distinctive engineering identity plate built from Shan Ye's original portrait and native HTML/CSS.

## Experience

- Keep the original `assets/profile.jpg`; do not use the generated portrait variation.
- Crop the portrait into a large circular hero artifact that keeps Shan's face, glasses, shoulders, and crossed-arm stance clear.
- Layer **SHAN YE** across the lower portion of the circle in the existing editorial display type, using high-contrast white.
- Place the technical label `DISTRIBUTED SYSTEMS / CLOUD INFRASTRUCTURE` around the lower arc of the circle in the existing monospace type.
- Use only deep navy, mint, and white. Avoid handwritten, fashion-editorial, pink, and decorative image-generated styling.

## Layout and responsive behavior

- Keep the existing two-column hero layout on wide screens and the stacked mobile layout.
- The portrait circle uses a deep-navy backing and mint/cool-blue signal rings; text remains HTML rather than baked into the image for crispness and accessibility.
- On mobile, the circle stays fully visible, retains legible name and arc text, and does not cause horizontal overflow.

## Technical design

- Replace existing portrait metadata and caption markup with a contained identity-plate structure: image, name overlay, decorative ring, and arc label.
- Use CSS `border-radius`, `object-fit`, layered pseudo-elements, and SVG text-on-path only for the curved label. The SVG is decorative and hidden from assistive technology; the same label is exposed as accessible text in HTML.
- Preserve the portrait alternative text and the existing no-dependency static-site architecture.

## Verification

- Add static contracts for original portrait use, visible `SHAN YE` name text, and the distributed-systems arc label.
- Run the full Node test suite and `git diff --check`.
- Inspect desktop and narrow mobile hero layouts for circle crop, text contrast, and no overflow.
