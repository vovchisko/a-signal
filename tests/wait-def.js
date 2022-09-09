import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('try wait (def) 200ms', async (success, fail) => {
  const sig = new Signal({timeout: 1000})

  setTimeout(() => sig.emit(), 200)

  try {
    await sig.wait()
    success('.wait() works')
  } catch (err) {
    fail('oh, .wait() failed')
  }

  fail('no signal')
})
