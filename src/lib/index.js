/**
 * TODO: Description
 *
 * # install
 *
 * ```
 * npm install [-g] comcom
 * ```
 *
 * @module comcom
 * @version 1.0.8
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
  , buffer = []

let options = {
  class: null,
  type: null
}

export function split() {
  return through(function (chunk) {
    let self = this

    return chunk.toString().split('\n').map((line) => {
      return self.queue(line + '\n')
    })
  })
}

export function from(ops, config) {
  ops = defop(options)

  return through(function (chunk) {
    if (ops.type === 'multiple') {
      let matchb = config[ops.class].multiple.begin.match
      let matche = config[ops.class].multiple.end.match

      if (switched) {
        if (chunk.match(matche)) {
          if (!chunk.startsWith(chunk.match(matche)[0]) &&
            chunk.endsWith(chunk.match(matche)[0])) {
            buffer.push(chunk)
          }
          return switched = false
        }
        return buffer.push(chunk)
      }
      if (!switched) {
        if (chunk.match(matchb)) {
          if (!chunk.endsWith(chunk.match(matchb)[0]) &&
            chunk.startsWith(chunk.match(matchb)[0])) {
            buffer.push(chunk)
          }
          return switched = true
        }
        this.queue(chunk)
      }
    }
  })
}
