export default class Bind {
  /**
   * @param {function} fn
   * @param {Signal} signal
   * @param {boolean} once
   * @param {number} priority
   */
  constructor (fn, signal, once = false, priority) {
    this.fn = fn
    this.signal = signal
    this.once = once
    this.fired = 0
    this.priority = priority
  }

  /**
   * Remove current bind from the signal.
   */
  off () {
    this.signal.off(this)
  }
}
