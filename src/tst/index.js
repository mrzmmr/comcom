require('string.prototype.startswith')
require('string.prototype.endswith')

let config = require('../lib/config')
let Comcom = require('../lib/index')

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
    let match = test[i].match(config.c.multiple.beg.match)[0]

    assert.ok(test[i].startsWith(match))
  }

  for (let i = 97 + 8; i < 97 + 8 + 8; i++) {
    let i = String.fromCharCode(i)
    let match = test[i].match(config.c.multiple.end.match)[0]

    assert.ok(test[i].endsWith(match + '\n'))
  }

  assert.end()
})

/*
 * comcom#split
 */
tap.test('comcom#split', (assert) => {
  let comcom = new Comcom.default()
    , stream = new Stream.Readable()
    , result = []

  stream.push('/**')
  stream.push(' * Hello')
  stream.push(' * World')
  stream.push(' */')
  stream.push(null)
  stream.pipe(comcom.split()).pipe(through((chunk) => {
    result.push(chunk)
  }))
  .on('close', () => {
    assert.equal(result.length, 4)
    assert.equal(result[0], '/**\n')
    assert.equal(result[1], ' * Hello\n')
    assert.equal(result[2], ' * World\n')
    assert.equal(result[3], ' */\n')
    assert.end()
  })
})

/*
 * comcom#from (class: c, type: single)
 */
tap.test('comcom#from(class: c, type: single)', (assert) => {
  let comcom = new Comcom.default()
    , stream = new Stream.Readable()

  stream.push('// Test')
  stream.push('//')
  stream.push('// @param {Number} a')
  stream.push('// @param {Number} b')
  stream.push('function test(a, b) {')
  stream.push('  return a + b')
  stream.push(null)

  stream.pipe(comcom.split())
  .pipe(comcom.from({class: 'c', type: 'single'}, config))
  .on('close', () => {

    assert.equal(comcom.buffer[0], '> Test\n')
    assert.equal(comcom.buffer[1], '>\n')
    assert.equal(comcom.buffer[2], '> @param {Number} a\n')
    assert.equal(comcom.buffer[3], '> @param {Number} b\n')
    assert.end()
  })
})

/*
 * comcom#from (class: c, type: multiple)
 */
tap.test('comcom#from(class: c, type: multiple)', (assert) => {
  let comcom = new Comcom.default()
    , stream = new Stream.Readable()

  stream.push('/**')
  stream.push(' * @param {Number} a')
  stream.push(' * @param {Number} b')
  stream.push(' */')
  stream.push('function test(a, b) {')
  stream.push('  return a + b')
  stream.push('}')
  stream.push(null)

  stream.pipe(comcom.split())
  .pipe(comcom.from({class: 'c', type: 'multiple'}, config))
  .on('close', () => {
    assert.equal(comcom.buffer[0], '>>\n')
    assert.equal(comcom.buffer[1], '> @param {Number} a\n')
    assert.equal(comcom.buffer[2], '> @param {Number} b\n')
    assert.equal(comcom.buffer[3], ' <<\n')
    assert.end()
  })
})

/*
 * comcom#from (class: c, type: multiple)
 * comcom#to (class: c, type: single)
 */
tap.test('comcom#to(class: c, type: single)', (assert) => {
  let comcom = new Comcom.default()
    , stream = new Stream.Readable()
    , buffer = []

  stream.push('/**')
  stream.push(' * Test')
  stream.push(' *')
  stream.push(' * @param {Number} a')
  stream.push(' * @param {Number} b')
  stream.push(' */')
  stream.push('function test(a, b) {')
  stream.push('  return a + b')
  stream.push(null)

  stream.pipe(comcom.split())
  .pipe(comcom.from({class: 'c', type: 'multiple'}, config))
  .pipe(comcom.to({class: 'c', type: 'single'}, config))
  .pipe(comcom.split())
  .pipe(through(function (chunk) {
    buffer.push(chunk)
  }))
  .on('close', () => {
    assert.equal(buffer[0], '// Test\n')
    assert.equal(buffer[1], '//\n')
    assert.equal(buffer[2], '// @param {Number} a\n')
    assert.equal(buffer[3], '// @param {Number} b\n')
    assert.end()
  })
})

/*
 * comcom#from (class: c, type: single)
 * comcom#to (class: c, type: multiple)
 */
tap.test('comcom#to(class: c, type: multiple)', (assert) => {
  let comcom = new Comcom.default()
    , stream = new Stream.Readable()
    , buffer = []

  stream.push('// Test')
  stream.push('//')
  stream.push('// @param {Number} a')
  stream.push('// @param {Number} b')
  stream.push('function test(a, b) {')
  stream.push('  return a + b')
  stream.push(null)

  stream.pipe(comcom.split())
  .pipe(comcom.from({class: 'c', type: 'single'}, config))
  .pipe(comcom.to({class: 'c', type: 'multiple'}, config))
  .pipe(comcom.split())
  .pipe(through(function (chunk) {
    buffer.push(chunk)
  }))
  .on('close', () => {
    assert.equal(buffer[0], '/**\n')
    assert.equal(buffer[1], ' * Test\n')
    assert.equal(buffer[2], ' *\n')
    assert.equal(buffer[3], ' * @param {Number} a\n')
    assert.equal(buffer[4], ' * @param {Number} b\n')
    assert.equal(buffer[5], ' */\n')
    assert.end()
  })
})
