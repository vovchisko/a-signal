import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('once', async (success, fail) => {
  const sig = new Signal({ late: true })

  let calls = 0

  sig.once(() => calls++)

  sig.emit()
  sig.emit()
  sig.emit()

  calls === 1
      ? success('signal fired once')
      : fail('called ' + calls + ' times instead of 1')

  fail('no signal')
})
