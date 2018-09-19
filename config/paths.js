const fs = require('fs');
const path = require('path');

const projectDirectory = fs.realpathSync(process.cwd());
const toolbeltDirectory = path.resolve(__dirname, '..');

module.exports = {
  PROJECT_DIRECTORY: projectDirectory,
  TOOLBELT_DIRECTORY: toolbeltDirectory,
  GEMFILE: path.resolve(toolbeltDirectory, 'Gemfile'),
}
