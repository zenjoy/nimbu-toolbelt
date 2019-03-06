import anyTest, { TestInterface } from 'ava'
import * as Config from '@oclif/config'
import nock from 'nock'
import { stdout, stderr } from 'stdout-stderr'

let env = Object.assign({}, process.env)
const test = anyTest as TestInterface<{ config: Config.IConfig }>

test.serial.before(() => {
  nock.disableNetConnect()
})

test.beforeEach(async t => {
  process.env = Object.assign({}, { DEBUG: process.env.DEBUG })
  t.context = { config: await Config.load() }
})

test.afterEach.always(() => {
  process.env = env
  stdout.stop()
  stderr.stop()
})

test.after.always(() => {
  nock.enableNetConnect()
})

export { test, stdout, stderr }
