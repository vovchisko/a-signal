# a-signal
Tiny declarative alternative for event-emitter.
Basically it is event emitter for a single event.

### Basic Examples

```JavaScript
const Signal = require('a-signal')

const sig = new Signal()

sig.on((a, b) => {
  console.log('fire!', a, b)
})

// console: fire! any arguments
sig.emit('any', 'arguments')
```

### Unsubscribe

```JavaScript
// return Bind object
const bind = sig.on(() => console.log('pew'))

sig.emit() // console.log('pew')
bind.off() // unsubscribe
sig.emit() // nothing

```

The same effect can be achieved with:
```JavaScript
sig.off(bind)
```

### Listeners priority
Prioritize listeners.
```JavaScript
sig.prioritizable = true

sig.on(()=>{ console.log('regular pew')})
sig.on(()=>{ console.log('prioritized pew')}, 100)

sig.emit()
// output:
//   prioritized pew
//   regular pew
```

### Break
Allows to stop signal propagation for current emit call.
```JavaScript
sig.on(() => {
  console.log('okay, stop!')
  sig.break()
}, 100)

sig.on(() => {
  console.log('will never happen')
})

sig.emit()

// output
//    okay, stop!
```

### Remove all listeners

```JavaScript
sig.wipe()
```

