# Games Submenu Design

## Goal

Group Snake and Tetris beneath an accessible Games submenu in the main-page navigation.

## Interaction

- Desktop: Games opens a small off-white dropdown on hover and keyboard focus.
- Mobile: Games is a button that expands and collapses Snake and Tetris inside the open navigation panel.
- Use `aria-expanded` and `aria-controls`; keyboard focus keeps the desktop menu visible.
- No game page, game logic, or game styling changes.
