import { execute } from 'test-a-bit'
import Signal from '../src/signal.js'

execute('nested emissions', async (success, fail) => {
    const outer = new Signal()
    const inner = new Signal()
    const deepest = new Signal()
    
    let sequence = []
    
    outer.on(() => {
        sequence.push('outer')
        inner.emit()
    })
    
    inner.on(() => {
        sequence.push('inner')
        deepest.emit()
    })
    
    deepest.on(() => {
        sequence.push('deepest')
    })
    
    outer.emit()
    
    sequence.join(',') === 'outer,inner,deepest'
        ? success('nested emissions work correctly')
        : fail(`wrong sequence: ${sequence.join(',')}`)
})