const paths = require('./paths.js')
const path = require('path');
const fs = require('fs');

const defaultConfig = {
  REACT: false,
  CDN_ROOT: '../',
};

const projectConfigPath = path.resolve(
  paths.PROJECT_DIRECTORY,
  'scripts',
  'config.js'
);

const projectConfig = fs.existsSync(projectConfigPath) ? require(projectConfigPath) : {};

module.exports = Object.assign({}, defaultConfig, projectConfig);
