import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('basic arguments', async (success, fail) => {
  const sig = new Signal()

  sig.on((a, b) => {
    a === '1' && b === 2
        ? success('signal fired')
        : fail('invalid arguments')
  })

  sig.emit('1', 2)

  fail('no signal')
})
