import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('extracted .on()', async (success, fail) => {
  const sig = new Signal()

  const sugared = sig.subscriber()

  sugared(() => success('signal fired'))

  sig.emit()

  fail('no signal')
})
