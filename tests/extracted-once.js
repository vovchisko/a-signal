import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('extracted .once()', async (success, fail) => {
  const sig = new Signal()

  let calls = 0

  const sugared = sig.extractOnce()

  sugared(() => calls++)

  sig.emit()
  sig.emit()
  sig.emit()

  calls === 1
      ? success('sugar fired once')
      : fail('sugar fired ' + calls + ' times instead of 1')

  fail('no signal')
})
