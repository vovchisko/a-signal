# Memorable

Remember emission arguments for late subscribers. Automatically enables `late: true`.

## Why Memorable?

Late subscribers need the actual data, not just notification that an event occurred. Memorable preserves the exact arguments from the last emission.

```javascript
const signal = new Signal({ memorable: true })

// Emit with data
signal.emit('user-login', { id: 1, name: 'Alice' }, Date.now())

// Late subscriber gets all the arguments
signal.on((event, user, timestamp) => {
    console.log(`${event}: ${user.name} logged in at ${timestamp}`)
})
// logs: user-login: Alice logged in at 1640995200000
```

## Accessing Arguments

You can access stored arguments directly or through wait():

```javascript
const signal = new Signal({ memorable: true })
signal.emit('ready', { version: '1.0' })

// Direct access
console.log(signal.args)  // ['ready', { version: '1.0' }]

// Through bind
const bind = signal.on(() => {})
console.log(bind.signal.args)  // ['ready', { version: '1.0' }]

// Through wait (gets first argument only)
const result = await signal.wait()  // 'ready'
```

## Last Emission Only

Memorable only stores the **last emission**:

```javascript
const signal = new Signal({ memorable: true })

signal.emit('loading')
signal.emit('ready', { version: '1.0' })
signal.emit('error', 'Connection failed')

signal.on((status, data) => console.log(status, data))  // error Connection failed
```

## Clearing Memory

- **`forget()`** - Clears stored arguments, keeps listeners
- **`wipe()`** - Removes listeners, keeps arguments  
- **`wipe(true)`** - Removes listeners AND clears arguments

```javascript
const signal = new Signal({ memorable: true })
signal.emit('data', { important: true })

signal.forget()  // Clear args
console.log(signal.args)  // []

signal.wipe(true)  // Clear everything
```

## Related

- [Basic](./a-signal.basic.md) - Core signal operations
- [Late](./a-signal.late.md) - Handle events before subscription  
- [Promises](./a-signal.promises.md) - Await signal emissions