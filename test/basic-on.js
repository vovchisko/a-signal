import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('sig.on() and sig()', async (success, fail) => {
  const sig = new Signal()

  let count = 0

  const count_signals = () => {
    count++
    if (count === 2) success('both works')
  }

  sig.on(count_signals)
  sig(count_signals)

  sig.emit()
})
