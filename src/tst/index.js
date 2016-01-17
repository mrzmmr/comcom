require('string.prototype.startswith')
require('string.prototype.endswith')

let config = require('../lib/config')
let comcom = require('../lib/index')

let through = require('through')
let Stream = require('stream')
let tap = require('tap')

/*
 * Regex tests
 */
tap.test('config.c.single.match', (assert) => {
  let a = '// Hello'
  let b = '  // world'

  assert.ok(a.startsWith(a.match(config.c.single.match)[0]))
  assert.ok(b.startsWith(b.match(config.c.single.match)[0]))
  assert.end()
})

tap.test('config.c.multi.match', (assert) => {
  let a = '/* Hello'
  let b = '/** World'
  let c = '  /* Hello'
  let d = '  /** World'
  let e = '*/'
  let f = '**/'
  let g = '  */'
  let h = '  **/'

  assert.ok(a.startsWith(a.match(config.c.multi.begin.match)[0]))
  assert.ok(b.startsWith(b.match(config.c.multi.begin.match)[0]))
  assert.ok(c.startsWith(c.match(config.c.multi.begin.match)[0]))
  assert.ok(d.startsWith(d.match(config.c.multi.begin.match)[0]))
  assert.ok(e.startsWith(e.match(config.c.multi.end.match)[0]))
  assert.ok(f.startsWith(f.match(config.c.multi.end.match)[0]))
  assert.ok(g.startsWith(g.match(config.c.multi.end.match)[0]))
  assert.ok(h.startsWith(h.match(config.c.multi.end.match)[0]))
  assert.end()
})

/*
 * comcom#split
 */

tap.test('comcom#split', (assert) => {
  let stream = new Stream.Readable()
  let result = []

  stream.push('/*\n * Hello\n * World\n */')
  stream.push(null)
  stream.pipe(comcom.split()).pipe(through((chunk) => {
    result.push(chunk)
  }))
  .on('close', () => {
    assert.equal(result.length, 4)
    assert.equal(result[0], '/*\n')
    assert.equal(result[1], ' * Hello\n')
    assert.equal(result[2], ' * World\n')
    assert.equal(result[3], ' */\n')
    assert.end()
  })
})
