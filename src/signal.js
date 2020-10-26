const Bind = require('./bind')

class Signal {
  constructor() {
    this.fns = []
    this.prioritizable = true
    this.memorable = false
    this.stopped = false
    this.args = []
  }

  sort() {
    this.fns.sort((a, b) => a.priority - b.priority)
  }

  on(fn, priority = 0) {
    const bind = new Bind(fn, this, false, priority)
    this.fns.push(bind)
    if (this.prioritizable) this.sort()
    return bind
  }

  once(fn, priority = 0) {
    const bind = new Bind(fn, this, true, priority)
    this.fns.push(bind)
    if (this.prioritizable) this.sort()
    return bind
  }

  off(bind) {
    const index = this.fns.indexOf(bind)

    if (index !== -1) {
      this.fns.splice(index, 1)
    }
    bind.destruct()
  }

  emit() {
    this.stopped = false

    let i = this.fns.length
    while (i--) {
      const bind = this.fns[i]
      if (this.memorable) this.args = arguments
      bind.fn(...arguments)
      bind.fired++
      if (bind.once) this.fns.splice(i, 1)
      if (this.stopped) {
        this.stopped = false
        return
      }
    }
  }

  wipe() {
    this.fns.length = 0
  }

  break() {
    this.stopped = true
  }
}

module.exports = Signal