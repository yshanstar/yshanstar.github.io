# Tetris Timing and Impact Design

- Start gravity at 550ms per row and retain the 80ms minimum cap.
- Reduce row-clear flash duration from 220ms to 120ms.
- On every hard drop, apply a mint-white board impact shine for 180ms.
- Respect reduced-motion preferences by suppressing the shine animation.
- Add test coverage for the 550ms starting interval.
