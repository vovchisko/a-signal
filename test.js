const Signal = require('.')

const sig = new Signal()

const bind = sig.on((a, b) => { console.log('help', a, b)}, 100)

sig.emit('a', 'b')

// todo: would be nice to have a tests or something