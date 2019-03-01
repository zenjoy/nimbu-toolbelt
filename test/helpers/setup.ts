import anyTest, { TestInterface } from 'ava'
import * as Config from '@oclif/config'
import nock from 'nock'

let env = process.env
const test = anyTest as TestInterface<{ config: Config.IConfig }>

test.before(() => {
  nock.disableNetConnect()
})

test.beforeEach(async t => {
  t.context = { config: await Config.load() }
})

test.afterEach(() => {
  process.env = env
})

test.after(() => {
  nock.enableNetConnect()
})

export default test
