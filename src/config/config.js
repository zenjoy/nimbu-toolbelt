const paths = require('./paths.js')
const path = require('path')
const fs = require('fs')

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

const projectConfig = fs.existsSync(projectConfigPath) ? require(projectConfigPath) : {}

module.exports = Object.assign({}, defaultConfig, projectConfig)
