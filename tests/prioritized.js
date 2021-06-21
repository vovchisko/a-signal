import { execute } from 'test-a-bit'
import Signal      from '../src/signal.js'

execute('bind off', async (success, fail) => {
  const sig = new Signal({ prioritized: true })

  const hits = []

  sig.on(() => {
    hits.push(1)
  }, 1)

  sig.on(() => {
    hits.push(0)
  })

  sig.on(() => {
    hits.push(200)
  }, 200)

  sig.emit()

  hits[0] === 200 && hits[1] === 1 && hits[2] === 0
      ? success('correct order: ' + hits.toString())
      : fail('incorrect order: ' + hits.toString())
})
