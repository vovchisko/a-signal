import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('late event', async (success, fail) => {
  const sig = new Signal({ late: true })

  sig.emit()

  sig.on(() => success('signal fired'))

  fail('no signal')
})
