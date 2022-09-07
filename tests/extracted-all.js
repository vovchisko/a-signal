import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('extracted all', async (success, fail) => {
  const sig = new Signal()

  let calls = 0

  const emit = sig.extractEmit()
  const on = sig.extractOn()
  const once = sig.extractOnce()

  on(() => calls++)
  once(() => calls++)

  emit()
  emit()
  emit()

  calls === 4
      ? success('sugar fired 4 times')
      : fail('sugar fired ' + calls + ' times instead of 4')

  fail('no signal')
})
