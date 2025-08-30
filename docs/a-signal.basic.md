# Basic Usage

Core signal operations: import, create, subscribe, unsubscribe.

## Import and Create

```javascript
import Signal from 'a-signal'

const signal = new Signal()
```

## Subscribe and Emit

```javascript
const bind = signal.on(message => console.log('Got:', message))
signal.emit('Hello!')  // logs: Got: Hello!
```

## Multiple Arguments

```javascript
signal.on((event, data, timestamp) => {
    console.log(`${event}: ${data.name} at ${timestamp}`)
})

signal.emit('login', { name: 'Alice' }, Date.now())
// logs: login: Alice at 1640995200000
```

## Multiple Listeners

Listeners execute in reverse order (last added first):

```javascript
signal.on(data => console.log('First added'))
signal.on(data => console.log('Second added'))

signal.emit('test')
// logs: Second added
// logs: First added
```

## One-time Listeners

Use `once()` to automatically unsubscribe after first execution:

```javascript
signal.once(data => console.log('Only once:', data))
signal.on(data => console.log('Every time:', data))

signal.emit('first')   // logs both
signal.emit('second')  // logs only "Every time"
```

## Unsubscribing

Both `on()` and `once()` return a bind object with `off()` method:

```javascript
const bind = signal.on(data => console.log(data))

signal.emit('before')  // logs: before
bind.off()             // or signal.off(bind)
signal.emit('after')   // (nothing logged)
```


## Related

- [Late](./a-signal.late.md) - Handle events before subscription
- [Memorable](./a-signal.memorable.md) - Remember emission arguments  
- [Promises](./a-signal.promises.md) - Await signal emissions
- [Extracts](./a-signal.extracts.md) - Create clean APIs