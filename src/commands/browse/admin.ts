import Command from '../../command'
import Config from '../../nimbu/config'
import cli from 'cli-ux'

export default class BrowseAdmin extends Command {
  static description = 'open the admin area for your current site'

  async run() {
    await cli.open(`https://${Config.site}.${Config.host}/admin`)
  }
}
