import { runner } from 'test-a-bit'

runner([
  { script: './tests/bm-basic.js', timeout: 10000 },
  { script: './tests/bm-extracted.js', timeout: 10000 },
  { script: './tests/basic.js' },
  { script: './tests/once.js' },
  { script: './tests/extracted-on.js' },
  { script: './tests/arguments.js' },
  { script: './tests/late.js' },
  { script: './tests/late-memory.js' },
  { script: './tests/wipe.js' },
  { script: './tests/break.js' },
  { script: './tests/break-alt.js' },
  { script: './tests/bind-off.js' },
  { script: './tests/prioritized.js' },
]).then(result => console.log('bye'))


// todo: finish the rest of tests
/*
 import Signal from './index.js'

 const sig = new Signal()

 console.log()
 console.log('generic tests')

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
 sig.prioritized = true

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

 console.log()
 console.log('\n', 'prioritized stop')
 sig.on(() => {
 console.log('boomer`s way to stop!')
 return false
 }, 100)
 sig.on(() => { console.log('will never happen') })
 sig.emit()

 console.log()
 console.log('late w/o memory')
 const late = new Signal({ late: true })
 late.on(() => { console.log('will happen once') })
 late.emit('first')
 // immediate fire even if it was called before
 late.on((args) => { console.log('late fire with no args:', args) })

 console.log()
 console.log('\n', 'late with memory')
 const memlate = new Signal({ late: true, memorable: true })
 memlate.on(() => { console.log('will happen once') })
 memlate.emit('first')
 // immediate fire even if it was called before with the same args
 memlate.on((args) => { console.log('late fire with previous args:', args) })
 */
