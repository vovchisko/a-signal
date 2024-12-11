# a-signal

A lightweight, feature-rich signal/event emitter for single events. Perfect for handling state changes, async operations, and event-driven architectures.

## Installation

```bash
npm install a-signal
```

## Features

Unlike typical event emitters that handle multiple named events, a-signal provides specialized features:

- **Single Event Focus**: Each signal instance is a dedicated event channel
- **Priority-based Listeners**: Control execution order with numeric priorities (higher executes first)
- **Late Listener Support**: Catch events that happened before subscription
- **Memory Mode**: Remember exact arguments for late subscribers
- **Promise-based Waiting**: Await next signal emission with optional timeout
- **Emission Control**: Stop event propagation at any point
- **Memory Management**: Clear memory and listeners independently
- **Extractable Methods**: Create clean APIs by extracting methods
- **One-time Listeners**: Auto-unsubscribe after first execution

## Examples

### Basic Usage
Simple subscription and emission - the foundation of signal usage.
```javascript
const signal = new Signal()
signal.on(data => console.log(data))
signal.emit('Hello!')
```

### Priority and Control Flow
Control the order of execution and stop propagation when needed. Useful for middleware-like patterns.
```javascript
const signal = new Signal({ prioritized: true })

// Higher priority executes first
signal.on(() => console.log('Second'), 1)
signal.on(() => console.log('First'), 100)

// Stop propagation
signal.on(() => {
    console.log('Stop here')
    signal.break()
})
```

### State Management
Perfect for handling initialization states and late-joining components. Combines late listeners with memory to ensure consistent state.
```javascript
const signal = new Signal({ 
    late: true,      // Get events that happened before subscribing
    memorable: true  // Remember the arguments too
})

signal.emit('state', { value: 42 })

// Later subscriber still gets the event
signal.on((type, data) => {
    console.log(type, data.value) // 'state', 42
})
```

### Async Operations
Convert event-based code into Promise-based code. Great for handling timeouts and async flows.
```javascript
const signal = new Signal({ timeout: 5000 })

// Wait for next emission
try {
    const value = await signal.wait()
    console.log('Got:', value)
} catch {
    console.log('Timeout')
}
```

### Clean APIs

Simple extraction:
Create minimal, focused APIs by extracting just the methods you need.
```javascript
const signal = new Signal()

// Extract methods to create a clean interface
const { emit, on } = {
    emit: signal.extractEmit(),
    on: signal.extractOn()
}

// Clean usage
on(data => console.log(data))
emit('Hello!')
```

With full type documentation:
For larger applications, create well-documented, type-safe APIs with extracted methods.
```javascript
class UserAPI {
    /** @type {Signal<[string, {id: number, name: string}]>} */
    #signal = new Signal()

    constructor() {
        /**
         * Emit user events
         * @param {string} event - Event type ('login'|'logout'|'update')
         * @param {{id: number, name: string}} user - User data
         * @returns {void}
         */
        this.emit = this.#signal.extractEmit()

        /**
         * Subscribe to user events
         * @param {(event: string, user: {id: number, name: string}) => void} handler
         * @returns {{ off: () => void }} Subscription handle
         */
        this.on = this.#signal.extractOn()
    }
}

// Usage remains type-safe
const api = new UserAPI()
api.on((event, user) => console.log(`${event}: ${user.name}`))
api.emit('login', { id: 1, name: 'John' })
```

### Memory Management
Control signal's memory and subscription lifecycle. Useful for cleanup and managing long-living signals.
```javascript
// Clear memory but keep listeners
signal.forget()

// Remove listeners but keep memory
signal.wipe()

// Clear everything
signal.wipe(true)
```

## TypeScript Support

```typescript
const signal = new Signal<string>()
signal.on((data: string) => console.log(data))

// Multiple arguments
const multiSignal = new Signal<[number, string]>()
multiSignal.on((num, str) => console.log(num, str))
```

## License

[MIT License](LICENSE) - Volodymyr Ishchenko - feel free to use this project commercially.

---

With love ❤️ from Ukraine 🇺🇦