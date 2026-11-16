import { test } from 'node:test'
import assert   from 'node:assert/strict'
import Signal   from '../src/signal.js'

test('extractOn()', () => {
  const sig = new Signal()
  let calls = 0
  sig.extractOn()(() => calls++)
  sig.emit()
  assert.equal(calls, 1)
})

test('extractOnce()', () => {
  const sig = new Signal()
  let calls = 0
  sig.extractOnce()(() => calls++)
  sig.emit()
  sig.emit()
  sig.emit()
  assert.equal(calls, 1)
})

test('extractEmit()', () => {
  const sig = new Signal()
  let got
  sig.on((...args) => got = args)
  sig.extractEmit()('a', 1)
  assert.deepEqual(got, ['a', 1])
})

test('all extracted together', () => {
  const sig = new Signal()
  let calls = 0
  const emit = sig.extractEmit()
  sig.extractOn()(() => calls++)
  sig.extractOnce()(() => calls++)
  emit()
  emit()
  emit()
  assert.equal(calls, 4)
})

test('extracted on/once/subscriber pass priority', () => {
  const sig = new Signal({ prioritized: true })
  const calls = []
  sig.extractOn()(() => calls.push('on'), 1)
  sig.extractOnce()(() => calls.push('once'), 3)
  sig.subscriber()(() => calls.push('subscriber'), 2)
  sig.emit()
  assert.deepEqual(calls, ['once', 'subscriber', 'on'])
})
