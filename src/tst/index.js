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
