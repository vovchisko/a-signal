import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('break', async (success, fail) => {
  const sig = new Signal()

  sig.on(() => fail('breaks not working'))
  sig.on(() => {
    sig.break()
    setTimeout(() => {success('break working')}, 1)
  })

  sig.emit()
})
