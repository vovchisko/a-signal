const Signal = require('.')

const sig = new Signal()

sig.on((a, b) => {
  console.log('fire!', a, b)
})

// console: fire! any arguments
sig.emit('any', 'arguments')

sig.wipe()
// return Bind object
const bind = sig.on(() => console.log('pew!'))

sig.emit() // console: pew!
bind.off() // unsubscribe
sig.emit() // nothing

sig.wipe()

// sorting
sig.prioritizable = true

sig.on(() => { console.log('regular pew') })
sig.on(() => { console.log('prioritized pew')}, 100)

sig.emit()
// output:
//   prioritized pew
//   regular pew

sig.on(() => {
  console.log('okay, stop!')
  sig.break()
}, 100)

sig.on(() => { console.log('will never happen') })

sig.emit()

sig.wipe()

sig.on(() => {
  console.log('boomer`s way to stop!')
  return false
}, 100)

sig.on(() => { console.log('will never happen') })

sig.emit()
