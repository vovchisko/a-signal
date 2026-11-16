import { test }              from 'node:test'
import assert                from 'node:assert/strict'
import { setTimeout as sleep } from 'node:timers/promises'
import Signal                from '../src/signal.js'

test('asyncEmit() awaits all listeners, rejections included', async () => {
  const sig = new Signal()
  const done = []
  sig.on(async () => { await sleep(10); done.push('a') })
  sig.on(async () => { await sleep(15); throw new Error('nope') })
  sig.on(async () => { await sleep(20); done.push('c') })
  const results = await sig.asyncEmit()
  assert.deepEqual(done.sort(), ['a', 'c'])
  assert.deepEqual(results.map(r => r.status), ['fulfilled', 'rejected', 'fulfilled'])
})

test('asyncEmit() after break() awaits started listeners', async () => {
  const sig = new Signal()
  let done = false
  sig.on(() => sig.break())
  sig.on(async () => { await sleep(10); done = true })
  const results = await sig.asyncEmit()
  assert.ok(done)
  assert.equal(results.length, 2)
})

test('asyncEmit() after break() handles rejections of started listeners', async () => {
  const sig = new Signal()
  sig.on(() => sig.break())
  sig.on(() => Promise.reject(new Error('lost')))
  const results = await sig.asyncEmit()
  assert.equal(results[0].status, 'rejected')
})

test('asyncEmit(): sync throw is settled as rejected and others still run', async () => {
  const sig = new Signal()
  let calls = 0
  sig.on(() => calls++)
  sig.on(() => { throw new Error('sync') })
  const results = await sig.asyncEmit()
  assert.equal(calls, 1)
  assert.deepEqual(results.map(r => r.status), ['rejected', 'fulfilled'])
})
