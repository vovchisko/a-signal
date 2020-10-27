class Bind {
  constructor (fn, signal, once = false, priority) {
    this.fn = fn
    this.signal = signal
    this.once = once
    this.fired = 0
    this.priority = priority
  }

  off () {
    this.signal.off(this)
  }
}

module.exports = Bind