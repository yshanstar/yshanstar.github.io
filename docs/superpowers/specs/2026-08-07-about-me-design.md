# About Me Website Design

## Purpose

Build a distinctive, static, one-page professional website for Shan Ye. It should support professional networking first, demonstrate engineering-leadership credibility second, and support future recruiting conversations third.

## Audience and message

The primary audience is peers, engineering leaders, and professional contacts. The public headline is:

> Engineering systems that make cloud move.

The website will position Shan as a senior principal software engineer who leads durable, scalable cloud-commerce and lifecycle systems. It will focus on the shape and impact of the work rather than company brands.

## Information architecture

The page will use anchor-linked, top-to-bottom scrolling sections:

1. **Hero** - Portrait, name, headline, concise positioning statement, LinkedIn CTA, and a short technical status line.
2. **System profile** - A short engineering brief describing work across tenancy, organization and subscription lifecycles, cloud commerce, and resilient integrations.
3. **Where I operate** - Three work-theme panels:
   - Platform lifecycle: tenancy, subscription, entitlements, and resource reclamation.
   - Systems at scale: cloud-control-plane and commerce systems, API evolution, reliability, and experimentation.
   - Engineering leadership: roadmaps, design reviews, mentoring, technical alignment, and organizational enablement.
4. **Career signal** - A compact, anonymous career arc across cloud infrastructure, enterprise commerce, and high-scale retail. It will communicate depth without employer logos or names.
5. **Connect** - A closing networking invitation and LinkedIn-only link.

## Visual system

The selected direction is **Signal Architecture**:

- Deep ink/navy foundation with cool-blue structural lines.
- Mint/green signal accents for interactive and status elements.
- Editorial serif display typography paired with a clean technical sans-serif body type.
- Thin grids, coordinate labels, status dots, and data-like dividers that suggest an engineering field note.
- The supplied portrait is used in the hero as a deliberate, high-contrast visual artifact rather than a generic circular avatar.

The design must remain restrained and legible; decorative systems cues may not compete with content or reduce contrast.

## Technical architecture

- Static root site: `index.html`, `styles.css`, `script.js`, and local assets.
- No framework, package manager, server dependency, form, tracking, or remote runtime dependency.
- A small JavaScript file will manage progressive enhancements only: mobile navigation state, active section marker, and reduced-motion-safe reveal behavior.
- GitHub Pages compatibility requires relative asset paths and a root `404.html` fallback.

## Responsive and accessibility behavior

- The page is mobile-first and reflows from a single-column reading experience to wider editorial layouts.
- Navigation is usable with keyboard, supports anchor destinations, and has visible focus states.
- Headshot includes meaningful alternative text; purely decorative system marks are hidden from assistive technologies.
- Color contrast meets WCAG AA for normal text; motion is disabled or reduced when the user requests reduced motion.
- External LinkedIn links open safely in a new tab.

## Content boundary

Only the supplied profile photograph, resume facts, and LinkedIn URL are included. The page does not expose the email address or phone number in the resume. It does not name current or former employers, use company logos, make unverified numerical claims, or add a résumé download.

## Verification

Before handoff, verify:

- HTML/CSS/JS parse cleanly and all relative assets exist.
- The page works at desktop and narrow mobile viewports.
- Every navigation destination and LinkedIn CTA works.
- The portrait loads and crops without obscuring the subject.
- Keyboard focus, color contrast, and reduced-motion behavior are present.
- The project can be served as static files with no build command.
