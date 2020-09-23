const paths = require('./paths.js')
const path = require('path')

const defaultConfig = {
  CDN_ROOT: '../',
  REACT: false,
}
let projectConfigPath

try {
  const projectPackageJson = require(path.resolve(paths.PROJECT_DIRECTORY, 'package.json'))
  if (projectPackageJson.nimbu && projectPackageJson.nimbu.config) {
    projectConfigPath = path.resolve(paths.PROJECT_DIRECTORY, projectPackageJson.nimbu.config)
  } else {
    projectConfigPath = path.resolve(paths.PROJECT_DIRECTORY, 'nimbu.js')
  }
} catch (_) {
  // do nothing, we are probably running the nimbu command in global context, i.e. to initialize a project
}

let projectConfig = {}
try {
  projectConfig = require(projectConfigPath)
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') {
    throw error
  }
}

let config = defaultConfig

async function initialize() {
  const prC = await Promise.resolve(projectConfig)
  config = Object.assign({}, defaultConfig, prC)
  return config
}

function get() {
  return config
}

module.exports = {
  get,
  initialize,
}
