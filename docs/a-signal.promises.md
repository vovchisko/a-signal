# Promises

Convert signals to promises with `wait()`. Essentially `once()` that returns emission arguments.

## Basic Wait

`wait()` returns a Promise that resolves on the next emission:

```javascript
const signal = new Signal()

setTimeout(() => signal.emit('Hello!'), 1000)
const result = await signal.wait()  // 'Hello!'
```

## With Timeout

```javascript
const signal = new Signal()

try {
    const result = await signal.wait(2000)  // 2 seconds
    console.log('Got:', result)
} catch {
    console.log('Timeout')
}
```

## Default Timeout

Set default timeout in constructor:

```javascript
const signal = new Signal({ timeout: 5000 })

await signal.wait()        // Uses 5 second default
await signal.wait(1000)    // Override to 1 second
```

## First Argument Only

`wait()` resolves with only the first emission argument:

```javascript
signal.emit('status', { code: 200 }, 'extra')
const result = await signal.wait()  // Only gets 'status'
```

For all arguments, wrap `once()` in a Promise:

```javascript
const [status, data, extra] = await new Promise(resolve => {
    signal.once((...args) => resolve(args))
})
```

## Related

- [Basic](./a-signal.basic.md) - Core signal operations
- [Late](./a-signal.late.md) - Handle events before subscription
- [Memorable](./a-signal.memorable.md) - Remember emission arguments