import Bind from './bind.js'

export default class Signal {
  /**
   * Create a Signal emitter for single events
   * @param {Object} [options] - Configuration options
   * @param {boolean} [options.memorable=false] - Remember arguments from last emission. Auto-enables late
   * @param {boolean} [options.prioritized=false] - Sort listeners by priority (higher executes first)
   * @param {boolean} [options.late=memorable] - Execute listeners on past emissions
   * @param {number} [options.timeout=0] - Default timeout for wait() in milliseconds
   */
  constructor ({ memorable = false, prioritized = false, late = memorable, timeout = 0 } = {}) {
    this.binds = []
    this.prioritized = prioritized
    this.memorable = memorable
    this.late = late
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
   * @returns {Promise<any>} - Resolves with first emission argument, rejects with Error on timeout
   */
  wait (timeout = -1) {
    const tio = timeout === -1 ? this.timeout : timeout
    return new Promise((resolve, reject) => {
      const timer = tio ? setTimeout(() => {
        bind.off()
        reject(new Error(`Signal.wait() timed out after ${ tio }ms`))
      }, tio) : null

      const bind = this.once(a => {
        clearTimeout(timer)
        resolve(a)
      })
    })
  }

  /**
   * Subscribe to signal emissions
   * @param {Function} fn - Callback function to execute on emission
   * @param {number} [priority=0] - Execution priority (higher executes first)
   * @return {Bind} - Subscription object with off() method
   */
  on (fn, priority = 0) {
    return this.add(new Bind(fn, this, false, priority))
  }

  /**
   * Subscribe once, auto-unsubscribe after first emission
   * @param {Function} fn - Callback function to execute on emission
   * @param {number} [priority=0] - Execution priority (higher executes first)
   * @return {Bind} - Subscription object with off() method
   */
  once (fn, priority = 0) {
    return this.add(new Bind(fn, this, true, priority))
  }

  /** @private */
  add (bind) {
    const replay = this.late && this.emited
    if (!replay || !bind.once) this.insert(bind)
    if (replay) {
      bind.fired++
      bind.fn(...this.args)
    }
    return bind
  }

  /** @private */
  insert (bind) {
    if (!this.prioritized) return void this.binds.push(bind)
    const { binds } = this
    let lo = 0
    let hi = binds.length
    while (lo < hi) {
      const mid = (lo + hi) >>> 1
      if (binds[mid].priority <= bind.priority) lo = mid + 1
      else hi = mid
    }
    this.binds = binds.toSpliced(lo, 0, bind)
  }

  /**
   * Unsubscribe a specific listener
   * @param {Bind} bind - Bind object returned by on() or once()
   */
  off (bind) {
    const i = this.binds.indexOf(bind)
    if (i !== -1) this.binds = this.binds.toSpliced(i, 1)
  }

  /**
   * Emit signal with any number of arguments
   * @param {...any} args - Arguments to pass to listeners
   */
  emit (...args) {
    const outer = this.stopped
    this.stopped = false
    if (this.memorable) this.args = args
    this.emited++
    const { binds } = this
    let pruned = false
    try {
      for (let i = binds.length; i-- && !this.stopped;) {
        const bind = binds[i]
        if (bind.once) {
          if (bind.fired) continue
          pruned = true
        }
        bind.fired++
        bind.fn(...args)
      }
    } finally {
      this.end(outer, pruned)
    }
  }

  /**
   * Emit signal with possibility to await all listeners executions to finish
   * @param {...any} args - Arguments to pass to listeners
   * @returns {Promise<PromiseSettledResult[]>} - Settles when all called listeners finished running
   */
  async asyncEmit (...args) {
    const outer = this.stopped
    this.stopped = false
    if (this.memorable) this.args = args
    this.emited++
    const { binds } = this
    const results = []
    let pruned = false
    try {
      for (let i = binds.length; i-- && !this.stopped;) {
        const bind = binds[i]
        if (bind.once) {
          if (bind.fired) continue
          pruned = true
        }
        bind.fired++
        try {
          results.push(bind.fn(...args))
        } catch (err) {
          results.push(Promise.reject(err))
        }
      }
    } finally {
      this.end(outer, pruned)
    }
    return Promise.allSettled(results)
  }

  /** @private */
  end (outer, pruned) {
    this.stopped = outer
    if (pruned) this.binds = this.binds.filter(b => !b.once || !b.fired)
  }

  /**
   * Clear stored arguments and emission count (keeps listeners)
   */
  forget () {
    this.args = []
    this.emited = 0
  }

  /**
   * Unsubscribe all binds/listeners
   * @param {boolean} [forget=false] - Also call forget() to clear memory
   */
  wipe (forget = false) {
    this.binds = []
    if (forget) this.forget()
  }

  /**
   * Stop current emission cycle (resets on next emit)
   */
  break () {
    this.stopped = true
  }
}
