const fs = require('fs');
const path = require('path');

const projectDirectory = fs.realpathSync(process.cwd());
const toolbeltDirectory = path.resolve(__dirname, '../..');
const nimbuDirectory =
  process.env.NIMBU_DIRECTORY != null
    ? path.resolve(process.env.NIMBU_DIRECTORY)
    : projectDirectory;

module.exports = {
  PROJECT_DIRECTORY: projectDirectory,
  TOOLBELT_DIRECTORY: toolbeltDirectory,
  GEMFILE: path.resolve(toolbeltDirectory, 'Gemfile'),
  NIMBU_DIRECTORY: nimbuDirectory,
};
