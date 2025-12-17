import Bind from './bind.js'

export default class Signal {
  /**
   * Create a Signal emitter for single events
   * @param {Object} [options] - Configuration options
   * @param {boolean} [options.memorable=false] - Remember arguments from last emission. Auto-enables late
   * @param {boolean} [options.prioritized=false] - Sort listeners by priority (higher executes first)
   * @param {boolean} [options.late=false] - Execute listeners on past emissions
   * @param {number} [options.timeout=0] - Default timeout for wait() in milliseconds
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
   * Extract `on` method as standalone function
   * @return {function(Function, number=): Bind} - Extracted on method
   * @deprecated Use extractOn() instead
   */
  subscriber () {
    return (fn, priority = 0) => this.on(fn, priority)
  }

  /**
   * Extract `on` method as standalone function
   * @return {function(Function, number=): Bind} - Extracted on method
   */
  extractOn () {
    return (fn, priority = 0) => this.on(fn, priority)
  }

  /**
   * Extract `once` method as standalone function
   * @return {function(Function, number=): Bind} - Extracted once method
   */
  extractOnce () {
    return (fn, priority = 0) => this.once(fn, priority)
  }

  /**
   * Extract `emit` method as standalone function
   * @returns {function(...any): void} - Extracted emit method
   */
  extractEmit () {
    return (...args) => this.emit(...args)
  }

  /**
   * Wait for next signal emission as Promise
   * @param {number} [timeout] - Timeout in milliseconds (uses constructor default if not provided)
   * @returns {Promise<any>} - Resolves with first emission argument
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
   * Sort listeners by priority (higher priority executes first)
   * Automatically called when prioritized: true
   * @private
   */
  sort () {
    this.binds.sort((a, b) => a.priority - b.priority)
  }

  /**
   * Subscribe to signal emissions
   * @param {Function} fn - Callback function to execute on emission
   * @param {number} [priority=0] - Execution priority (higher executes first)
   * @return {Bind} - Subscription object with off() method
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
   * Subscribe once, auto-unsubscribe after first emission
   * @param {Function} fn - Callback function to execute on emission
   * @param {number} [priority=0] - Execution priority (higher executes first)
   * @return {Bind} - Subscription object with off() method
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
   * Unsubscribe a specific listener
   * @param {Bind} bind - Bind object returned by on() or once()
   */
  off (bind) {
    const index = this.binds.indexOf(bind)

    if (index !== -1) {
      this.binds.splice(index, 1)
    }
  }

  /**
   * Emit signal with any number of arguments
   * @param {...any} args - Arguments to pass to listeners
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
   * Emit signal with possibility to await all listeners executions to finish
   * @param {...any} args - Arguments to pass to listeners
   * @returns {Promise} - Resolves when all listeners for this signal finished running
   */
  async asyncEmit () {
    this.stopped = false

    let i = this.binds.length

    if (this.memorable) this.args = arguments

    const promises = []
    while (i--) {
      const bind = this.binds[i]
      const result = bind.fn(...arguments)
      promises.push(result)
      bind.fired++
      if (bind.once) this.binds.splice(i, 1)
      if (this.stopped) {
        this.stopped = false
        return
      }
    }

    this.emited++
    return Promise.allSettled(promises)
  }

  /**
   * Clear stored arguments and emission count (keeps listeners)
   */
  forget () {
    this.args.length = 0
    this.emited = 0
  }

  /**
   * Unsubscribe all binds/listeners
   * @param {boolean} [forget=false] - Also call forget() to clear memory
   */
  wipe (forget = false) {
    this.binds.length = 0
    if (forget) this.forget()
  }

  /**
   * Stop current emission cycle (resets on next emit)
   */
  break () {
    this.stopped = true
  }
}
