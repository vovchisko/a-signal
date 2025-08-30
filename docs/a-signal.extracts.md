# Extracts

Extract signal methods for clean composition. Perfect for classes that need signal functionality.

## MagicBox Example

Extract methods to create clean APIs for entities that become ready after async operations:

```javascript
class MagicBox {
    constructor() {
        this.readySignal = new Signal({ memorable: true })
        
        // Extract method for public API
        this.ready = this.readySignal.extractOn()
        
        // Keep emit private
        this.#emitReady = this.readySignal.extractEmit()
        
        // Start async initialization
        this.initialize()
    }
    
    async initialize() {
        await performMagic()
        this.#emitReady(true)
    }
}

// Usage - consumers can use callbacks or await
const box = new MagicBox()

box.ready(() => console.log('Ready!'))

// Or as promise
await new Promise(resolve => box.ready(resolve))
```

## Benefits

- **Clean APIs** - Only expose what users need
- **Encapsulation** - Keep emit logic private  
- **Flexible** - Can be used as callbacks or wrapped as Promises

## Related

- [Basic](./a-signal.basic.md) - Core signal operations
- [Memorable](./a-signal.memorable.md) - Remember emission arguments for late subscribers
- [Promises](./a-signal.promises.md) - Await signal emissions