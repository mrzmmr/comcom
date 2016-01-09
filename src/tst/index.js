import * as lib from '../lib/index'
import 'string.prototype.startswith'
import * as tap from 'tap'

tap.test('Regex#CSTYLE_SINGLE', (assert) => {
  let t1 = '// Hello'
  let t2 = '  // world'

  assert.ok(t1.startsWith(t1.match(lib.CSTYLE_SINGLE)[0]))
  assert.ok(t2.startsWith(t2.match(lib.CSTYLE_SINGLE)[0]))
  assert.end()
})

tap.test('Regex#CSTYLE_MULTIPLE', (assert) => {
  let t1 = '/* Hello'
  let t2 = '/** World'
  let t3 = '  /* Hello'
  let t4 = '  /** World'
  let t5 = '*/'
  let t6 = '**/'
  let t7 = '  */'
  let t8 = '  **/'

  assert.ok(t1.startsWith(t1.match(lib.CSTYLE_MULTIPLE_BEG)[0]))
  assert.ok(t2.startsWith(t2.match(lib.CSTYLE_MULTIPLE_BEG)[0]))
  assert.ok(t3.startsWith(t3.match(lib.CSTYLE_MULTIPLE_BEG)[0]))
  assert.ok(t4.startsWith(t4.match(lib.CSTYLE_MULTIPLE_BEG)[0]))
  assert.ok(t5.startsWith(t5.match(lib.CSTYLE_MULTIPLE_END)[0]))
  assert.ok(t6.startsWith(t6.match(lib.CSTYLE_MULTIPLE_END)[0]))
  assert.ok(t7.startsWith(t7.match(lib.CSTYLE_MULTIPLE_END)[0]))
  assert.ok(t8.startsWith(t8.match(lib.CSTYLE_MULTIPLE_END)[0]))
  assert.end()
})
