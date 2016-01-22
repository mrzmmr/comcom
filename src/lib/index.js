/**
 * TODO: Description
 *
 * # install
 *
 * ```
 * npm install [ -g ] comcom
 * ```
 *
 * @module comcom
 * @version 1.3.0
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

export let buffer = []

let options = {
  class: null,
  type: null
}

/**
 * split
 *
 * @return {undefined}
 */
export function split() {
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
 * @param ops
 * @param con
 * @return {undefined}
 */
export function from(ops, con) {
  ops = defop(ops, options)
  con = defop(con, config)

  return through(function (chunk) {
    if (ops.type === 'multiple') {
      let matchBegin = con[ops.class].multiple.begin.match
        , matchEnd = con[ops.class].multiple.end.match

      if (switched) {
        if (chunk.match(matchEnd)) {
          if (chunk.endsWith(chunk.match(matchEnd)[0] + '\n')) {
            chunk = chunk.replace(con[ops.class].multiple.end.value, '<<')
            switched = false

            return buffer.push(chunk)
          }
        }
        chunk = chunk.replace(con[ops.class].multiple.mid.value, '>')

        return buffer.push(chunk)
      }

      if (!switched) {
        if (chunk.match(matchBegin)) {
          if (chunk.startsWith(chunk.match(matchBegin)[0])) {
            chunk = chunk.replace(con[ops.class].multiple.begin.value, '>>')
            switched = true

            if (chunk.match(matchEnd) && chunk.endsWith(matchEnd)[0] + '\n') {
              chunk = chunk.replace(con[ops.class].multiple.end.value, '<<')
              switched = false
            }

            return buffer.push(chunk)
          }
        }
      }

      return this.queue(chunk)
    }
    else {
      if (chunk.match(con[ops.class].single.match)) {
        if (chunk.startsWith(chunk.match(con[ops.class].single.match)[0])) {
          return buffer.push(chunk.replace(con[ops.class].single.string, '>'))
        }
      }

      return this.queue(chunk)
    }
  })
}

/**
 * to
 *
 * @param ops
 * @param con
 * @return {undefined}
 */
export function to(ops, con) {
  ops = defop(ops, options)
  con = defop(con, config)

  return through(function (chunk) {
    let com

    if (buffer.length > 0) {
      if (ops.type === 'single') {
        com = buffer.filter((comment) => {
          if (!(comment.match(/\s*(?=<)<(?=<)<(?=\n)\n/g) || 
            comment.match(/\s*(?=>)>(?=>)>(?=\n)/g))) {
            return comment
          }
        }).map((comment) => {
          return comment.replace('>', con[ops.class].single.string)
        })
        .join('')
      }

      else {
        com = buffer.map((comment, index, array) => {
          if (comment.match(/\s*(?=>)>/g) && comment.startsWith(comment.match(/\s*(?=>)>/g)[0])) {
            let indent = comment.match(/\s*(?=>)/g)[0]

            if (index === 0) {
              return comment.replace('>', con[ops.class].multiple.begin.string + '\n' + indent + con[ops.class].multiple.mid.string)
            }
            else if (index === array.length - 1) {
              return comment = comment.replace('>', con[ops.class].multiple.mid.string) + indent + ' ' + con[ops.class].multiple.end.string + '\n'
            }
            else {
              return comment.replace('>', con[ops.class].multiple.mid.string)
            }
          }
        })
        .join('')
      }

      buffer = []
      return this.queue(com + chunk)
    }
    return this.queue(chunk)
  })
}
