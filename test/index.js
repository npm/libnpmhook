'use strict'

const test = require('tap').test
const tnock = require('./util/tnock.js')

const hooks = require('../index.js')

const OPTS = {
  registry: 'https://mock.reg/'
}
const HOOK_URL = 'https://my.hook.url/'

test('add package hook', t => {
  tnock(t, OPTS.registry)
    .post('/-/npm/v1/hooks/hook')
    .reply(200, (uri, body) => body)
  return hooks.add('mypkg', HOOK_URL, 'sekrit', OPTS)
    .then(json => t.deepEqual(json, {
      type: 'package',
      name: 'mypkg',
      endpoint: HOOK_URL,
      secret: 'sekrit'
    }))
})

test('add scoped package hook', t => {
  tnock(t, OPTS.registry)
    .post('/-/npm/v1/hooks/hook')
    .reply(200, (uri, body) => body)
  return hooks.add('@myscope/mypkg', HOOK_URL, 'sekrit', OPTS)
    .then(json => t.deepEqual(json, {
      type: 'package',
      name: '@myscope/mypkg',
      endpoint: HOOK_URL,
      secret: 'sekrit'
    }))
})

test('add owner hook', t => {
  tnock(t, OPTS.registry)
    .post('/-/npm/v1/hooks/hook')
    .reply(200, (uri, body) => body)
  return hooks.add('~myuser', HOOK_URL, 'sekrit', OPTS)
    .then(json => t.deepEqual(json, {
      type: 'owner',
      name: 'myuser',
      endpoint: HOOK_URL,
      secret: 'sekrit'
    }))
})

test('add scope hook', t => {
  tnock(t, OPTS.registry)
    .post('/-/npm/v1/hooks/hook')
    .reply(200, (uri, body) => body)
  return hooks.add('@myscope', HOOK_URL, 'sekrit', OPTS)
    .then(json => t.deepEqual(json, {
      type: 'scope',
      name: '@myscope',
      endpoint: HOOK_URL,
      secret: 'sekrit'
    }))
})

test('rm', t => {
  tnock(t, OPTS.registry)
    .delete('/-/npm/v1/hooks/hook/1')
    .reply(200, {ok: true})
  return hooks.rm(1, OPTS)
    .then(json => t.ok(json.ok, 'delete succeeded'))
})

test('ls', t => {
  tnock(t, OPTS.registry)
    .get('/-/npm/v1/hooks?package=%40npm%2Fhooks')
    .reply(200, {objects: [{id: 1}]})
  return hooks.ls('@npm/hooks', OPTS)
    .then(json => t.deepEqual(json, [{id: 1}]))
})

test('update', t => {
  tnock(t, OPTS.registry)
    .put('/-/npm/v1/hooks/hook/1')
    .reply(200, (uri, body) => body)
  return hooks.update(1, HOOK_URL, 'sekrit', OPTS)
    .then(json => t.deepEqual(json, {
      endpoint: HOOK_URL,
      secret: 'sekrit'
    }))
})
