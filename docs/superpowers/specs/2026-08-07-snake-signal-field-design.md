# Snake Signal Field Design

## Purpose

Make Snake more challenging and dynamic by replacing the single eat-then-respawn item with a timed field of simultaneous good and bad signals.

## Player experience

- The game-over dialog becomes a software-engineering incident alert: a large amber `⚠` warning symbol, eyebrow `ALERT / SECURITY BREACH`, and title **Security breach**. The existing final-score readout and **Try again** / **Game menu** actions remain.
- A new run begins with three randomly placed items.
- The board always contains at least one and no more than ten items.
- Items independently remain for approximately 5–10 seconds, then disappear. New items appear at random board locations roughly every 1–3 seconds while the field is below ten items.
- Good items remain more common than bad items. Eating an item removes only that item; all remaining items persist until eaten or expired.
- Existing good-item growth, bad-item shrink with a minimum length of two, score and speed behavior, wrapping, collision, keyboard input, swipe input, and death overlay controls remain unchanged.

## Full-board start state

The game menu remains an overlay inside the existing full-size game board. The Start button is centered directly on that board—not in a separate or reduced-size menu. The inactive board preview stays visible before play and after returning to Game menu.

## Technical design

- Replace the engine's singular `item` field with an `items` array. Each item stores its coordinate, type, and expiry timestamp.
- The engine accepts an injectable current time for deterministic tests. It removes expired items, replaces the minimum immediately, and schedules one new item at the next random 1–3 second spawn time when capacity permits.
- Item placement rejects cells occupied by the snake or an existing item.
- The UI passes the current wall-clock time to the engine on each tick and renders every active item with the existing mint/amber language.

## Constraints

- Item expiration is based on wall-clock time rather than number of game ticks, so the 5–10 second pacing remains stable as the snake accelerates.
- No additional controls or telemetry are added.
- Keep the full-board Start overlay, responsive canvas sizing, and reduced-motion behavior intact.
- Use the existing amber warning color for the incident symbol and alert label so the alert is high-contrast without introducing a new visual system.

## Verification

- Add deterministic engine tests for initial three-item creation, non-overlapping placement, independent expiry and replenishment, the one-to-ten boundary, and eating one item while preserving others.
- Add static page contracts for the Security breach alert treatment and the existing full-board menu structure.
- Run the full Node test suite, `git diff --check`, and inspect the visible full-board menu plus multiple rendered items.
