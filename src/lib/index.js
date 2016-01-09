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
 * @version 1.0.4
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
    chunk = chunk.toString().split('\n').forEach((line) => {
      this.queue(line)
    })
  })
}

export function from(ops) {
  ops = defop(ops)

  let from = ops.from

  return through(function (chunk) {

    /*
     * C style multiple line
     */
    if (from === '/*') {
      if (switched) {
        buffer.push(chunk.replace(CSTYLE_MULTIPLE_MID, ' '))
        return this.queue('null')
      }
    }
  })
}
