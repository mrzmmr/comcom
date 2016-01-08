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
 * @version 1.0.0
 * @author mrzmmr
 */

import {through} from 'through'
import {defop} from 'defop'

export function splitLine(options) {
  options = defop(options)

  return through(function (chunk) {
    chunk = chunk.toString().split('\n').forEach((line) => {
      this.queue(line)
    })
  })
}
