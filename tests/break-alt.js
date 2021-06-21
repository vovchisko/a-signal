import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('break alt', async (success, fail) => {
  const sig = new Signal()

  sig.on(() => fail('breaks not working'))
  sig.on(() => {
    setTimeout(() => {success('break working')}, 1)
    return false
  })

  sig.emit()
})
