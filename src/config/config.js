const paths = require('./paths.js');
const path = require('path');
const fs = require('fs');

const projectPackageJson = require(path.resolve(paths.PROJECT_DIRECTORY, 'package.json'));

const defaultConfig = {
  REACT: false,
  CDN_ROOT: '../',
};

let projectConfigPath;
if (projectPackageJson.nimbu && projectPackageJson.nimbu.config) {
  projectConfigPath = path.resolve(paths.PROJECT_DIRECTORY, projectPackageJson.nimbu.config);
} else {
  projectConfigPath = path.resolve(paths.NIMBU_DIRECTORY, 'nimbu.js');
}

const projectConfig = fs.existsSync(projectConfigPath) ? require(projectConfigPath) : {};

module.exports = Object.assign({}, defaultConfig, projectConfig);
