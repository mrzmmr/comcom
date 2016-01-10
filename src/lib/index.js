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

export function split(ops) {
  ops = defop(ops)

  return through(function (chunk) {
    let self = this

    return chunk.toString().split('\n').map((line) => {
      self.queue(line + '\n')
    })
  })
}

export function from(ops) {
  ops = defop(ops)

  return through(function (chunk) {
    let self = this

    if (chunk.indexOf('/*') > -1) {
      return switched = false
    }
    else if (chunk.indexOf('/*') > -1) {
      return switched = true
    }
    else {
      if (switched) {
        return buffer.push(chunk)
      }
      return this.queue(chunk)
    }
  })
}
