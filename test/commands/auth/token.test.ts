import nock from 'nock'
import { test, stdout, stderr } from '../../helpers/setup'

let api: nock.Scope

test.serial('auth:token', async t => {
  process.env.NIMBU_API_KEY = 'foobar'

  api = nock('https://api.nimbu.io')
  api.get('/authorizations/api').reply(200, [{ token: 'waldo' }, { token: 'foobar', expires_in: 60 }, {}])

  stdout.start()
  stderr.start()

  await t.context.config.runCommand('auth:token')

  t.regex(stderr.output, new RegExp('Warning: token will expire today'))
  t.is(stdout.output, 'foobar\n')
})
