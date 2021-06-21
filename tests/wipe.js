import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('wipe', async (success, fail) => {
  const sig = new Signal()

  sig.on(() => {
    fail('should not fire 1')
  })

  sig.on(() => {
    fail('should not fire 2')
  })

  sig.wipe()
  sig.emit()

  success('wiped')
})
