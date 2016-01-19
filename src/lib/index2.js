require('string.prototype.startswith')
require('string.prototype.endswith')

let through = require('through')
  , config = require('./config')
  , defop = require('defop')
  , switched = false
  , buffer = []

let OPTIONS = {
  class: null,
  type: null
}

let fs = require('fs')
let stream = fs.createReadStream(__dirname + '/../../test.js', 'utf8')

stream.pipe((

function split() {
  return through(function (chunk) {
    let self = this

    return chunk.toString().split('\n').map((line) => {
      return self.queue(line + '\n')
    })
  })
}

())).pipe((

function from(options, config) {
  return through(function (chunk) {
    if (options.type === 'multiple') {
      let matchb = config[options.class].multiple.begin.match
      let matche = config[options.class].multiple.end.match

      if (switched) {
        if (chunk.match(matche)) {
          if (!chunk.startsWith(chunk.match(matche)[0]) &&
            chunk.endsWith(chunk.match(matche)[0])) {
            buffer.push(chunk)
          }
          return switched = false
        }
        return buffer.push(chunk)
      }
      if (!switched) {
        if (chunk.match(matchb)) {
          if (!chunk.endsWith(chunk.match(matchb)[0]) &&
            chunk.startsWith(chunk.match(matchb)[0])) {
            buffer.push(chunk)
          }
          return switched = true
        }
        this.queue(chunk)
      }
    }
  })
}

({class: 'c', type: 'multiple'}, config))).pipe(process.stdout).on('close', function () {
  console.log(buffer)
})
