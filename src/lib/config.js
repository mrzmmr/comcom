export default config

const config = {
  '_': {
    single: {
      value: />/g,
      match: /\s*(?=>)>/g,
      space: /\s*(?=>)/g,
      string: '>'
    },
    multiple: {
      beg: {
        value: />(?=>)>/g,
        match: /\s*(?=>)>(?=>)>/g,
        string: '>>'
      },
      end: {
        value: /<(?=<)</g,
        match: /\s*(?=<)<(?=<)</g,
        string: '<<'
      }
    }
  },
  'c': {
    single: {
      value: /\/(?=\/)\//g,
      match: /\s*(?=\/)\/(?=\/)\//g,
      string: '//'
    },
    multiple: {
      beg: {
        value: /\/(?=\**)\**/g,
        match: /\s*(?=\/)\/(?=\**)\**/g,
        string: '/**'
      },
      end: {
        value: /\**(?=\/)\//g,
        match: /\s*(?=\**)\**(?=\/)\//g,
        string: '*/'
      },
      mid: {
        string: ' *'
      }
    }
  }
}

module.exports = config
