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
 * @version 1.3.1
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


require('fs').createReadStream(__dirname + '/../../test2.js', {
  encoding: 'utf8'
}).pipe(


/**
 * split
 *
 * @return {undefined}
 */
function split() {
  return through(function (chunk) {
    let self = this

    return chunk.toString().split('\n').map((line) => {
      return self.queue(line + '\n')
    })
  })
}


()).pipe(


/**
 * from
 *
 * @param {Object} ops -
 * @param {Object} con -
 * @return {undefined}
 */
function from(ops, con) {
  ops = defop(ops, options)
  con = defop(con, config)

  return through(function (chunk) {
    let mbeg = con[ops.class].multiple.beg
      , mend = con[ops.class].multiple.end
      , mmid = con[ops.class].multiple.mid
      , dmbeg = con._.multiple.beg
      , dmend = con._.multiple.end
      , dmmid = con._.multiple.mid
      , single = con[ops.class].single
      , dsingle = con._.single

    if (ops.type === 'multiple') {

      if (switched) {
        if (chunk.match(mend.match)) {
          if (chunk.endsWith(chunk.match(mend.match)[0] + '\n')) {
            chunk = chunk.replace(mend.value, dmend.string)
            switched = false

            return buffer.push(chunk)
          }
        }
        chunk = chunk.replace(mmid.string, dsingle.string)

        return buffer.push(chunk)
      }

      if (!switched) {
        if (chunk.match(mbeg.match)) {
          if (chunk.startsWith(chunk.match(mbeg.match)[0])) {
            chunk = chunk.replace(mbeg.value, dmbeg.string)
            switched = true

            if (chunk.match(mend.match) && chunk.endsWith(mend.match)[0] + '\n') {
              chunk = chunk.replace(mend.value, dmend.string)
              switched = false
            }

            return buffer.push(chunk)
          }
        }
      }

      return this.queue(chunk)
    }
    else {
      if (chunk.match(single.match)) {
        if (chunk.startsWith(chunk.match(single.match)[0])) {
          return buffer.push(chunk.replace(single.string, dsingle.string))
        }
      }

      return this.queue(chunk)
    }
  })
}


({class: 'c', type: 'single'})).pipe(


/**
 * to
 *
 * @param {Object} ops -
 * @param {Object} con -
 * @return {undefined}
 */
function to(ops, con) {
  ops = defop(ops, options)
  con = defop(con, config)

  return through(function (chunk) {
    let com
      , dmbeg = con._.multiple.beg
      , dmend = con._.multiple.end
      , dsingle = con._.single
      , single = con[ops.class].single
      , mbeg = con[ops.class].multiple.beg
      , mend = con[ops.class].multiple.end
      , mmid = con[ops.class].multiple.mid


    if (buffer.length > 0) {
      if (ops.type === 'single') {

        com = buffer.filter((comment) => {
          if (!(comment.match(dmend.match) || 
            comment.match(dmbeg.match))) {
            return comment
          }
        }).map((comment) => {
          return comment.replace(dsingle.string, single.string)
        })
        .join('')
      }

      else {
        com = buffer.map((comment, index, array) => {
          if (comment.match(dsingle.match) && comment.startsWith(comment.match(dsingle.match)[0])) {
            let indent = comment.match(dsingle.space)[0]

            if (index === 0) {
              return comment.replace(dsingle.string, mbeg.string + '\n' + indent + mmid.string)
            }
            else if (index === array.length - 1) {
              return comment = comment.replace(dsingle.string, mmid.string) + indent + ' ' + mend.string + '\n'
            }
            else {
              return comment.replace('>', mmid.string)
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


({class: 'c', type: 'multiple'})).pipe(process.stdout)
