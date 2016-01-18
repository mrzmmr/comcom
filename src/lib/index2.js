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

      if (!switched) {
        if (chunk.match(config[options.class]['multiple']['begin'].match) &&
          chunk.startsWith(config[options.class]['multiple']['begin'].match[0])) {
          if (!(chunk.match(config[options.class]['multiple']['end'].match) &&
            chunk.endsWith(config[options.class]['multiple']['end'].match[0] + '\n'))) {
            switched = true
          }

          if (!(chunk.endsWith(config[options.class]['multiple']['begin'].match[0] + '\n'))) {
            buffer.push(chunk)
          }
        }
      }

      if (switched) {
        if (chunk.match(config[options.class]['multiple']['end'].match) &&
          chunk.endsWith(config[options.class]['multiple']['end'].match[0] + '\n')) {
          if (!(chunk.startsWith(config[options.class]['multiple']['end'].match[0]))) {
            buffer.push(chunk)
          }
          switched = false
        }
        else {
          buffer.push(chunk)
        }
      }
    }
    else if (options.type === 'single') {
    }
    else {
      return this.queue(chunk)
    }
  })
}

({class: 'c', type: 'multiple'}, config))).on('close', function () {
  buffer.map((item) => {
    console.log(item)
  })
})
