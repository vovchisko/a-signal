import { test } from 'node:test'
import assert   from 'node:assert/strict'
import Signal   from '../src/signal.js'

test('once calling its own off() does not unbind another listener', () => {
  const sig = new Signal()
  let other = 0
  const bind = sig.once(() => bind.off())
  sig.on(() => other++)
  sig.emit()
  sig.emit()
  assert.equal(other, 2)
})

test('asyncEmit: once calling its own off() does not unbind another listener', async () => {
  const sig = new Signal()
  let other = 0
  const bind = sig.once(() => bind.off())
  sig.on(() => other++)
  await sig.asyncEmit()
  await sig.asyncEmit()
  assert.equal(other, 2)
})

test('removing a pending listener neither skips nor repeats', () => {
  const sig = new Signal()
  const calls = []
  sig.on(() => calls.push('a'))
  const b = sig.on(() => calls.push('b'))
  sig.on(() => { calls.push('c'); b.off() })
  sig.emit()
  assert.deepEqual(calls, ['c', 'b', 'a'])
})

test('removing a later listener does not repeat one', () => {
  const sig = new Signal()
  const calls = []
  const a = sig.on(() => calls.push('a'))
  sig.on(() => calls.push('b'))
  sig.on(() => { calls.push('c'); a.off() })
  sig.emit()
  assert.deepEqual(calls, ['c', 'b', 'a'])
})

test('wipe() during emit finishes the cycle and leaves no binds', () => {
  const sig = new Signal()
  let after = 0
  sig.on(() => after++)
  sig.on(() => sig.wipe())
  sig.emit()
  assert.equal(after, 1)
  assert.equal(sig.binds.length, 0)
})

test('subscribing during emit does not reorder the cycle', () => {
  const sig = new Signal({ prioritized: true })
  const calls = []
  sig.on(() => calls.push('low'), 1)
  sig.on(() => { calls.push('high'); sig.on(() => calls.push('late'), 0) }, 10)
  sig.emit()
  assert.deepEqual(calls, ['high', 'low'])
})

test('once fires once when a listener re-emits the same signal', () => {
  const sig = new Signal()
  let calls = 0
  let depth = 0
  sig.once(() => calls++)
  sig.on(() => { if (!depth++) sig.emit() })
  sig.emit()
  assert.equal(calls, 1)
  assert.equal(sig.binds.length, 1)
})

test('asyncEmit: once fires once when a listener re-emits the same signal', async () => {
  const sig = new Signal()
  let calls = 0
  let depth = 0
  sig.once(() => calls++)
  sig.on(() => { if (!depth++) sig.asyncEmit() })
  await sig.asyncEmit()
  assert.equal(calls, 1)
})

test('throwing once listener is removed', () => {
  const sig = new Signal()
  let calls = 0
  sig.once(() => { calls++; throw new Error('x') })
  assert.throws(() => sig.emit())
  sig.emit()
  assert.equal(calls, 1)
  assert.equal(sig.binds.length, 0)
})
