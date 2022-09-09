import { runner } from 'test-a-bit'

runner([
  { script: './tests/bm-basic.js', timeout: 3000 },
  { script: './tests/bm-extracted.js', timeout: 3000 },
  { script: './tests/basic.js' },
  { script: './tests/once.js' },
  { script: './tests/arguments.js' },
  { script: './tests/late.js' },
  { script: './tests/late-memory.js' },
  { script: './tests/forget.js' },
  { script: './tests/wipe.js' },
  { script: './tests/break.js' },
  { script: './tests/bind-off.js' },
  { script: './tests/prioritized.js' },
  { script: './tests/extracted-emit.js' },
  { script: './tests/extracted-on.js' },
  { script: './tests/extracted-once.js' },
  { script: './tests/extracted-all.js' },
  { script: './tests/wait.js', timeout: 3000 },
  { script: './tests/wait-timeout.js', timeout: 3000 },
  { script: './tests/wait-def.js', timeout: 3000 },
  { script: './tests/wait-def-timeout.js', timeout: 3000 },
]).then(() => console.log('bye!'))
