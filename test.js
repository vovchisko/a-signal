import { runner } from 'test-a-bit'

runner([
  { script: './tests/bm-basic.js', timeout: 3000 },
  { script: './tests/bm-extracted.js', timeout: 3000 },
  { script: './tests/basic.js' },
  { script: './tests/once.js' },
  { script: './tests/extracted-on.js' },
  { script: './tests/arguments.js' },
  { script: './tests/late.js' },
  { script: './tests/late-memory.js' },
  { script: './tests/wipe.js' },
  { script: './tests/break.js' },
  { script: './tests/break-alt.js' },
  { script: './tests/bind-off.js' },
  { script: './tests/prioritized.js' },
]).then(() => console.log('bye!'))
