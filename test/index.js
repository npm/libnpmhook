'use strict'

const test = require('tap').test
const tnock = require('./util/tnock.js')

const hooks = require('../index.js')

const OPTS = {
  registry: 'https://mock.reg/'
}
const HOOK_URL = 'https://my.hook.url/'

test('add', t => {
  tnock(t, OPTS.registry)
    .post('/v1/hooks/hook')
    .reply(200, (uri, body) => body)
  return hooks.add('package', '@npm/hooks', HOOK_URL, 'sekrit', OPTS)
    .then(json => t.deepEqual(json, {
      type: 'package',
      name: '@npm/hooks',
      endpoint: HOOK_URL,
      secret: 'sekrit'
    }))
})

test('rm', t => {
  tnock(t, OPTS.registry)
    .delete('/v1/hooks/hook/1')
    .reply(200, {ok: true})
  return hooks.rm(1, OPTS)
    .then(json => t.ok(json.ok, 'delete succeeded'))
})

test('ls', t => {
  tnock(t, OPTS.registry)
    .get('/v1/hooks?package=%40npm%2Fhooks')
    .reply(200, {objects: [{id: 1}]})
  return hooks.ls('@npm/hooks', OPTS)
    .then(json => t.deepEqual(json, [{id: 1}]))
})

test('update', t => {
  tnock(t, OPTS.registry)
    .put('/v1/hooks/hook/1')
    .reply(200, (uri, body) => body)
  return hooks.update(1, HOOK_URL, 'sekrit', OPTS)
    .then(json => t.deepEqual(json, {
      endpoint: HOOK_URL,
      secret: 'sekrit'
    }))
})
