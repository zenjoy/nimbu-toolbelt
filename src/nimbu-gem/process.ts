import { spawn, ChildProcess, StdioOptions } from 'child_process'
import Config from '../nimbu/config'
const paths = require('../config/paths')

export default function(
  command: string,
  args: Array<string> = [],
  stdio: StdioOptions = 'inherit'
): ChildProcess {
  return spawn('bundle', ['exec', 'nimbu', command].concat(args), {
    shell: true,
    stdio,
    env: Object.assign({}, process.env, {
      BUNDLE_GEMFILE: paths.GEMFILE,
      NIMBU_SITE: Config.site
    })
  })
}
