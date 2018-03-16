'use strict'

const config = require('./config')
const fetch = require('npm-registry-fetch')

module.exports = {
  add (type, name, endpoint, secret, opts) {
    if (
      type !== 'scope' &&
      name &&
      name[0] === '@' &&
      name.indexOf('/') === -1
    ) {
      type = 'scope'
    }

    if (name && type === 'scope') {
      name = name.replace(/^@?/, '@')
    }

    opts = config({
      method: 'POST',
      body: { type, name, endpoint, secret }
    }, opts)
    return fetch.json('/-/npm/v1/hooks/hook', opts)
  },

  rm (id, opts) {
    return fetch.json(`/-/npm/v1/hooks/hook/${encodeURIComponent(id)}`, config({
      method: 'DELETE'
    }, opts))
  },

  ls (pkg, opts) {
    return fetch.json('/-/npm/v1/hooks', config({query: pkg && {package: pkg}}, opts))
      .then(json => json.objects)
  },

  update (id, endpoint, secret, opts) {
    return fetch.json(`/-/npm/v1/hooks/hook/${encodeURIComponent(id)}`, config({
      method: 'PUT',
      body: {endpoint, secret}
    }, opts))
  }
}
