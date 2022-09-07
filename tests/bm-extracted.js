import { execute }                                                     from 'test-a-bit'
import Signal                                                          from '../src/signal.js'
import { BENCH_EMITS_PER_SIG, BENCH_LISTENERS_PER_SIG, BENCH_SIGNALS } from './_setup.js'

execute('bench extracted .on()', async (success, fail) => {
  const sigs = []
  const listeners = []

  let hits = 0

  let _s = null
  let emits = 0

  for (let i = 0; i < BENCH_SIGNALS; i++) {
    _s = new Signal()
    const _sub = _s.extractOn()
    for (let j = 0; j < BENCH_LISTENERS_PER_SIG; j++) {
      listeners.push(_sub(() => hits++))
    }
    sigs.push(_s)
  }

  for (let em = 0; em < BENCH_EMITS_PER_SIG; em++) {
    sigs.forEach(s => s.emit(++emits))
  }

  listeners.forEach(l => l.off())

  hits === BENCH_SIGNALS * BENCH_LISTENERS_PER_SIG * BENCH_EMITS_PER_SIG
      ? success('s:' + sigs.length + ', e:' + emits + ', h:' + hits)
      : fail('s:' + sigs.length + ', e:' + emits + ', h:' + hits)
})
