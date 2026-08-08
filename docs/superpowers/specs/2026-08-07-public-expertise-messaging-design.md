# Public Expertise Messaging Design

## Purpose

Reposition the existing one-page portfolio as a public statement of Shan Ye's expertise. The page will communicate clear authority in distributed systems and cloud infrastructure while retaining the approved Signal Architecture visual system, LinkedIn-only call to action, anonymous experience framing, and existing Snake page.

## Audience and message

The page serves engineering leaders, peers, recruiters, and prospective collaborators. It should read as enduring expertise rather than a company-specific resume.

The hero message will state that Shan is a senior principal software engineer building secure, scalable cloud platforms for complex distributed systems. Supporting copy will focus on reliability, security, isolation, safe evolution, and scale. It will avoid product-domain detail such as tenancy, subscriptions, entitlements, commerce, and lifecycle terminology.

## Content changes

### Hero

- Retain the `SYSTEMS / LEADERSHIP / CLOUD` eyebrow, portrait, and LinkedIn CTA.
- Use a concise, direct headline about reliable cloud platforms.
- Replace the current lede with a public-expertise statement that describes distributed systems, scale, security, and isolation without implying a particular employer or product.

### System profile

- Describe the work as designing cloud foundations that remain reliable, secure, and understandable as systems and organizations grow.
- Use facts that name the focus, operating mode, and method in broad engineering terms.

### Expertise panels

Use three panels with this intent:

1. **Distributed systems** — dependable services, clear boundaries, and safe change at scale.
2. **Cloud infrastructure** — secure platform foundations with resilience and strong isolation.
3. **Engineering leadership** — mentoring, career growth, technical direction aligned with company strategy, and practical knowledge sharing with the engineering community.

Copy must remain concise and avoid employer names, logos, numerical claims, and product-specific language.

### Career and connection

- Keep the anonymous career arc, but describe transferable work in cloud platforms, scalable systems, and customer experiences rather than specific products or business domains.
- Keep `Connect on LinkedIn` and the closing LinkedIn CTA as the only calls to action.

### Navigation

- Preserve the existing Profile, Operate, Career, and Connect links.
- Move the Snake link to the end of navigation.
- Style Snake as a compact, mint-accented signal: legible, keyboard accessible, and clearly a small highlight rather than the active main-page section.

## Constraints

- Do not alter the Snake gameplay page or its behavior.
- Preserve the Signal Architecture layout, responsive behavior, contrast, motion preferences, and LinkedIn URL.
- Keep all language short, direct, and free of terminal punctuation in display-style statements where it can be omitted.

## Verification

- Add static-content contract tests for the new messaging, absence of retired product terms, and final-position highlighted Snake link.
- Run the complete Node test suite and `git diff --check`.
- Inspect the main page at desktop and narrow mobile widths to confirm the revised copy remains readable and Snake is visible without dominating navigation.
