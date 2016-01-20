const config = {
  'c': {
    single: {
      value: '//',
      match: /\s*(?=\/)\/(?=\/)\//g
    },
    multiple: {
      begin: {
        value: /(?=\/)\/(?=\**)\**/g,
        match: /\s*(?=\/)\/(?=\**)\**(?=\n)\n/g
      },
      end: {
        value: /\**(?=\/)\//g,
        match: /\s*(?=\**)\**(?=\/)\/(?=\n)\n/g
      },
      mid: {
        value: ' *'
      }
    }
  }
}

module.exports = config
