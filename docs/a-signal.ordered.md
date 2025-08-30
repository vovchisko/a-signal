# Ordered

Control listener execution order with priorities and stop emission flow with `break()`.

## Priority Execution

Enable `prioritized: true` to control listener execution order:

```javascript
const signal = new Signal({ prioritized: true })

signal.on(() => console.log('Third (priority 0)'), 0)
signal.on(() => console.log('First (priority 100)'), 100)
signal.on(() => console.log('Second (priority 50)'), 50)

signal.emit()
// logs: First (priority 100)
// logs: Second (priority 50)  
// logs: Third (priority 0)
```

Higher numbers execute first. Default priority is 0.

## Emission Control

Use `break()` to stop emission propagation:

```javascript
const signal = new Signal({ prioritized: true })

signal.on(() => {
    console.log('Always first - stopping here')
    signal.break()
}, 100)

signal.on(() => console.log('Never runs'), 0)

signal.emit()  // logs: Always first - stopping here
```

`break()` resets on next `emit()` call.

## Related

- [Basic](./a-signal.basic.md) - Core signal operations
- [Extracts](./a-signal.extracts.md) - Create clean APIs
- [Promises](./a-signal.promises.md) - Await signal emissions