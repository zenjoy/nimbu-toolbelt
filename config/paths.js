const fs = require('fs');

const projectDirectory = fs.realpathSync(process.cwd());

module.exports = {
  PROJECT_DIRECTORY: projectDirectory,
}
