import {Command, flags} from '@oclif/command'
import run from '../../nimbu-gem/command';

export default class SitesList extends Command {
  static description = 'list sites you can edit'

  async run() {
    await run('sites:list')
  }
}
