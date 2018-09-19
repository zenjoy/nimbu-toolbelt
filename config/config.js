const paths = require('./paths.js')
const path = require('path');

const defaultConfig = {
  REACT: false,
  CDN_ROOT: '../',
};

const projectConfig = require(path.resolve(
  paths.PROJECT_DIRECTORY,
  'scripts',
  'config.js'
));

module.exports = Object.assign({}, defaultConfig, projectConfig);
