import nock from 'nock'
import * as fs from 'fs'
import { patchFs } from 'fs-monkey'
import { vol } from 'memfs'
import { ufs } from 'unionfs'

import { test, stdout, stderr } from '../../helpers/setup'

let api: nock.Scope

test.serial('init', async t => {
  process.env.NIMBU_API_KEY = 'whatever'

  vol.fromJSON({ '/foo/bar': 'foo' })
  ufs.use(vol).use(fs)

  patchFs(ufs)

  api = nock('https://api.nimbu.io')
  api.get('/sites').reply(200, [{ name: 'Zenjoy', subdomain: 'zenjoy' }, { name: 'Nimbu', subdomain: 'nimbu' }])

  stdout.start()
  stderr.start()

  await t.context.config.runCommand('init', ['--site=zenjoy', '--cloudcode', '--haml'])

  stdout.stop()
  stderr.stop()

  t.is(
    stdout.output,
    'Initializing directories:\n' +
      '- layouts\n' +
      '- templates\n' +
      '- snippets\n' +
      '- stylesheets\n' +
      '- javascripts\n' +
      '- images\n' +
      '- haml/layouts\n' +
      '- haml/templates\n' +
      '- haml/snippets\n' +
      '- cloudcode\n',
  )

  console.log(require('fs').readFileSync('/foo/bar', 'utf8')) // [ 'dir' ]
})
