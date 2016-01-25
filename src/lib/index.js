/**
 * [![AppVeyor](https://img.shields.io/appveyor/ci/mrzmmr/comcom.svg?style=flat-square)]()
 * [![CircleCI](https://img.shields.io/circleci/project/mrzmmr/comcom.svg?style=flat-square)]()
 * [![Coveralls](https://img.shields.io/coveralls/mrzmmr/comcom.svg?style=flat-square)]()
 * 
 * TODO: Description
 *
 * # install
 *
 * ```
 * npm install [ -g ] comcom
 * ```
 *
 * @module comcom
 * @version 1.4.8
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

export default class Comcom {

  constructor() {
    this.switched = false
    this.config = config
    this.buffer = []
    this.options = {
      from: {
        class: null,
        type: null
      },
      to: {
        class: null,
        type: null
      }
    }
  }

  /**
   * convert
   *
   * @param ops
   * @param con
   * @return {undefined}
   */
  convert(ops={}, con={}) {
    let self = this

    ops = defop(ops, self.options)
    con = defop(con, self.config)

    return through(function (chunk) {
      let stream = new require('stream').Readable()
        , that = this

      stream.push(chunk)
      stream.push(null)

      stream.pipe(self.split())
      .pipe(self.from(ops.from, con))
      .pipe(self.to(ops.to, con))
      .pipe(through(function (chunk) {
        return that.queue(chunk)
      }))
    })
  }

  /**
   * split
   *
   * @return {undefined}
   */
  split() {
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
   * @param {Object} ops -
   * @param {Object} con -
   * @return {undefined}
   */
  from(ops={}, con={}) {

    let self = this

    ops = defop(ops, self.options)
    con = defop(con, self.config)

    ops.class = ops.class || ops.from.class
    ops.type = ops.type || ops.from.type

    return through(function (chunk) {

      let mul = con[ops.class].multiple
        , sin = con[ops.class].single
        , dmul = con._.multiple
        , dsin = con._.single

      if (ops.type === 'multiple') {

        if (self.switched) {
          if (chunk.match(mul.end.match)) {
            if (chunk.endsWith(chunk.match(mul.end.match)[0] + '\n')) {
              chunk = chunk.replace(mul.end.value, dmul.end.string)
              self.switched = false

              return self.buffer.push(chunk)
            }
          }
          chunk = chunk.replace(mul.mid.string, dsin.string)

          return self.buffer.push(chunk)
        }

        if (!self.switched) {
          if (chunk.match(mul.beg.match)) {
            if (chunk.startsWith(chunk.match(mul.beg.match)[0])) {
              chunk = chunk.replace(mul.beg.value, dmul.beg.string)
              self.switched = true

              if (chunk.match(mul.end.match) && chunk.endsWith(chunk.match(mul.end.match)[0] + '\n')) {
                chunk = chunk.replace(mul.end.value, dmul.end.string)
                self.switched = false
              }

              return self.buffer.push(chunk)
            }
          }
        }

        return this.queue(chunk)
      }
      else {
        if (chunk.match(sin.match)) {
          if (chunk.startsWith(chunk.match(sin.match)[0])) {
            return self.buffer.push(chunk.replace(sin.string, dsin.string))
          }
        }

        return this.queue(chunk)
      }
    })
  }

  /**
   * to
   *
   * @param {Object} ops -
   * @param {Object} con -
   * @return {undefined}
   */
  to(ops={}, con={}) {

    let self = this

    ops = defop(ops, self.options)
    con = defop(con, self.config)

    ops.class = ops.class || ops.to.class
    ops.type = ops.type || ops.to.type

    return through(function (chunk) {
      let mul = con[ops.class].multiple
        , sin = con[ops.class].single
        , dmul = con._.multiple
        , dsin = con._.single
        , com

      if (self.buffer.length > 0) {
        if (ops.type === 'single') {

          com = self.buffer.filter((comment) => {
            if (!(comment.match(dmul.end.match) || 
              comment.match(dmul.beg.match))) {
              return comment
            }
          }).map((comment) => {
            return comment.replace(dsin.string, sin.string)
          })
          .join('')
        }

        else {
          com = self.buffer.map((comment, index, array) => {
            if (comment.match(dsin.match) && comment.startsWith(comment.match(dsin.match)[0])) {
              let indent = comment.match(dsin.space)[0]

              if (index === 0) {
                return comment.replace(dsin.string, mul.beg.string + '\n' + indent + mul.mid.string)
              }
              else if (index === array.length - 1) {
                return comment = comment.replace(dsin.string, mul.mid.string) + indent + ' ' + mul.end.string + '\n'
              }
              else {
                return comment.replace('>', mul.mid.string)
              }
            }
          })
          .join('')
        }

        self.buffer = []
        return this.queue(com + chunk)
      }
      return this.queue(chunk)
    })
  }
}
