const config = {
  'c': {
    single: {
      value: '//',
      match: /\s*(?=\/)\/(?=\/)\//g,
      string: '//'
    },
    multiple: {
      begin: {
        value: /(?=\/)\/(?=\**)\**/g,
        match: /\s*(?=\/)\/(?=\**)\**/g,
        string: '/**'
      },
      end: {
        value: /\**(?=\/)\//g,
        match: /\s*(?=\**)\**(?=\/)\//g,
        string: '*/'
      },
      mid: {
        value: ' *',
        string: ' *'
      }
    }
  }
}

module.exports = config
