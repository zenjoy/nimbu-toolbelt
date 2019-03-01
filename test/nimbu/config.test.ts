import test from 'ava'
import config from '../../src/nimbu/config'

let env = process.env
test.beforeEach(() => {
  process.env = {}
})
test.afterEach(() => {
  process.env = env
})

test('sets vars by default', t => {
  t.true(config.host === 'nimbu.io')
  t.true(config.apiHost === 'api.nimbu.io')
  t.true(config.apiUrl === 'https://api.nimbu.io')
})

test('respects NIMBU_HOST', t => {
  process.env.NIMBU_HOST = 'customhost'

  t.true(config.host === 'customhost')
  t.true(config.apiHost === 'api.customhost')
  t.true(config.apiUrl === 'https://api.customhost')
})

test('respects NIMBU_HOST as url', t => {
  process.env.NIMBU_HOST = 'http://customhost'

  t.true(config.host === 'http://customhost')
  t.true(config.apiHost === 'customhost')
  t.true(config.apiUrl === 'http://customhost')
})
