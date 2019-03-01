import * as Config from '@oclif/config'
import anyTest, { TestInterface } from 'ava'
import nock from 'nock'

import Command from '../src/command'
import * as flags from '../src/flags'

const test = anyTest as TestInterface<{ config: Promise<Config.IConfig> }>

test.before(() => {
  nock.disableNetConnect()
})

test.beforeEach(t => {
  t.context = { config: Config.load() }
})

test.after(() => {
  nock.enableNetConnect()
})

class MyCommand extends Command {
  async run() {}
}

test('can set the current site', async t => {
  return class SiteCommand extends Command {
    static flags = {
      site: flags.site(),
    }

    async run() {
      const { flags } = this.parse(SiteCommand)
      t.true(flags.site === 'mysite')
    }
  }.run(['--site=mysite'])
})

test('has a nimbu api client', async t => {
  const cmd = new MyCommand([], await t.context.config)

  t.truthy(cmd.nimbu)
})
