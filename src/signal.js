import Bind from './bind.js'

export default class Signal {
  /**
   * Create Signal emitter
   * @param {boolean} memorable remember arguments of the last call
   * @param {boolean} prioritized always sort subscribers by priority
   * @param {boolean} late emit signal immediately after subscribe if it was emitted before
   * @param {number} [timeout=0] default timeout for async .wait() sugar
   */
  constructor ({ memorable = false, prioritized = false, late = false, timeout = 0 } = {}) {
    this.binds = []
    this.prioritized = prioritized || false
    this.memorable = memorable || false
    this.late = late || false
    this.stopped = false
    this.timeout = timeout
    this.args = []
    this.emited = 0
  }

  /**
   * Extract `on` into separated function.
   * @return {function(function=, number=): Bind}
   * @deprecated
   */
  subscriber () {
    return (fn, priority = 0) => this.on(fn, priority)
  }

  /**
   * Extract `on` into separated function.
   * @return {function(function=, number=): Bind}
   */
  extractOn () {
    return (fn, priority = 0) => this.on(fn, priority)
  }

  /**
   * Extract `once` into separated function.
   * @return {function(function=, number=): Bind}
   */
  extractOnce () {
    return (fn, priority = 0) => this.once(fn, priority)
  }

  /**
   * Extract `emit` into a separate function
   * @returns {function(...[*]): void}
   */
  extractEmit () {
    return (...args) => this.emit(...args)
  }

  /**
   * Will resolve once when signal emits.
   *
   * @param timeout
   * @returns {Promise<unknown>}
   */
  wait (timeout = -1) {
    const tio = timeout === -1 ? this.timeout : timeout
    return new Promise((resolve, reject) => {
      const _t = tio ? setTimeout(() => {
        sub.off()
        reject()
      }, tio) : null

      const sub = this.once((a) => {
        if (_t) clearInterval(_t)
        resolve(a)
      })
    })
  }

  /**
   * Sort Binds by priority. Automatically called when `prioritized: true`
   */
  sort () {
    this.binds.sort((a, b) => a.priority - b.priority)
  }

  /**
   * Subscribe on the signal.
   * @param {function} fn callback for the signal
   * @param {number} priority priority in the listeners list, triggers `Signal.sort` when `prioritized: true`
   * @return {Bind}
   */
  on (fn, priority = 0) {
    const bind = new Bind(fn, this, false, priority)
    this.binds.push(bind)

    if (this.late && this.emited) {
      if (bind.fn(...this.args) === false) this.stopped = true
    }

    if (this.prioritized) this.sort()
    return bind
  }

  /**
   * Subscribe on the signal to catch signal once.
   * @param {function(function=, number=)} fn callback for the signal
   * @param {number} priority priority in the listeners list, triggers `Signal.sort` when `prioritized: true`
   * @return {Bind}
   */
  once (fn, priority = 0) {
    const bind = new Bind(fn, this, true, priority)
    this.binds.push(bind)

    if (this.late && this.emited) {
      if (bind.fn(...this.args) === false) this.stopped = true
    }

    if (this.prioritized) this.sort()
    return bind
  }

  /**
   * Unsubscribe from event by Bind
   * @param {Bind} bind
   */
  off (bind) {
    const index = this.binds.indexOf(bind)

    if (index !== -1) {
      this.binds.splice(index, 1)
    }
  }

  /**
   * Emit signal with any arguments
   * @param {...[*]} arguments
   */
  emit () {
    this.stopped = false

    let i = this.binds.length

    if (this.memorable) this.args = arguments

    while (i--) {
      const bind = this.binds[i]
      bind.fn(...arguments)
      bind.fired++
      if (bind.once) this.binds.splice(i, 1)
      if (this.stopped) {
        this.stopped = false
        return
      }
    }

    this.emited++
  }

  /**
   * Forget previous calls and memory
   */
  forget () {
    this.args.length = 0
    this.emited = 0
  }

  /**
   * Unsubscribe all
   * @param {boolean} with_flush
   */
  wipe (with_flush = false) {
    this.binds.length = 0
    if (with_flush) this.forget()
  }

  /**
   * Cause signal to stop emitting on the current cycle.
   * Will turn to false again on next emit() call.
   */
  break () {
    this.stopped = true
  }
}


