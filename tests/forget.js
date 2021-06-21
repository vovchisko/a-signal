import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('forget', async (success, fail) => {
  const sig = new Signal({ late: true, memorable: true })

  sig.emit('meaning', 42)
  sig.forget()

  sig.on((a, b) => {
    a !== 'meaning' && b !== 42 && sig.emited === 1
        ? fail('amnesia on call')
        : fail('memory still there')
  })

  success('forgotten')
})
