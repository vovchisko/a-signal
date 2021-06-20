import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('basic usage', async (success, fail) => {
  const sig = new Signal()

  sig.on(() => success('signal fired!'))

  sig.emit()
})
