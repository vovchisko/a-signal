/**
 * Represents a subscription to a Signal
 */
export default class Bind {
  /**
   * Create a Signal subscription
   * @param {Function} fn - Handler function
   * @param {Signal} signal - Parent Signal instance
   * @param {boolean} [once=false] - Whether to auto-unsubscribe after first execution
   * @param {number} priority - Execution priority
   */
  constructor (fn, signal, once = false, priority) {
    /** @type {Function} Handler function */
    this.fn = fn
    /** @type {Signal} Parent Signal instance */
    this.signal = signal
    /** @type {boolean} Whether to auto-unsubscribe after first execution */
    this.once = once
    /** @type {number} Number of times this handler has been called */
    this.fired = 0
    /** @type {number} Execution priority (higher executes first) */
    this.priority = priority
  }

  /**
   * Unsubscribe from the signal
   */
  off () {
    this.signal.off(this)
  }
}
