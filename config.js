'use strict'

const pudding = require('figgy-pudding')

const NpmHooksConfig = pudding({
  'scope': {}
})

module.exports = config
function config (opts) {
  return NpmHooksConfig(opts, opts.config)
}
