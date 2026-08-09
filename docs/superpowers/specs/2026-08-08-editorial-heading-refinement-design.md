# Editorial Heading Refinement Design

## Goal

Make Engineering Editorial headlines faster to read by shortening them and using a restrained animated gradient on one key word per heading.

## Approved Headings

1. `Cloud platforms that last` — highlight `last`.
2. `Systems that endure` — highlight `endure`.
3. `Direction that scales` — highlight `scales`.
4. `Let’s talk` — highlight `talk`.

## Visual Treatment

- Keep non-highlighted words in deep navy.
- Render each highlighted word with a steel-blue to muted-terracotta gradient matching the existing editorial palette.
- Apply a slow background-position animation to the gradient only.
- Disable the animation under `prefers-reduced-motion: reduce` while retaining a static gradient.
- Widen the hero text column modestly and tune headline size so the new hero heading uses fewer lines at desktop and medium widths.

## Validation

- Update the static contract with all revised heading text and an animated-highlight class.
- Run the complete test suite, check the diff, and inspect the local main page.
