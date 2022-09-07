import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute(`don't wait 200ms`, async (success, fail) => {
  const sig = new Signal()

  setTimeout(() => sig.emit(), 1000)

  try {
    await sig.wait(200)
    fail(`.wait() won't throw err`)
  } catch (err) {
    success(`right, wait can't wait`)
  }

  fail('no signal')
})
