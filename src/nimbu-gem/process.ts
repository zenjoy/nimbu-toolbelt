import { spawn, ChildProcess, StdioOptions } from 'child_process'
import Config from '../nimbu/config'
const paths = require('../config/paths')

export default function(
  token: string,
  command: string,
  args: Array<string> = [],
  stdio: StdioOptions = 'inherit',
): ChildProcess {
  return spawn('bundle', ['exec', 'nimbu', command].concat(args), {
    shell: true,
    stdio,
    cwd: paths.NIMBU_DIRECTORY,
    env: Object.assign({}, process.env, {
      NIMBU_API_KEY: token,
      BUNDLE_GEMFILE: paths.GEMFILE,
      NIMBU_SITE: Config.site,
    }),
  })
}
