import { test } from 'node:test'
import assert   from 'node:assert/strict'
import Signal   from '../src/signal.js'

test('prioritized: higher priority first', () => {
  const sig = new Signal({ prioritized: true })
  const calls = []
  sig.on(() => calls.push(1), 1)
  sig.on(() => calls.push(0))
  sig.on(() => calls.push(200), 200)
  sig.emit()
  assert.deepEqual(calls, [200, 1, 0])
})

test('break() stops the cycle', () => {
  const sig = new Signal()
  const calls = []
  sig.on(() => calls.push('a'))
  sig.on(() => { calls.push('b'); sig.break() })
  sig.emit()
  assert.deepEqual(calls, ['b'])
})

test('break() resets on next emit', () => {
  const sig = new Signal()
  const calls = []
  let n = 0
  sig.on(() => calls.push('a'))
  sig.on(() => { calls.push('b'); if (!n++) sig.break() })
  sig.emit()
  sig.emit()
  assert.deepEqual(calls, ['b', 'b', 'a'])
})

test('prioritized: equal priorities run last added first', () => {
  const sig = new Signal({ prioritized: true })
  const calls = []
  sig.on(() => calls.push('a'), 5)
  sig.on(() => calls.push('b'), 5)
  sig.on(() => calls.push('top'), 9)
  sig.on(() => calls.push('c'), 5)
  sig.emit()
  assert.deepEqual(calls, ['top', 'c', 'b', 'a'])
})

test('break() before a nested emit still stops the outer cycle', () => {
  const sig = new Signal()
  const calls = []
  let depth = 0
  sig.on(() => calls.push('low'))
  sig.on(() => {
    calls.push('high')
    if (!depth++) { sig.break(); sig.emit() }
  })
  sig.emit()
  assert.deepEqual(calls, ['high', 'high', 'low'])
})
