import { test } from 'node:test'
import assert   from 'node:assert/strict'
import Signal   from '../src/signal.js'

test('emit calls listener', () => {
  const sig = new Signal()
  let calls = 0
  sig.on(() => calls++)
  sig.emit()
  assert.equal(calls, 1)
})

test('emit passes arguments', () => {
  const sig = new Signal()
  let got
  sig.on((...args) => got = args)
  sig.emit('1', 2)
  assert.deepEqual(got, ['1', 2])
})

test('listeners run last added first', () => {
  const sig = new Signal()
  const calls = []
  sig.on(() => calls.push('a'))
  sig.on(() => calls.push('b'))
  sig.emit()
  assert.deepEqual(calls, ['b', 'a'])
})

test('once fires once', () => {
  const sig = new Signal({ late: true })
  let calls = 0
  sig.once(() => calls++)
  sig.emit()
  sig.emit()
  sig.emit()
  assert.equal(calls, 1)
  assert.equal(sig.binds.length, 0)
})

test('bind.off() unsubscribes', () => {
  const sig = new Signal()
  let calls = 0
  const bind = sig.on(() => calls++)
  bind.off()
  sig.emit()
  assert.equal(calls, 0)
})

test('off() of unknown bind is a no-op', () => {
  const sig = new Signal()
  const other = new Signal()
  sig.on(() => {})
  sig.off(other.on(() => {}))
  assert.equal(sig.binds.length, 1)
})

test('wipe() unsubscribes all', () => {
  const sig = new Signal()
  let calls = 0
  sig.on(() => calls++)
  sig.on(() => calls++)
  sig.wipe()
  sig.emit()
  assert.equal(calls, 0)
})

test('bind.fired counts calls', () => {
  const sig = new Signal()
  const bind = sig.on(() => {})
  sig.emit()
  sig.emit()
  assert.equal(bind.fired, 2)
})

test('nested emissions of different signals', () => {
  const outer = new Signal()
  const inner = new Signal()
  const deepest = new Signal()
  const sequence = []
  outer.on(() => { sequence.push('outer'); inner.emit() })
  inner.on(() => { sequence.push('inner'); deepest.emit() })
  deepest.on(() => sequence.push('deepest'))
  outer.emit()
  assert.deepEqual(sequence, ['outer', 'inner', 'deepest'])
})
