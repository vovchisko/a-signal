import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('late & memorized', async (success, fail) => {
  const sig = new Signal({ late: true, memorable: true })

  sig.emit('meaning', 42)

  sig.on((a, b) => {
    a === 'meaning' && b === 42
        ? success('fired with "' + a + ' ' + b + '"')
        : fail('invalid memory')
  })

  fail('no signal')
})
