const child_process = require('child_process');

const args = process.argv.slice(2);

child_process.spawn('bundle exec nimbu', args, {
  shell: true,
  stdio: 'inherit',
});
