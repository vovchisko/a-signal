# Changelog

## 2.3.1

### Fixed
- Listeners can call `off()`, `wipe()` or `on()` during an emission without skipping, repeating or reordering other listeners.
- A `once` listener fires only once when a listener re-emits the same signal.
- `once`, `wait()` and `off()` no longer copy the listener array per call, so emits with many `once` binds stay linear.
- `memorable` enables `late` by default, as documented (`late: false` keeps storing args without replay).
- A `late` `once()` replays the past emission and is not kept subscribed, so `wait()` on a late signal no longer leaks a bind.
- Late replay increments `bind.fired`.
- `forget()` called during an emission no longer strips arguments from the remaining listeners, and `args` is a real array.
- An emission stopped by `break()` still counts for `late`/`memorable`, and a late listener added during an emission receives it.
- `break()` followed by a nested `emit()` of the same signal still stops the outer cycle.
- `asyncEmit()` after `break()` settles the listeners already called instead of returning `undefined` and leaking rejections.
- `asyncEmit()` records a synchronously throwing listener as rejected and still calls the rest.
- A late listener returning `false` no longer stops an unrelated emission in progress.
- `wait()` rejects with an `Error` on timeout.
- `prioritized` subscriptions insert by binary search instead of re-sorting all listeners.
- Fixed broken examples in README and docs, documented `asyncEmit()`, `emited` and equal-priority order.

### Changed
- Tests run on the built-in `node:test` (`npm test`), `test-a-bit` removed; `engines.node` is `>=20`.
