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
 * @version 1.0.5
 * @author mrzmmr
 */

/*
 * Dependencies
 */

require('string.prototype.startswith')
require('string.prototype.endswith')

let through = require('through')
let config = require('./config')
let Stream = require('stream')
let defop = require('defop')

/*
 * Buffer to hold comments to be worked on
 */
let buffer = []

let switched = false

export function split() {
  return through(function (chunk) {
    let self = this

    return chunk.toString().split('\n').map((line) => {
      self.queue(line + '\n')
    })
  })
}

export function from(options, config) {
  return through(function (chunk) {
    if (options.type === 'multi') {
      if (!switched) {
        if (chunk.startsWith(chunk.match(config[options.class].multi.begin.match))) {
          if (!chunk.endsWith(chunk.match(config[options.class].multi.begin.match))) {
            buffer.push(chunk)
          }
          return switched = true
        }
      }
      else if (switched) {
        if (chunk.endsWith(chunk.match(config[options.class].multi.end.match))) {
          if (!chunk.startsWith(chunk.match(config[options.class].multi.end.match))) {
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
      if (chunk.startsWith(chunk.match(config[options.class].single.match))) {
        return buffer.push(chunk)
      }
    }
    return this.queue(chunk)
  })
}
