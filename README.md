# a-signal

Tiny declarative alternative for event-emitter. Basically it is event emitter for a single event.

### Setup

```
npm i a-signal -s
```

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

### Extra-sugar

In case you're lazy to type `.on()` all the time, or just don't want to expose signal itself - you can extract subscriber
method like this:

```JavaScript
const sig = new Signal()

const obj = {
  sugared: sig.subscriber()
}

obj.sugared(() => console.log('sugar!'))

sig.emit()
```
> this trick might be improved in observeble future.

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
sig.prioritized = true

sig.on(() => { console.log('regular pew')})
sig.on(() => { console.log('prioritized pew')}, 100)

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

Another ancient way to stop by returning false inside a listener function.

```JavaScript
sig.on(() => {
  console.log('boomer`s way to stop!')
  return false
}, 100)

sig.on(() => { console.log('will never happen') })

sig.emit()
```

### Late listeners

Let's say you need to call listener when some job has been done. But, it's already done and will never trigger the signal,
right? No worries! We can ask signal to fire instantly if it was emitted before late listener.

```JavaSCript
const late = new Signal({ late: true })
memlate.on(() => { console.log('subscribed before') })

// job is done here and it will never emit again
late.emit()

// immediate fire even if it was called before
late.on(() => { console.log('late fire with no args') })
```

If you need to get th same arguments - add `memorable` flag.

```JavaSCript
const memlate = new Signal({ late: true, memorable: true })

memlate.on(() => { console.log('subscribed before') })
memlate.emit('first')

// immediate fire even if it was called before, even with the same arguments
memlate.on((args) => { console.log('late fire with previous args:', args) })
````

> _**NOTE**: Arguments from last emit remains inside the signal - **use it with caution**!_

### Remove all listeners

```JavaScript
sig.wipe()
```

#### todo:

- Optimize emit call to different arguments length.
- More examples
