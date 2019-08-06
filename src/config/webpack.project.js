const paths = require('./paths.js')
const path = require('path')
const fs = require('fs')

const projectPackageJson = require(path.resolve(paths.PROJECT_DIRECTORY, 'package.json'))

const defaultWebpack = {
  customize: defaultConfig => defaultConfig,
}

let projectWebpackPath
if (projectPackageJson.nimbu && projectPackageJson.nimbu.webpack) {
  projectWebpackPath = path.resolve(paths.PROJECT_DIRECTORY, projectPackageJson.nimbu.webpack)
} else {
  projectWebpackPath = path.resolve(paths.PROJECT_DIRECTORY, 'webpack.js')
}

const projectWebpack = fs.existsSync(projectWebpackPath) ? require(projectWebpackPath) : {}

module.exports = Object.assign({}, defaultWebpack, projectWebpack)
