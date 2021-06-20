const EFN_KEY = Symbol('EXTENSIBLE_FUNCTION_KEY')

export default class ExtensibleFunction extends Function {
  constructor (fn) {
    super('EFN_KEY, ...args', 'return this[EFN_KEY](...args)')
    let ret = Function.prototype.bind.apply(this, [ this, EFN_KEY ])
    Object.defineProperty(this, EFN_KEY, { get: () => fn })
    Object.defineProperty(ret, EFN_KEY, { get: () => fn })
    return ret
  }

  bind (...args) {
    let fn = this[EFN_KEY].bind(...args)
    return Object.assign(new this.constructor(fn), this)
  }

  apply (...args) {
    return this[EFN_KEY].apply(...args)
  }

  call (...args) {
    return this[EFN_KEY].call(...args)
  }
}
