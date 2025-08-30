# a-signal

[![npm version](https://badge.fury.io/js/a-signal.svg)](https://badge.fury.io/js/a-signal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made in Ukraine](https://img.shields.io/badge/Made%20in%20Ukraine-❤️-0057B7?style=flat&labelColor=005BBB&color=FFD700)](https://x.com/sternenkofund)

A lightweight signal/event emitter for single events. Perfect for state changes, async operations, and event-driven architectures.

## Quick Start

```bash
npm install a-signal
```

```javascript
import Signal from 'a-signal'

const signal = new Signal()
signal.on(data => console.log('Received:', data))
signal.emit('Hello World!')  // logs: Received: Hello World!
```

## Why a-signal?

Unlike traditional event emitters with string-based event names, each signal represents **one specific event type**. This eliminates typos, improves performance, and makes your code more predictable.

```javascript
// Traditional EventEmitter
emitter.on('user-login', handler)  // Prone to typos
emitter.emit('user-login', userData)

// With a-signal
const loginSignal = new Signal()    // Type-safe, focused
loginSignal.on(handler)
loginSignal.emit(userData)
```

## Key Features

✨ **State Management** - Late subscribers get missed events
```javascript
const userSignal = new Signal({ memorable: true })
userSignal.emit(currentUser)  // Set initial state
userSignal.on(user => updateUI(user))  // Gets current user immediately
```

⚡ **Promisified events** - Convert events to async/await
```javascript
const signal = new Signal({ timeout: 5000 })
const result = await signal.wait()  // Wait for next emission
```

🔗 **Clean APIs** - Extract methods for composition
```javascript
class MagicBox {
    ready = new Signal({ memorable: true }).extractOn()
}
await new Promise(resolve => box.ready(resolve))
```

🎯 **Priority Control** - Order execution and stop propagation
```javascript
const signal = new Signal({ prioritized: true })
signal.on(() => signal.break(), 100)  // High priority can stop others
```

## Documentation

See [documentation](./docs/a-signal.md) for comprehensive documentation:

- **[Getting Started](./docs/a-signal.md)** - Main documentation, API reference and examples
- **[Basic Usage](./docs/a-signal.basic.md)** - Import, create, subscribe, unsubscribe
- **[Late](./docs/a-signal.late.md)** - Handle events before subscription
- **[Memorable](./docs/a-signal.memorable.md)** - Remember emission arguments
- **[Promises](./docs/a-signal.promises.md)** - Await signal emissions
- **[Extracts](./docs/a-signal.extracts.md)** - Create clean APIs with method extraction
- **[Ordered](./docs/a-signal.ordered.md)** - Priority execution and emission control

## License

[MIT License](LICENSE) - Do whatever you like.

---

With love ❤️ from Ukraine 🇺🇦
