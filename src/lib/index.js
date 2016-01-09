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
 * @version 1.0.3
 * @author mrzmmr
 */

/*
 * Imports
 */
import {through} from 'through'
import {defop} from 'defop'

/*
 * C style single line comment
 */
export const CSTYLE_SINGLE = /\s*(?=\/)\/(?=\/)\//g

/*
 * C style multiple line comment
 */
export const CSTYLE_MULTIPLE_BEG = /\s*(?=\/)\/(?=\*)\**/g
export const CSTYLE_MULTIPLE_END = /\s*(?=\*)\**(?=\/)\//g

export function split_line(options) {
  options = defop(options)

  return through(function (chunk) {
    chunk = chunk.toString().split('\n').forEach((line) => {
      this.queue(line)
    })
  })
}
