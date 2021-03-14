const Bind = require('./bind')

class Signal {
  constructor ({ memorable = false, prioritized = false, late = false } = {}) {
    this.binds = []
    this.prioritized = prioritized || false
    this.memorable = memorable || false
    this.late = late || false
    this.stopped = false
    this.args = []
    this.emited = 0
  }

  sort () {
    this.binds.sort((a, b) => a.priority - b.priority)
  }

  on (fn, priority = 0) {
    const bind = new Bind(fn, this, false, priority)
    this.binds.push(bind)

    if (this.late && this.emited) {
      if (bind.fn(...this.args) === false) this.stopped = true
    }

    if (this.prioritized) this.sort()
    return bind
  }

  once (fn, priority = 0) {
    const bind = new Bind(fn, this, true, priority)
    this.binds.push(bind)

    if (this.late && this.emited) {
      if (bind.fn(...this.args) === false) this.stopped = true
    }

    if (this.prioritized) this.sort()
    return bind
  }

  off (bind) {
    const index = this.binds.indexOf(bind)

    if (index !== -1) {
      this.binds.splice(index, 1)
    }
  }

  emit () {
    this.stopped = false

    let i = this.binds.length

    if (this.memorable) this.args = arguments

    while (i--) {
      const bind = this.binds[i]
      if (bind.fn(...arguments) === false) this.stopped = true
      bind.fired++
      if (bind.once) this.binds.splice(i, 1)
      if (this.stopped) {
        this.stopped = false
        return
      }
    }

    this.emited++
  }

  wipe () {
    this.binds.length = 0
  }

  break () {
    this.stopped = true
  }
}

module.exports = Signal
