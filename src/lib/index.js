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
 * @version 1.0.7
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
    if (options.type === 'multi') {
      if (!switched) {
        if (chunk.startsWith(chunk.match(config[options.class].multi.begin.match)[0])) {
          if (!chunk.endsWith(chunk.match(config[options.class].multi.begin.match)[0])) {
            buffer.push(chunk)
          }
          return switched = true
        }
      }
      else if (switched) {
        if (chunk.endsWith(chunk.match(config[options.class].multi.end.match)[0])) {
          if (!chunk.startsWith(chunk.match(config[options.class].multi.end.match)[0])) {
            buffer.push(chunk)
          }
          return switched = false
        }
        else {
          return buffer.push(chunk)
        }
      }
    }
    else if (options.type === 'single') {
      if (chunk.startsWith(chunk.match(config[options.class].single.match)[0])) {
        return buffer.push(chunk)
      }
    }
    return this.queue(chunk)
  })
}
