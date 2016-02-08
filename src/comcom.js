#! /usr/bin/env node

import commander from 'commander'

let comcom = commander

comcom
  .version('0.0.1')

comcom
  .command('from <class>,<type>', 'Tells comcom what type and class of comment is being converted from')

comcom
  .command('to <class>,<type>', 'Tells comcom what type and class of comment is being converted to')

comcom
  .parse(process.argv)
