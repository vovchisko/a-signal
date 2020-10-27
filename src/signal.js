const Bind = require('./bind')

class Signal {
  constructor() {
    this.binds = []
    this.prioritizable = true
    this.memorable = false
    this.stopped = false
    this.args = []
  }

  sort() {
    this.binds.sort((a, b) => a.priority - b.priority)
  }

  on(fn, priority = 0) {
    const bind = new Bind(fn, this, false, priority)
    this.binds.push(bind)
    if (this.prioritizable) this.sort()
    return bind
  }

  once(fn, priority = 0) {
    const bind = new Bind(fn, this, true, priority)
    this.binds.push(bind)
    if (this.prioritizable) this.sort()
    return bind
  }

  off(bind) {
    const index = this.binds.indexOf(bind)

    if (index !== -1) {
      this.binds.splice(index, 1)
    }
  }

  emit() {
    this.stopped = false

    let i = this.binds.length
    while (i--) {
      const bind = this.binds[i]
      if (this.memorable) this.args = arguments
      if (bind.fn(...arguments) === false) this.stopped = true
      bind.fired++
      if (bind.once) this.binds.splice(i, 1)
      if (this.stopped) {
        this.stopped = false
        return
      }
    }
  }

  wipe() {
    this.binds.length = 0
  }

  break() {
    this.stopped = true
  }
}

module.exports = Signal