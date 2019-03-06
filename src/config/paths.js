const fs = require('fs')
const path = require('path')

const projectDirectory = fs.realpathSync(process.cwd())
const toolbeltDirectory = path.resolve(__dirname, '../..')

module.exports = {
  GEMFILE: path.resolve(toolbeltDirectory, 'Gemfile'),
  PROJECT_DIRECTORY: projectDirectory,
  TOOLBELT_DIRECTORY: toolbeltDirectory,
}
