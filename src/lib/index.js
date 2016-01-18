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
  , Stream = require('stream')
  , defop = require('defop')
  , switched = false
  , buffer = []

export function split() {
  return through(function (chunk) {
    let self = this

    return chunk.toString().split('\n').map((line) => {
      return self.queue(line + '\n')
    })
  })
}

export function from(options, config) {
  return through(function (chunk) {

    if (options.type === 'multiple' && switched) {

      // The problem is how to handle the '\n'
      let match = config[options.class]['multiple']['end']['match']

      if (chunk.match(match) && chunk.endsWith(chunk.match(match)[0])) {
        if (!chunk.startsWith(chunk.match(match)[0])) {
          buffer.push(chunk)
        }
        switched = false
      }
      else {
        buffer.push(chunk)
      }
    }

    else if (options.type === 'multiple' && !switched) {

      // The problem is how to handle '\n'
      let match = config[options.class]['multiple']['begin']['match']

      if (chunk.match(match) && chunk.startsWith(chunk.match(match)[0])) {
        if (!chunk.endsWith(chunk.match(match)[0])) {
          buffer.push(chunk)
        }
        switched = true
      }
    }

    else if (options.type === 'single') {
    }

    else {
      this.queue(chunk)
    }
  })
}
