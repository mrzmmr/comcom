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

/*
 * config.c regexs
 */
tap.test('config.c.single.match', (assert) => {
  let a = '// Hello'
    , b = '  // world'

  assert.ok(a.startsWith(a.match(config.c.single.match)[0]))
  assert.ok(b.startsWith(b.match(config.c.single.match)[0]))
  assert.end()
})

tap.test('config.c.multiple.match', (assert) => {
  let test = {
    a: '/*\n'
  , b: '/**\n'
  , c: '/* test\n'
  , d: '/** test\n'
  , e: '  /*\n'
  , f: '  /**\n'
  , g: '  /* test\n'
  , h: '  /** test\n'

  , i: '*/\n'
  , j: '**/\n'
  , k: 'test */\n'
  , l: 'test **/\n'
  , m: '  */\n'
  , n: '  **/\n'
  , o: '  test */\n'
  , p: '  test **/\n'
  }

  for (let i = 97; i < 97 + 8; i++) {
    let i = String.fromCharCode(i)
    let match = test[i].match(config.c.multiple.begin.match)[0]

    assert.ok(test[i].startsWith(match))
  }

  for (let i = 97 + 8; i < 97 + 8 + 8; i++) {
    let i = String.fromCharCode(i)
    let match = test[i].match(config.c.multiple.begin.match)[0]

    assert.ok(test[i].endsWith(match))
  }

  assert.end()
})

/*
 * comcom#split
 */
tap.test('comcom#split', (assert) => {
  let stream = new Stream.Readable()
    , result = []

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

/*
 * comcom#from: class: c, type: multiple
 */
tap.test('comcom#', (assert) => {
  let stream = new Stream.Readable()

  stream.push('/**\n')
  stream.push(' * @param {Number} a\n')
  stream.push(' * @param {Number} b\n')
  stream.push(' */\n')
  stream.push('function test(a, b) {\n')
  stream.push('  return a + b\n')
  stream.push('}\n')
  stream.push(null)

  stream.pipe(comcom.split())
  .pipe(comcom.from({class: 'c', type: 'multiple'}, comcom.config))
  .on('close', () => {

    assert.equal(comcom.buffer[0], '>>\n')
    assert.equal(comcom.buffer[1], '> @param {Number} a\n')
    assert.equal(comcom.buffer[2], '> @param {Number} b\n')
    assert.equal(comcom.buffer[3], ' <<\n')
    assert.end()
  })
})
