const child_process = require('child_process');
const paths = require('../config/paths');

const args = process.argv.slice(2);

child_process.spawn('bundle exec nimbu', args, {
  shell: true,
  stdio: 'inherit',
  env: Object.assign({}, process.env, {
    BUNDLE_GEMFILE: paths.GEMFILE,
  }),
});
