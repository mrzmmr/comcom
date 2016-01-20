/**
 * TODO: Description
 *
 * # install
 *
 * ```
 * npm install [ -g ] comcom
 * ```
 *
 * @module comcom
 * @version 1.0.11
 * @author mrzmmr
 */

/*
 * Dependencies
 */
require('string.prototype.startswith')
require('string.prototype.endswith')

let through = require('through')
  , config = require('./config')
  , defop = require('defop')
  , switched = false

export let buffer = []

let options = {
  class: null,
  type: null
}

/**
 * split
 *
 * @return {undefined}
 */
export function split() {
  return through(function (chunk) {
    let self = this

    return chunk.toString().split('\n').map((line) => {
      return self.queue(line + '\n')
    })
  })
}

/**
 * from
 *
 * @param ops
 * @param con
 * @return {undefined}
 */
export function from(ops, con) {
  ops = defop(ops, options)
  con = defop(con, config)

  return through(function (chunk) {
    if (ops.type === 'multiple') {
      let matchb = con[ops.class].multiple.begin.match
        , matche = con[ops.class].multiple.end.match

      if (switched) {
        if (chunk.match(matche)) {
          if (chunk.endsWith(chunk.match(matche)[0])) {
            switched = false
            chunk = chunk.replace(con[ops.class].multiple.end.value, '<<')

            if (chunk !== '\n') {
              return buffer.push(chunk)
            }
          }
        }
        chunk = chunk.replace(con[ops.class].multiple.mid.value, '>')

        if (chunk !== '\n') {
          return buffer.push(chunk)
        }
      }

      else if (!switched) {
        if (chunk.match(matchb)) {
          if (chunk.startsWith(chunk.match(matchb)[0])) {
            switched = true
            chunk = chunk.replace(con[ops.class].multiple.begin.value, '>>')

            if (chunk.match(matche) && chunk.endsWith(matche)[0]) {
              switched = false
              chunk = chunk.replace(con[ops.class].multiple.end.value, '<<')
            }

            if (chunk !== '\n') {
              return buffer.push(chunk)
            }
          }
        }
      }

      return this.queue(chunk)
    }
  })
}
