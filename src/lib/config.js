const config = {
  'c': {
    single: {
      value: '//',
      match: /\s*(?=\/)\/(?=\/)\//g
    },
    multiple: {
      begin: {
        value: '/*',
        match: /\s*(?=\/)\/(?=\**)\**(?=\n)\n/g
      },
      end: {
        value: '*/',
        match: /\s*(?=\**)\**(?=\/)\/(?=\n)\n/g
      }
    }
  }
}

module.exports = config
