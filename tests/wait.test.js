import { test } from 'node:test'
import assert   from 'node:assert/strict'
import Signal   from '../src/signal.js'

test('wait() resolves with first argument', async () => {
  const sig = new Signal()
  setTimeout(() => sig.emit('a', 'b'), 10)
  assert.equal(await sig.wait(), 'a')
})

test('wait(timeout) rejects and unsubscribes', async () => {
  const sig = new Signal()
  await assert.rejects(sig.wait(10))
  assert.equal(sig.binds.length, 0)
})

test('default timeout rejects', async () => {
  const sig = new Signal({ timeout: 10 })
  await assert.rejects(sig.wait())
})

test('default timeout resolves in time', async () => {
  const sig = new Signal({ timeout: 100 })
  setTimeout(() => sig.emit('x'), 10)
  assert.equal(await sig.wait(), 'x')
})

test('wait(0) overrides default timeout', async () => {
  const sig = new Signal({ timeout: 10 })
  setTimeout(() => sig.emit('x'), 30)
  assert.equal(await sig.wait(0), 'x')
})

test('wait() timeout rejects with an Error', async () => {
  const sig = new Signal()
  await assert.rejects(sig.wait(10), Error)
})

test('wait() on a memorable signal resolves at once and leaves no bind', async () => {
  const sig = new Signal({ memorable: true })
  sig.emit('ready')
  assert.equal(await sig.wait(50), 'ready')
  assert.equal(sig.binds.length, 0)
})
