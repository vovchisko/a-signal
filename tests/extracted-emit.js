import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('extracted .emit()', async (success, fail) => {
  const sig = new Signal()

  let calls = 0

  const emit = sig.extractEmit()

  sig.on(() => calls++)

  emit()
  emit()
  emit()

  calls === 3
      ? success('sugar fired 3 times')
      : fail('sugar fired ' + calls + ' times instead of 3')

  fail('no signal')
})
