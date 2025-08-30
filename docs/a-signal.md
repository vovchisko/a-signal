# a-signal Documentation

A lightweight signal/event emitter for single events. Each signal instance handles one event type with advanced features for modern JavaScript applications.


## Quick Start

```bash
npm install a-signal
```

```javascript
import Signal from 'a-signal'

const signal = new Signal()
signal.on(data => console.log(data))
signal.emit('Hello World!')  // logs: Hello World!
```


## Key Features

- **Single event focus** - One signal per event type
- **Late subscriber support** - Get events that happened before subscription  
- **Memory mode** - Remember emission arguments for late subscribers
- **Priority execution** - Control listener execution order
- **Promise integration** - Await signal emissions with timeout
- **Method extraction** - Create clean APIs by extracting methods
- **Emission control** - Stop propagation mid-cycle

## Documentation

- **[Basic Usage](./a-signal.basic.md)** - Import, create, subscribe, unsubscribe
- **[Late](./a-signal.late.md)** - Handle events before subscription
- **[Memorable](./a-signal.memorable.md)** - Remember emission arguments  
- **[Promises](./a-signal.promises.md)** - Await signal emissions
- **[Extracts](./a-signal.extracts.md)** - Create clean APIs with method extraction
- **[Ordered](./a-signal.ordered.md)** - Priority execution and emission control

## API Reference

### Signal Constructor

```javascript
new Signal(options?)
```

**Options:**
- `memorable: boolean` - Remember last emission arguments. Auto-enables `late`. Default: `false`
- `prioritized: boolean` - Sort listeners by priority. Default: `false`
- `late: boolean` - Execute listeners on past emissions. Default: `false`
- `timeout: number` - Default timeout for `wait()` in milliseconds. Default: `0`

### Methods

**Subscription:**
- `on(handler, priority?)` → `Bind` - Subscribe to emissions
- `once(handler, priority?)` → `Bind` - Subscribe once, auto-unsubscribe
- `off(bind)` - Unsubscribe specific listener

**Emission:**
- `emit(...args)` - Emit signal with arguments
- `break()` - Stop current emission cycle

**Async:**
- `wait(timeout?)` → `Promise` - Wait for next emission

**Extraction:**
- `extractOn()` → `Function` - Extract `on` method
- `extractOnce()` → `Function` - Extract `once` method  
- `extractEmit()` → `Function` - Extract `emit` method

**Memory:**
- `forget()` - Clear stored arguments and emission count
- `wipe(forget?)` - Unsubscribe all binds/listeners. If `forget: true`, also calls `forget()`

**Properties:**
- `args: Array` - Stored arguments from last emission (if memorable)

### Bind Object

Returned by `on()` and `once()`:
- `off()` - Unsubscribe from signal
- `fired: number` - Times this handler was called
- `priority: number` - Execution priority
- `fn: Function` - The handler function
- `signal: Signal` - Reference to parent signal
- `once: boolean` - Whether it's a one-time listener

## Quick Examples

### State Management
```javascript
const userSignal = new Signal({ memorable: true })

// Set initial state
userSignal.emit(null)

// Later components get current state immediately
userSignal.on(user => {
    if (user) showProfile(user)
    else showLogin()
})
```

### Entity Composition
```javascript
class MagicBox {
    constructor() {
        this.readySignal = new Signal({ memorable: true })
    }
    
    // Clean public API
    ready = this.readySignal.extractOn()
}

const box = new MagicBox()
box.ready(isReady => console.log('Ready!'))
```

### Async Coordination
```javascript
const signal = new Signal({ timeout: 5000 })

// Wait with timeout
try {
    const result = await signal.wait()
    console.log('Got:', result)
} catch {
    console.log('Timeout')
}
```
