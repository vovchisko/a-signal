import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('await .asyncEmit() with 3 async binds (2 resolve 1 rejects)', async (success, fail) => {
  const sig = new Signal()
  let asyncResult1 = 'no beep :('
  let asyncResult2 = 'no boop :('

  sig.on(async () => {
    await new Promise(resolve => setTimeout(resolve, 100))
    asyncResult1 = 'beep'
  })

  sig.on(async () => {
    await new Promise((resolve, reject) => setTimeout(reject, 150))
  })

  sig.on(async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    asyncResult2 = 'boop'
  })

  await sig.asyncEmit()

  asyncResult1 === 'beep' && asyncResult2 === 'boop'
      ? success('.asyncEmit() works')
      : fail('.asyncEmit() not working')
})
