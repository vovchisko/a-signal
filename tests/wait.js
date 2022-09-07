import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('try wait 200ms', async (success, fail) => {
  const sig = new Signal()

  setTimeout(() => sig.emit(), 200)

  try {
    await sig.wait()
    success('.wait() works')
  } catch (err) {
    fail('oh, .wait() failed')
  }

  fail('no signal')
})
