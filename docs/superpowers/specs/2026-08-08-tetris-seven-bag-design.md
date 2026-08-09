# Tetris Seven-Bag Randomizer Design

- Shuffle the seven tetromino types with Fisher–Yates.
- Consume pieces from the bag and create a new shuffled bag only when needed.
- Keep the three-piece visible queue filled from the bag.
- Accept an injectable random function in `createGame` for deterministic tests.
- Validate that each bag contains exactly one of every tetromino and that spawned pieces refill the preview queue.
