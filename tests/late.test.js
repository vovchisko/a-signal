import { test } from 'node:test'
import assert   from 'node:assert/strict'
import Signal   from '../src/signal.js'

test('late: subscriber gets past emission', () => {
  const sig = new Signal({ late: true })
  sig.emit()
  let calls = 0
  sig.on(() => calls++)
  assert.equal(calls, 1)
})

test('late + memorable: subscriber gets past arguments', () => {
  const sig = new Signal({ late: true, memorable: true })
  sig.emit('meaning', 42)
  let got
  sig.on((...args) => got = args)
  assert.deepEqual(got, ['meaning', 42])
})

test('memorable keeps only the last emission', () => {
  const sig = new Signal({ late: true, memorable: true })
  sig.emit('loading')
  sig.emit('error', 'Connection failed')
  let got
  sig.on((...args) => got = args)
  assert.deepEqual(got, ['error', 'Connection failed'])
})

test('forget() clears emission history', () => {
  const sig = new Signal({ late: true, memorable: true })
  sig.emit('meaning', 42)
  sig.forget()
  let calls = 0
  sig.on(() => calls++)
  assert.equal(calls, 0)
  assert.equal(sig.emited, 0)
  assert.equal(sig.args.length, 0)
})

test('wipe() keeps history, wipe(true) clears it', () => {
  const sig = new Signal({ late: true })
  sig.emit()
  sig.wipe()
  let calls = 0
  sig.on(() => calls++)
  assert.equal(calls, 1)
  sig.wipe(true)
  sig.on(() => calls++)
  assert.equal(calls, 1)
})

test('memorable enables late by default', () => {
  const sig = new Signal({ memorable: true })
  sig.emit('u')
  let got
  sig.on(x => got = x)
  assert.equal(got, 'u')
})

test('memorable with late: false only stores args', () => {
  const sig = new Signal({ memorable: true, late: false })
  sig.emit('u')
  let calls = 0
  sig.on(() => calls++)
  assert.equal(calls, 0)
  assert.deepEqual(sig.args, ['u'])
})

test('late once fires once and is not kept', () => {
  const sig = new Signal({ late: true })
  sig.emit()
  let calls = 0
  const bind = sig.once(() => calls++)
  sig.emit()
  sig.emit()
  assert.equal(calls, 1)
  assert.equal(bind.fired, 1)
  assert.equal(sig.binds.length, 0)
})

test('late replay counts bind.fired', () => {
  const sig = new Signal({ late: true })
  sig.emit()
  assert.equal(sig.on(() => {}).fired, 1)
})

test('late listener returning false does not stop a running emit', () => {
  const sig = new Signal({ late: true })
  sig.emit()
  const calls = []
  sig.on(() => calls.push('a'))
  sig.on(() => { calls.push('b'); sig.on(() => false) })
  calls.length = 0
  sig.emit()
  assert.deepEqual(calls, ['b', 'a'])
})

test('forget() during emit keeps args for remaining listeners', () => {
  const sig = new Signal({ memorable: true })
  const got = []
  sig.on(x => got.push(x))
  sig.on(() => sig.forget())
  sig.on(x => got.push(x))
  sig.emit(7)
  assert.deepEqual(got, [7, 7])
})

test('args is an array and forget() does not mutate it in place', () => {
  const sig = new Signal({ memorable: true })
  sig.emit('v')
  const saved = sig.args
  assert.ok(Array.isArray(saved))
  sig.forget()
  assert.deepEqual(saved, ['v'])
  assert.deepEqual(sig.args, [])
})

test('emission stopped by break() still counts for late', () => {
  const sig = new Signal({ memorable: true })
  sig.on(() => sig.break())
  sig.emit('x')
  let got
  sig.on(x => got = x)
  assert.equal(got, 'x')
})

test('late subscriber added during the first emission gets it', () => {
  const sig = new Signal({ memorable: true })
  let got
  sig.on(() => sig.on(x => got = x))
  sig.emit('first')
  assert.equal(got, 'first')
})
