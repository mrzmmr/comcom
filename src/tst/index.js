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

tap.test('config.c.multi.match', (assert) => {
  let test = {
    a: '/*'
  , b: '/**'
  , c: '/* test'
  , d: '/** test'
  , e: '  /*'
  , f: '  /**'
  , g: '  /* test'
  , h: '  /** test'

  , i: '*/'
  , j: '**/'
  , k: 'test */'
  , l: 'test **/'
  , m: '  */'
  , n: '  **/'
  , o: '  test */'
  , p: '  test **/'
  }

  for (let i = 97; i < 97 + 8; i++) {
    let i = String.fromCharCode(i)
    let match = test[i].match(config.c.multi.begin.match)[0]

    assert.ok(test[i].startsWith(match))
  }

  for (let i = 97 + 8; i < 97 + 8 + 8; i++) {
    let i = String.fromCharCode(i)
    let match = test[i].match(config.c.multi.begin.match)[0]

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
