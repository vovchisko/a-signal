import Bind from './bind.js'

export default class Signal {
  /**
   * Create Signal emitter
   * @param {boolean} memorable remember arguments of the last call
   * @param {boolean} prioritized always sort subscribers by priority
   * @param {boolean} late emit signal immediately after subscribe if it was emitted before
   */
  constructor ({ memorable = false, prioritized = false, late = false } = {}) {
    this.binds = []
    this.prioritized = prioritized || false
    this.memorable = memorable || false
    this.late = late || false
    this.stopped = false
    this.args = []
    this.emited = 0
  }

  /**
   * Extra-sugar
   * Extract `on` into separated function. Called w/o arguments will return a signal object.
   * @return {function(function=, number=): Bind}
   */
  subscriber () {
    return (fn, priority = 0) => this.on(fn, priority)
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
   * @param {*} arguments
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


