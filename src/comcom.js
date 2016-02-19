#!/usr/bin/env node

import commander from 'commander'
import Comcom from './lib/index'

commander.version(require('./package.json').version)
commander.parse(process.argv)
