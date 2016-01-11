/**
 * TODO: Description
 *
 * # install
 *
 * ```
 * npm install -g comcom
 *
 * // Or
 *
 * npm install --save comcom
 * ```
 *
 * @module comcom
 * @version 1.0.5
 * @author mrzmmr
 */

/*
 * Imports
 */
import {through} from 'through'
import {defop} from 'defop'

/**
 * @name options
 * @property {String} from - Defaults to null
 * @property {String} to - Defaults to null
 */
let options = {
  from: null,
  to: null
}

/*
 * Buffer
 */
let buffer = []

let switched = null

/*
 * C style single line comment
 */
export const CSTYLE_SINGLE = /\s*(?=\/)\/(?=\/)\//g

/*
 * C style multiple line comment
 */
export const CSTYLE_MULTIPLE_BEG = /\s*(?=\/)\/(?=\*)\**/g
export const CSTYLE_MULTIPLE_END = /\s*(?=\*)\**(?=\/)\//g

export function split() {
  return through(function (chunk) {
    let self = this

    return chunk.toString().split('\n').map((line) => {
      self.queue(line + '\n')
    })
  })
}

export function from(comment) {
  return through(function (chunk) {
    var self = this

    if (comment.multi) {
      if (chunk.indexOf(comment.multi.begin) > -1) {
        return switched = true
      }
      else if (chunk.indexOf(comment.multi.end) > -1) {
        return switched = false
      }
      else {
        if (switched) {
          return buffer.push(chunk)
        }
        return this.queue(chunk)
      }
    }
    else {
      if (chunk.indexOf(comment.single) > -1) {
        return buffer.push(chunk)
      }
      return this.queue(chunk)
    }
  })
}
