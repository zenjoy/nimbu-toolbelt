import nock from 'nock'
import { test, stdout, stderr } from '../../helpers/setup'

let api: nock.Scope

test.serial('auth:whoami - when logged in', async t => {
  process.env.NIMBU_API_KEY = 'whatever'

  api = nock('https://api.nimbu.io')
  api.get('/user').reply(200, { email: 'jeff@example.com', name: 'Jeff' })

  stdout.start()
  stderr.start()

  await t.context.config.runCommand('auth:whoami')

  t.is(stderr.output, ' ›   Warning: NIMBU_API_KEY is set\n')
  t.is(stdout.output, 'jeff@example.com (Jeff)\n')
})

test.serial('auth:whoami - when unauthenticated', async t => {
  api = nock('https://api.nimbu.io')
  api.get('/user').reply(401)

  try {
    await t.context.config.runCommand('auth:whoami')
  } catch (error) {
    t.is(error.message, 'not logged in')
    t.is(error.oclif.exit, 100)
  }
})
