import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('wipe', async (success, fail) => {
  const sig = new Signal()

  sig.on(() => {
    fail('should not fire')
  })

  sig.wipe()

  sig.emit()

  success('wiped')
})
