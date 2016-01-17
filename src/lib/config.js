const config = {

  /*
   * C style comments
   */
  'c': {
    single: {
      value: '//',
      match: /\s*(?=\/)\/(?=\/)\//g
    },
    multi: {
      begin: {
        value: '/*',
        match: /\s*(?=\/)\/(?=\*)\**/g
      },
      end: {
        value: '*/',
        match: /\s*(?=\*)\**(?=\/)\//g
      }
    }
  }
}

module.exports = config
