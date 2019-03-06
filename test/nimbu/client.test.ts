import nock from 'nock'
import { test } from '../helpers/setup'

import { default as CommandBase } from '../../src/command'

class Command extends CommandBase {
  async run() {}
}

const token = 'YTljNzExMjYwNzAyYWQ2MmZjNDA4Yzdi'

const netrc = require('netrc-parser').default
netrc.loadSync = function(this: typeof netrc) {
  netrc.machines = {
    'api.nimbu.io': { token },
  }
}

let api: nock.Scope

test.serial('makes an HTTP request', async t => {
  api = nock('https://api.nimbu.io', {
    reqheaders: {
      authorization: `${token}`,
    },
  })
  api.get('/channels').reply(200, [{ name: 'mychannel' }])

  const cmd = new Command([], t.context.config)
  const result = await cmd.nimbu.get('/channels')
  t.deepEqual(result, [{ name: 'mychannel' }])
  t.true(api.isDone())
})

test.serial('can override authorization header', async t => {
  api = nock('https://api.nimbu.io', {
    reqheaders: { authorization: 'myotherpass' },
  })
  api.get('/channels').reply(200, [{ name: 'mychannel' }])

  const cmd = new Command([], t.context.config)
  const result = await cmd.nimbu.get('/channels', {
    headers: { Authorization: 'myotherpass' },
  })
  t.deepEqual(result, [{ name: 'mychannel' }])
})

test.serial('makes an HTTP request with NIMBU_HOST', async t => {
  process.env.NIMBU_HOST = 'http://api.nimbu.dev'
  api = nock('http://api.nimbu.dev')
  api.get('/channels').reply(200, [{ name: 'mychannel' }])

  const cmd = new Command([], t.context.config)
  const result = await cmd.nimbu.get('/channels')

  t.deepEqual(result, [{ name: 'mychannel' }])
  t.true(api.isDone())
})

test.serial('can fetch all pages', async t => {
  let api1 = nock('https://api.nimbu.io')
    .get('/channels')
    .reply(200, [{ name: 'foo' }], {
      Link: '<https://api.nimbu.io/channels?page=2>; rel="next", <https://api.nimbu.io/channels?page=2>; rel="last"',
    })

  let api2 = nock('https://api.nimbu.io')
    .get('/channels')
    .query({ page: 2 })
    .reply(200, [{ name: 'bar' }], {
      Link: '<https://api.nimbu.io/channels?page=1>; rel="prev", <https://api.nimbu.io/channels?page=1>; rel="first"',
    })

  const cmd = new Command([], t.context.config)
  const result = await cmd.nimbu.get('/channels', { fetchAll: true })
  t.deepEqual(result, [{ name: 'foo' }, { name: 'bar' }])
  t.true(api1.isDone() && api2.isDone())
})
