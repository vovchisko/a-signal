import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('bind off', async (success, fail) => {
  const sig = new Signal()

  const bind = sig.on(() => {
    fail('should not fire')
  })

  bind.off()

  sig.emit()

  setTimeout(() => {success('off working')}, 1)
})
