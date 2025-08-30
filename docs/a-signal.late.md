# Late

Handle subscribers that join after events have already been emitted.

## Why Late?

Sometimes events happen before listeners exist. Late execution ensures new subscribers get events that occurred before they subscribed.

```javascript
const signal = new Signal({ late: true })

// Event happens first
signal.emit('app-ready')

// Subscriber joins later but still gets the event
signal.on(() => console.log('I got the ready event!'))
// logs: I got the ready event!
```

Use [memorable](./a-signal.memorable.md) to preserve arguments.

## Clearing Late State  

- **`forget()`** - Clears emission history but keeps all listeners
- **`wipe()`** - Removes all listeners but keeps emission history  
- **`wipe(true)`** - Removes listeners AND clears emission history

```javascript
const signal = new Signal({ late: true })

signal.emit('ready')
signal.on(() => console.log('Listener 1'))  // Gets 'ready' event

signal.forget()
signal.on(() => console.log('Listener 2'))  // Won't get anything

signal.wipe()
signal.on(() => console.log('Listener 3'))  // Still won't get 'ready'

signal.wipe(true)  // Clear everything
```

## Example

App state that components need regardless of load order:

```javascript
class AppState {
    constructor() {
        this.readySignal = new Signal({ late: true })
        this.initialize()
    }
    
    async initialize() {
        await loadConfig()
        await connectDatabase()
        this.readySignal.emit()
    }
    
    onReady = this.readySignal.extractOn()
}

const appState = new AppState()

// Components can subscribe at any time
function HeaderComponent() {
    appState.onReady(() => console.log('Header can now render'))
}
```

## Related

- [Basic](./a-signal.basic.md) - Core signal operations
- [Memorable](./a-signal.memorable.md) - Preserve emission arguments
- [Promises](./a-signal.promises.md) - Await signal emissions